import pcap from 'pcap'

const spyOnNet = (iface = 'en0', filter = 'ip proto \\tcp') => {
  const tracker = new pcap.TCPTracker()
  const session = pcap.createSession(iface, filter)
  session.on('packet', (packetRaw) => {
    const packet = pcap.decode.packet(packetRaw)
    tracker.track_packet(packet)
    console.log('PACKET', packet.payload.payload.identification, packet.payload.shost.addr.join('.'), '→', packet.payload.dhost.addr.join('.'))
  })
  tracker.on('session', (session) => {
    console.log('START', session.src_name, '→', session.dst_name)
    session.on('end', (session) => {
      console.log('END', session.src_name, '→', session.dst_name)
    })
  })
  return [ tracker, session ]
}

spyOnNet(process.env.WATCHNET_DEV || pcap.findalldevs()[0].name, 'ip proto \\tcp')
