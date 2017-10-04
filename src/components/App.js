import React from 'react'
import { connect } from 'react-redux'

export const App = ({session}) => (
  <table className='App'>
    <thead>
      <tr>
        <th>Source &rarr; Destination</th>
      </tr>
    </thead>
    <tbody>
      {session.map((s, i) => (
        <tr key={i}>
          <td>{s.src_name} &rarr; {s.dst_name}</td>
        </tr>
      ))}
    </tbody>
  </table>
)

export default connect(state => state)(App)
