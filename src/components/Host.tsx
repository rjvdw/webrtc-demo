import { FunctionComponent } from 'react'
import HostInfo from './HostInfo.tsx'
import { usePeerHost } from '../lib/peer.ts'
import { useSelector } from 'react-redux'
import { selectClients, selectMessages } from '../state/slices/host.ts'

export const Host: FunctionComponent = () => {
  const { peer, error } = usePeerHost()
  const clients = useSelector(selectClients)
  const messages = useSelector(selectMessages)

  return (
    <>
      <h1>WebRTC Demo</h1>
      <HostInfo peer={peer} error={error} />

      <h2>Clients</h2>
      {clients.length === 0 ? (
        <p>Nog geen clients verbonden</p>
      ) : (
        <ul>
          {clients.map((client) => (
            <li key={client}>
              {client}
              {(messages[client]?.length ?? 0) > 0 && (
                <ul>
                  {messages[client].map((msg, idx) => (
                    <li key={idx}>{msg}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
export default Host
