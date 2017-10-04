import http from 'http'
import express from 'express'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import socketIo from 'socket.io'
import pcap from 'pcap'

import config from './webpack.config.babel.js'

const app = express()
const server = http.createServer(app)
const io = socketIo()
io.attach(server)
app.io = io

app.set('port', process.env.PORT || 8000)
app.use(express.static('public/'))

// total count of packets to hold onto
const WATCHNET_COUNT = process.env.WATCHNET_COUNT || 10000
let sessions = []
let packets = {}

if (process.env.NODE_ENV !== 'production') {
  const compiler = webpack(config)
  app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
    stats: 'errors-only'
  }))
  app.use(webpackHotMiddleware(compiler))
}

const spyOnNet = (socket, iface = 'en0', filter = 'ip proto \\tcp') => {
  const tracker = new pcap.TCPTracker()
  const session = pcap.createSession(iface, filter)
  session.on('packet', (packetRaw) => {
    const packet = pcap.decode.packet(packetRaw)
    tracker.track_packet(packet)
    // socket.emit('packet', packet)
  })
  tracker.on('session', (session) => {
    // socket.emit('tcp:start', session)
    session.on('end', (session) => {
      // socket.emit('tcp:end', session)
      socket.emit('session', session)
      sessions.push(session)
      sessions = sessions.slice(-1 * WATCHNET_COUNT)
    })
  })
  return [ tracker, session ]
}

spyOnNet(io, process.env.WATCHNET_DEV || pcap.findalldevs()[0].name, 'ip proto \\tcp')

io.on('connection', socket => {
  console.log(`Socket connected: ${socket.id}`)
  sessions.forEach(session => {
    socket.emit('session', session)
  })
  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`)
  })
})

const address = pcap.findalldevs()[0].addresses.filter(i => i && i.addr && i.addr.indexOf('.') !== -1).pop()
server.listen(app.get('port'))
console.log(`Listening on http://${address ? address.addr : '0.0.0.0'}:${app.get('port')}`)

export default app
