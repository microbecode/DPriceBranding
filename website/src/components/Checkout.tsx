import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useWeb3Context } from 'web3-react'

import Connect from './Connect'
import Works from './Works'
import BuyAndSell from './BuyAndSell'
import Redeem from './Redeem'
import Confirmed from './Confirmed'
import { useAppContext } from '../context'
import { TRADE_TYPES } from '../utils'

import Confetti from 'react-dom-confetti'
import { IAppContextState, IValidateTrade } from 'types'

const config = {
  angle: 90,
  spread: 76,
  startVelocity: 51,
  elementCount: 154,
  dragFriction: 0.1,
  duration: 7000,
  stagger: 0,
  width: '10px',
  height: '10px',
  colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a']
}

export function useCount(initialValue, max) {
  const { state, setState } = useAppContext()

  function increment() {
    setState((state : IAppContextState) => {
      const newCount = state.count.add(1)
      if (!max || newCount.lte(max)) {
        return { ...state, count: newCount }
      } else {
        return state
      }
    })
  }

  function decrement() {
    if (state.count.gt(1)) {
      setState({ ...state, count: state.count.sub(1) })
    }
  }

  function setCount(val) {
    setState ({ ...state, count: val })
  }

  // ok to disable exhaustive-deps for `setState` b/c it's actually just a useState setter
  useEffect(() => {
    if (initialValue) {
      setState({ ...state, count: initialValue })
    }
  }, [initialValue]) // eslint-disable-line react-hooks/exhaustive-deps

  return [state.count, increment, decrement, setCount]
}

interface Props {
  ready,
  validateBuy : IValidateTrade,
  buy,
  burn,
  balanceOWN,
  dollarPrice,
  reserveOWNToken,
  dollarize,
  currentTransactionHash?,
  currentTransactionType?,
  currentTransactionAmount?,
  setCurrentTransaction,
  clearCurrentTransaction,
  setShowConnect,
  showConnect,
  showWorks,
  setShowWorks
}

export default function Checkout({
  ready,
  validateBuy,
  buy,
  burn,
  balanceOWN,
  dollarPrice,
  reserveOWNToken,
  dollarize,
  currentTransactionHash,
  currentTransactionType,
  currentTransactionAmount,
  setCurrentTransaction,
  clearCurrentTransaction,
  setShowConnect,
  showConnect,
  showWorks,
  setShowWorks
} : Props) {
  const { library } = useWeb3Context()
  const { state, setState } = useAppContext()

  const redeeming = state.tradeType === TRADE_TYPES.REDEEM

  const [lastTransactionHash, setLastTransactionHash] = useState('')
  const [lastTransactionType, setLastTransactionType] = useState('')
  const [lastTransactionAmount, setLastTransactionAmount] = useState('')

  const pending = !!currentTransactionHash
  useEffect(() => {
    if (currentTransactionHash) {
      library.waitForTransaction(currentTransactionHash).then(() => {
        setLastTransactionHash(currentTransactionHash)
        setLastTransactionType(currentTransactionType)
        setLastTransactionAmount(currentTransactionAmount)
        console.log('clearing tr');
        clearCurrentTransaction()
      })
    }
  }, [
    currentTransactionHash,
    library,
    lastTransactionHash,
    state.showConnect,
    state.visible,
    setShowWorks,
    setShowConnect,
    clearCurrentTransaction,
    lastTransactionHash,
    currentTransactionType,
    currentTransactionAmount
  ])

  function closeCheckout() {
    setShowConnect(false)
    if (state.visible) {
      setShowWorks(false)
      setLastTransactionHash('')
      setState(state => ({ ...state, visible: !state.visible }))
    }
  }

  function renderContent() {
    if (showConnect) {
      return <Connect setShowConnect={setShowConnect} closeCheckout={closeCheckout} />
    } else if (showWorks) {
      return <Works closeCheckout={closeCheckout} />
    } else if (lastTransactionHash) {
      return (
        <Confirmed
          hash={lastTransactionHash}
          type={lastTransactionType}
          amount={lastTransactionAmount}
          closeCheckout={closeCheckout}
          clearLastTransaction={() => {
            setLastTransactionHash('')
            setLastTransactionType('')
            setLastTransactionAmount('')
          }}
        />
      )
    } else {
      if (!redeeming) {
      return (
        <BuyAndSell
          ready={ready}
          validateBuy={validateBuy}
          buy={buy}
          dollarize={dollarize}
          setCurrentTransaction={setCurrentTransaction}
          currentTransactionHash={currentTransactionHash}
          setShowConnect={setShowConnect}
          dollarPrice={dollarPrice}
          reserveOWNToken={reserveOWNToken}
          pending={pending}
        />
      )
      }
      else {
        return (
          <Redeem
            burn={burn}
            balanceOWN={balanceOWN}
            setShowConnect={setShowConnect}
            closeCheckout={closeCheckout}
          />
        )
      }      
    }
  }

  return (
    <div>
      <CheckoutFrame isVisible={state.visible || showConnect}>
        {renderContent()}{' '}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <Confetti active={!!lastTransactionHash} config={config} />
        </div>
      </CheckoutFrame>
      <CheckoutBackground onClick={() => closeCheckout()} isVisible={state.visible || showConnect} />
    </div>
  )
}

const CheckoutFrame = styled.div`
  position: fixed;
  bottom: ${props => (props.isVisible ? '0px' : '-100%')};
  left: 0px;
  z-index: 2;
  visibility: ${props => !props.isVisible && 'hidden'};

  transition: bottom 0.3s;
  width: 100%;
  margin: 0;
  margin-top: 20px;
  height: 524px;
  height: fit-content;
  border-radius: 8px 8px 0px 0px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  background-color: #fff;
  border-color: ${props => props.theme.black};
  color: ${props => props.theme.textColor};
  box-sizing: border-box;
  background-color: black;

  @media only screen and (min-device-width: 768px) {
    max-width: 375px;
    left: 0;
    right: 0;
    border-radius: 8px 8px;
    visibility: ${props => !props.isVisible && 'hidden'};

    bottom: ${props => (props.isVisible ? '20%' : '-100%')};

    position: absolute;
    left: 50%;
    top: 40%;
    -webkit-transform: translateX(-50%) translateY(-50%);
    -ms-transform: translateX(-50%) translateY(-50%);
    transform: translateX(-50%) translateY(-50%);
    width: 100%;
  }

  p {
    margin: 0px;
  }
`

const CheckoutBackground = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  opacity: ${props => (props.isVisible ? '.5' : '0')};
  width: 100vw;
  height: 100vh;
  z-index: ${props => (props.isVisible ? '1' : '-1')};
  pointer-events: ${props => (props.isVisible ? 'all' : 'none')};
  background-color: ${props => props.theme.black};
  transition: opacity 0.3s;
  pointer-events: ${props => (props.isVisible ? 'all' : 'none')};
`
