import { useEffect, useState } from 'react'
import { DataConnection, Peer, PeerJSOption } from 'peerjs'
import { useDispatch } from 'react-redux'
import { StoreDispatch } from '../state/store.ts'
import { addClient, addMessage, removeClient } from '../state/slices/host.ts'

export function usePeerClient(hostId: string) {
  const { peer } = usePeer()
  const [error, setError] = useState<string>()
  const [connection, setConnection] = useState<DataConnection>()

  useEffect(() => {
    if (peer) {
      const init = async () => {
        const connection = await initConnection(peer, hostId)

        connection.on('error', (err) => {
          setError(errToString(err))
          console.error(err)
        })

        connection.on('close', () => {
          console.debug('connection closed')
        })

        return connection
      }

      init().then(
        (connection) => setConnection(connection),
        (err) => setError(errToString(err)),
      )

      // FIXME:
      // return () => {
      //   connection.close()
      // }
    }
  }, [peer, hostId])

  // log any errors if they occurred
  useEffect(() => {
    if (error) {
      console.error(error)
    }
  }, [error])

  return {
    connection,
    error,
  }
}

export function usePeerHost() {
  const { peer, error } = usePeer()
  const dispatch = useDispatch<StoreDispatch>()

  useEffect(() => {
    if (peer) {
      peer.on('connection', (connection) => {
        connection.on('open', () => {
          console.debug('client connected', connection)
          dispatch(addClient(connection.peer))
        })

        connection.on('error', (err) => {
          console.error(err)
        })

        connection.on('data', (data) => {
          console.debug('client sent data', data)
          dispatch(addMessage(connection.peer, String(data)))
        })

        connection.on('close', () => {
          console.debug('client disconnected', connection)
          dispatch(removeClient(connection.peer))
        })
      })
    }
  }, [dispatch, peer])

  return {
    peer,
    error,
  }
}

function usePeer() {
  const [error, setError] = useState<string>()
  const [config, setConfig] = useState<PeerJSOption>()
  const [peer, setPeer] = useState<Peer>()

  // fetch the peer config
  useEffect(() => {
    fetchPeerConfig().then(
      (config) => setConfig(config),
      (err) => setError(errToString(err)),
    )
  }, [])

  // as soon as there is a valid peer config, initialize the peer instance
  useEffect(() => {
    if (config) {
      initPeer(config).then(
        (peer) => setPeer(peer),
        (err) => setError(errToString(err)),
      )
    }
  }, [config])

  // log any errors if they occurred
  useEffect(() => {
    if (error) {
      console.error(error)
    }
  }, [error])

  return {
    peer,
    error,
  }
}

/**
 * Read an environment variable.
 *
 * @param key
 */
function readEnv(key: string): string | undefined

/**
 * Read an environment variable and use a default value if it's not present.
 *
 * @param key
 * @param defaultValue
 */
function readEnv(key: string, defaultValue: string): string
function readEnv(key: string, defaultValue?: string): string | undefined {
  const value = import.meta.env[key] as string | undefined

  return value ?? defaultValue
}

/**
 * Converts an error of unknown type to a string.
 *
 * @param err
 */
function errToString(err: unknown): string {
  if (typeof err === 'string') {
    return err
  }

  if (err instanceof Error) {
    return err.message
  }

  return String(err)
}

/**
 * Fetch the peer config from metered.ca, using configuration from environment variables.
 */
async function fetchPeerConfig(): Promise<PeerJSOption> {
  const meteredProject = readEnv('VITE_METERED_PROJECT')
  const meteredApiKey = readEnv('VITE_METERED_API_KEY')

  if (!meteredProject || !meteredApiKey) {
    throw new Error(
      'missing required environment variables for setting up peer config',
    )
  }

  const response = await fetch(
    `https://${meteredProject}.metered.live/api/v1/turn/credentials?apiKey=${meteredApiKey}`,
  )
  const rtcConfiguration = (await response.json()) as RTCConfiguration

  return {
    config: rtcConfiguration,
    host: readEnv('VITE_PEER_HOST', 'localhost'),
    port: Number(readEnv('VITE_PEER_PORT', '9000')),
    path: readEnv('VITE_PEER_PATH', '/'),
  }
}

/**
 * Initializes a Peer instance and wait for its `open` event.
 *
 * @param config
 * @param timeout
 */
function initPeer(config: PeerJSOption, timeout = 2000): Promise<Peer> {
  return new Promise((resolve, reject) => {
    const handle = setTimeout(() => {
      reject(new Error(`initializing peer timed out after ${timeout}ms`))
    }, timeout)

    console.debug('setting up new peer instance', config)
    const peer = new Peer(config)

    peer.on('open', () => {
      clearTimeout(handle)
      resolve(peer)
    })

    peer.on('error', (err) => {
      clearTimeout(handle)
      reject(err)
    })
  })
}

function initConnection(
  peer: Peer,
  hostId: string,
  timeout = 2000,
): Promise<DataConnection> {
  return new Promise((resolve, reject) => {
    const handle = setTimeout(() => {
      reject(new Error(`initializing connection timed out after ${timeout}ms`))
    }, timeout)

    console.debug('setting up new connection to', hostId)
    const connection = peer.connect(hostId, {
      reliable: true,
    })

    connection.on('open', () => {
      clearTimeout(handle)
      resolve(connection)
    })

    connection.on('error', (err) => {
      clearTimeout(handle)
      reject(err)
    })
  })
}
