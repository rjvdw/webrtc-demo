import { FunctionComponent } from 'react'
import Client from './Client.tsx'
import Host from './Host.tsx'

export const App: FunctionComponent = () => {
  if (isClient()) {
    return <Client />
  }

  return <Host />
}

export default App

function isClient() {
  return location.pathname.startsWith('/join')
}
