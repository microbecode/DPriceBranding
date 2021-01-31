import React, { useContext } from 'react'
import { IAppContext, IAppContextState } from 'types'

import { TRADE_TYPES } from '../utils'

const initialState : IAppContextState = {
  visible: false,
  count: 1,
  valid: false,
  tradeType: TRADE_TYPES.BUY,
  showConnect: false
}

export const AppContext = React.createContext<IAppContext>(
  {
    state: initialState,
    setState: () => {}
  }
)

export function useAppContext() {
  return useContext(AppContext)
}