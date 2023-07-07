import { FunctionComponent } from 'react'
import { DataConnection } from 'peerjs'

export type ClientInfoProps = {
  connection?: DataConnection
  error?: string
}

export const ClientInfo: FunctionComponent<ClientInfoProps> = ({
  connection,
  error,
}) => {
  if (error) {
    return (
      <p className="error-message">
        Opzetten van client is gefaald met fout: <code>{error}</code>
      </p>
    )
  }

  if (connection) {
    return (
      <>
        <p>Client is opgezet, id: {connection.peer}</p>
      </>
    )
  }

  return <p>Momentje... client wordt opgestart.</p>
}

export default ClientInfo
