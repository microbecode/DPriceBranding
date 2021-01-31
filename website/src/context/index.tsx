import React, { useState, useContext } from 'react'

import { TRADE_TYPES } from '../utils'

export interface AppI {
  visible: boolean,
  count: number,
  valid : boolean,
  tradeType: string
}

export interface ContextI {
  state: AppI,
  setState: (AppI) => void
}

const initialState : AppI = {
  visible: false,
  count: 1,
  valid: false,
  tradeType: TRADE_TYPES.BUY
}

export const AppContext = React.createContext<ContextI>(
  {
    state: initialState,
    setState: () => {}
  }
)

export function useAppContext() {
  return useContext(AppContext)
}



/*  export default function AppProvider({ children }) {
  const [state, setState] = useState(initialState)

  return <AppContext.Provider value={[state, setState]}>{children}</AppContext.Provider>
} */
/*
export function useAppContext() {
  return useContext(AppContext) */

/*
interface AppI {
  visible: boolean,
  count: number,
  valid : boolean,
  tradeType: string
}

const initialState : AppI = {
  visible: false,
  count: 1,
  valid: false,
  tradeType: TRADE_TYPES.BUY
}

export const AppContext = React.createContext([initialState, () => {}])



export default function AppProvider({ children }) {
  const [state, setState] = useState(initialState)

  return <AppContext.Provider value={[state, setState]}>{children}</AppContext.Provider>
}

export function useAppContext() {
  return useContext(AppContext)
}*/

/*
import React, { useState, useContext } from 'react'

import { TRADE_TYPES } from '../utils'



interface AppI {
  visible: boolean,
  count: number,
  valid : boolean,
  tradeType: string
}

interface ContextI {
  data: AppI,
  change: (AppI) => void
};

const initialState: AppI = {
  visible: false,
  count: 1,
  valid: false,
  tradeType: TRADE_TYPES.BUY
}

const changeIt = (val : AppI) => {

}

export const AppContext = React.createContext<ContextI>({ data: initialState, change: changeIt })

 export default function AppProvider({ children }) {
  const [state, setState] = useState(initialState)

  return <AppContext.Provider value={[state, setState]}>{children}</AppContext.Provider>
} 



export function useAppContext() {
  const aa = useContext(AppContext);
  return [aa.data, aa.change];
}

*/
