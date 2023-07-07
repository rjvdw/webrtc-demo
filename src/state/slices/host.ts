import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { StoreState } from '../store.ts'

export type State = {
  clients: string[]
  messages: Record<string, string[]>
}

const INITIAL_STATE: State = {
  clients: [],
  messages: {},
}

type ClientAction = PayloadAction<string>
type MessageAction = PayloadAction<{ clientId: string; message: string }>

const host = createSlice({
  name: 'host',
  initialState: INITIAL_STATE,
  reducers: {
    addClient(state, { payload: clientId }: ClientAction) {
      return {
        ...state,
        clients: state.clients.concat(clientId),
      }
    },
    removeClient(state, { payload: clientId }: ClientAction) {
      return {
        ...state,
        clients: state.clients.filter((c) => c !== clientId),
      }
    },
    addMessage(state, { payload: { message, clientId } }: MessageAction) {
      return {
        ...state,
        messages: {
          ...state.messages,
          [clientId]: (state.messages[clientId] ?? []).concat(message),
        },
      }
    },
    reset() {
      return INITIAL_STATE
    },
  },
})

export default host.reducer

export function addClient(clientId: string) {
  return host.actions.addClient(clientId)
}

export function removeClient(clientId: string) {
  return host.actions.removeClient(clientId)
}

export function addMessage(clientId: string, message: string) {
  return host.actions.addMessage({ clientId, message })
}

export function reset() {
  return host.actions.reset
}

export const selectClients = createSelector(
  (state: StoreState) => state.host,
  ({ clients }) => [...clients],
)

export const selectMessages = createSelector(
  (state: StoreState) => state.host,
  ({ messages }) => messages, // FIXME: shallow copy
)
