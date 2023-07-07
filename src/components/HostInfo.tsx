import { FunctionComponent } from 'react'
import { Peer } from 'peerjs'
import { JoinCode } from './JoinCode.tsx'

export type HostInfoProps = {
  peer?: Peer
  error?: string
}

export const HostInfo: FunctionComponent<HostInfoProps> = ({ peer, error }) => {
  if (error) {
    return (
      <p className="error-message">
        Opzetten van host is gefaald met fout: <code>{error}</code>
      </p>
    )
  }

  if (peer) {
    return (
      <>
        <p>Host is opgezet, id: {peer.id}</p>
        <JoinCode href={`${location.origin}/join/${peer.id}`} />
      </>
    )
  }

  return <p>Momentje... host wordt opgestart.</p>
}

export default HostInfo
