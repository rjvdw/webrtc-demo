import { FunctionComponent, useCallback, useEffect } from 'react'
import { usePeerClient } from '../lib/peer.ts'
import ClientInfo from './ClientInfo.tsx'

export const Client: FunctionComponent = () => {
  const id = getHostId()
  const { connection, error } = usePeerClient(id)

  useEffect(() => {
    console.debug('connection', connection)
  }, [connection])

  const sendAction = useCallback(() => {
    if (connection) {
      connection.send('hi')
    }
  }, [connection])

  return (
    <>
      <h1>Client</h1>
      <ClientInfo connection={connection} error={error} />

      <button onClick={() => sendAction()}>Click me!</button>
    </>
  )
}
export default Client

function getHostId(): string {
  return location.pathname.substring(6)
}
