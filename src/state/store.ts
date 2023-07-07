import {
  AnyAction,
  combineReducers,
  configureStore,
  ThunkAction,
} from '@reduxjs/toolkit'
import host from './slices/host.ts'

export const reducer = combineReducers({
  host,
})

export const store = configureStore({ reducer })

export type Store = typeof store
export type StoreDispatch = typeof store.dispatch
export type StoreGetState = typeof store.getState
export type StoreState = ReturnType<typeof reducer>
export type StoreThunk<ReturnType = Promise<void>> = ThunkAction<
  ReturnType,
  StoreState,
  unknown,
  AnyAction
>
