import { ethers } from 'ethers'
import React, { useContext } from 'react'
import { IAppContext, IAppContextState } from 'types'

import { TRADE_TYPES } from '../utils'

export const initialContextState : IAppContextState = {
  visible: false,
  count: ethers.utils.bigNumberify(1),
  valid: false,
  tradeType: TRADE_TYPES.BUY,
  showConnect: false
}

export const AppContext = React.createContext<IAppContext>(
  {
    state: initialContextState,
    setState: () => {}
  }
)

export function useAppContext() {
  return useContext(AppContext)
}