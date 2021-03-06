import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { useWeb3Context } from 'web3-react'

import Button from './Button'
import IncrementToken from './IncrementToken'
import { useAppContext } from '../context'
import { ERROR_CODES, amountFormatter, TRADE_TYPES, USED_CHAIN_ID, TOKEN_NAME, TOTAL_NUM_OF_TOKENS } from '../utils'
import test from './Gallery/test.png'
import { IValidateTrade, IValidationError, IValidationTradeResult } from 'types'
import { ethers } from 'ethers'
// import { ethers } from 'ethers'

export function useCount() {
  const { state, setState } = useAppContext()

  function increment() {
    setState(state => ({ ...state, count: state.count + 1 }))
  }

  function decrement() {
    if (state.count.gte(1)) {
      setState(state => ({ ...state, count: state.count - 1 }))
    }
  }

  function setCount(val) {
    let int = val.toInt()
    setState(state => ({ ...state, count: int }))
  }
  return [state.count, increment, decrement, setCount]
}

function getValidationErrorMessage(validationError) {
  if (!validationError) {
    return null
  } else {
    switch (validationError.code) {
      case ERROR_CODES.INVALID_AMOUNT: {
        return 'Invalid Amount'
      }
      case ERROR_CODES.INVALID_TRADE: {
        return 'Invalid Trade'
      }
      case ERROR_CODES.INSUFFICIENT_ALLOWANCE: {
        return 'Set Allowance to Continue'
      }
      case ERROR_CODES.INSUFFICIENT_ETH_GAS: {
        return 'Not Enough ETH to Pay Gas'
      }
      case ERROR_CODES.INSUFFICIENT_SELECTED_TOKEN_BALANCE: {
        return 'Not Enough of Selected Token'
      }
      default: {
        return 'Unknown Error'
      }
    }
  }
}

interface Props {
  selectedTokenSymbol,
  setSelectedTokenSymbol,
  ready,
  unlock,
  validateBuy : IValidateTrade,
  buy,
  dollarPrice,
  pending,
  reserveOWNToken,
  dollarize,
  setCurrentTransaction,
  currentTransactionHash,
  setShowConnect
}

export function link(hash) {
  if (USED_CHAIN_ID === 3) {
    return `https://ropsten.etherscan.io/tx/${hash}`;
  }
  return `https://etherscan.io/tx/${hash}`
}

export default function BuyAndSell({
  selectedTokenSymbol,
  setSelectedTokenSymbol,
  ready,
  unlock,
  validateBuy,
  buy,
  dollarPrice,
  pending,
  reserveOWNToken,
  dollarize,
  setCurrentTransaction,
  currentTransactionHash,
  setShowConnect
} : Props) {
  const { state } = useAppContext()
  const { account, setConnector } = useWeb3Context()

  //console.log('is pending in bb', pending);

  // function fake() {
  //   setCurrentTransaction(
  //     true
  //       ? '0x888503cb966a67192afb74c740abaec0b7e8bda370bc8f853fb040eab247c63f'
  //       : '0x8cd2cc7ebb7d47dd0230bd505fa4b3375faabb1c9f92137f725b85e4de3f61df',
  //     TRADE_TYPES.SELL,
  //     ethers.utils.bigNumberify('1000000000000000000')
  //   )
  // }

  const initialVal = useCallback(() : IValidationTradeResult => {
    return {
      inputValue: ethers.utils.bigNumberify(0),
      outputValue: ethers.utils.bigNumberify(0),
    }
  }, []);
  

  const [buyValidationState, setBuyValidationState] = useState<IValidationTradeResult>(initialVal) // { maximumInputValue, inputValue, outputValue }
  const [sellValidationState, setSellValidationState] = useState<IValidationTradeResult>(initialVal) // { inputValue, outputValue, minimumOutputValue }
  const [validationError, setValidationError] = useState<IValidationError>(null)

  function getText(account, errorMessage, ready, pending, hash) {
    //console.log('getting text', account, buying, errorMessage, ready, pending, hash)
    if (account === null) {
      return 'Connect Wallet'
    } else if (ready && !errorMessage) {
      if (pending && hash) {
        return 'Waiting for confirmation'
      } else {
        return 'Buy ' + TOKEN_NAME;
      }      
    } else {
      return errorMessage ? errorMessage : 'Loading...'
    }
  }

  // buy state validation
  useEffect(() => {
    if (ready) {
      //console.log('hmm')
      try {
        const { error: validationError, ...validationState } = validateBuy(String(state.count))
        //console.log('try1 ', validationError)
        setBuyValidationState(validationState)
        setValidationError(validationError || null)

        return () => {
          setBuyValidationState(initialVal)
          setValidationError(null)
        }
      } catch (error) {
        setBuyValidationState(initialVal)
        setValidationError(error)
      }
    }
  }, [ready, validateBuy, state.count, initialVal])

  const shouldRenderUnlock = validationError && validationError.code === ERROR_CODES.INSUFFICIENT_ALLOWANCE

  const errorMessage = getValidationErrorMessage(validationError)

  function renderFormData() {
    let conditionalRender
    if (buyValidationState.inputValue) {
      conditionalRender = (
        <>
          <p>
            ~ ${ready && dollarize(buyValidationState.inputValue).toString()}
          </p>
        </>
      )
    }  else {
      conditionalRender = <p>$0.00</p>
    }

    return <>{conditionalRender}</>
  }

  function TokenVal() {
    if (buyValidationState.inputValue) {
      return amountFormatter(buyValidationState.inputValue, 18, 4)
    } else {
      return '0'
    }
  }

  //console.log('so21', validationError !== null || (pending && currentTransactionHash), validationError, pending , currentTransactionHash)
//console.log('state', buyValidationState.inputValue?.toString(), buyValidationState.outputValue.toString(), 
//  buyValidationState.minimumOutputValue?.toString(), buyValidationState.maximumInputValue?.toString())

  return (
    <>
      <TopFrame>
        {/* <button onClick={() => fake()}>test</button> */}
        <Unicorn>
          <span role="img" aria-label="unicorn">
            🦄
          </span>{' '}
          Pay
        </Unicorn>
        <ImgStyle src={test} alt="Logo" />
        <InfoFrame pending={pending}>
          <CurrentPrice>
            {/* {dollarPrice && `$${amountFormatter(dollarPrice, 18, 2)} USD`} */}
            <USDPrice>{renderFormData()}</USDPrice>
            <SockCount>{reserveOWNToken && `${amountFormatter(reserveOWNToken, 18, 0)}/${TOTAL_NUM_OF_TOKENS} available`}</SockCount>
          </CurrentPrice>
          <IncrementToken />
        </InfoFrame>
      </TopFrame>
      {pending && currentTransactionHash ? (
        <CheckoutControls>
          <CheckoutPrompt>
            <i>Your transaction is pending.</i>
          </CheckoutPrompt>
          <CheckoutPrompt>
            <EtherscanLink href={link(currentTransactionHash)} target="_blank" rel="noopener noreferrer">
              View on Etherscan.
            </EtherscanLink>
          </CheckoutPrompt>
        </CheckoutControls>
      ) : (
        <CheckoutControls>
          <CheckoutPrompt>
            <i>Current price in Ethers: {TokenVal()}Ξ</i>
          </CheckoutPrompt>          
        </CheckoutControls>
      )}
      {shouldRenderUnlock ? (
        <ButtonFrame
          text={`Unlock ${selectedTokenSymbol}`}
          type={'cta'}
          pending={pending}
          onClick={() => {
            unlock(true).then(({ hash }) => {
              console.log('unlocking', hash)
              setCurrentTransaction(hash, TRADE_TYPES.UNLOCK, undefined)
            })
          }}
        />
      ) : (
        <ButtonFrame
          className="button"
          pending={pending}
          disabled={validationError !== null || (pending && currentTransactionHash)}
          text={getText(account, errorMessage, ready, pending, currentTransactionHash)}
          type={'cta'}
          onClick={() => {
            if (account === null) {
              setConnector('Injected', { suppressAndThrowErrors: true }).catch(error => {
                setShowConnect(true)
              })
            } else {
              buy(buyValidationState.maximumInputValue, buyValidationState.outputValue)
              .then(response => {
                //console.log('in bs then', response);
                setCurrentTransaction(
                  response.hash,
                  TRADE_TYPES.BUY,
                  buyValidationState.outputValue
                )
              })
            }
          }}
        />
      )}
    </>
  )
}

const TopFrame = styled.div`
  width: 100%;
  max-width: 375px;
  background: #000000;
  background: linear-gradient(162.92deg, #2b2b2b 12.36%, #000000 94.75%);
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.4);
  border-radius: 8px;
  color: white;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  padding: 16px;
  box-sizing: border-box;
  background-color: black;
`

const Unicorn = styled.p`
  width: 100%;
  color: #fff;
  font-weight: 600;
  margin: 0px;
  font-size: 16px;
`

const InfoFrame = styled.div`
  opacity: ${props => (props.pending ? 0.6 : 1)};
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
`

const ImgStyle = styled.img`
  width: 225px;
  padding: 2rem 0 2rem 0;
  box-sizing: border-box;
`
const SockCount = styled.span`
  color: #aeaeae;
  font-weight: 400;
  margin: 0px;
  margin-top: 8px;
  font-size: 12px;
  font-feature-settings: 'tnum' on, 'onum' on;
`

const USDPrice = styled.div``

const CurrentPrice = styled.div`
  font-weight: 600;
  font-size: 18px;
  margin: 0px;
  font-feature-settings: 'tnum' on, 'onum' on;
`

const CheckoutControls = styled.span`
  width: 100%;
  margin: 16px 16px 0 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  color: ${props => props.theme.textColor};
  background-color: black;
`

const CheckoutPrompt = styled.p`
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 0;
  margin-left: 8px;
  text-align: left;
  width: 100%;
  background-color: black;
`

const ButtonFrame = styled(Button)`
  margin: 16px;
  height: 48px;
  padding: 16px;
`

const EtherscanLink = styled.a`
  text-decoration: none;
  color: ${props => props.theme.uniswapPink};
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  margin-top: 8px;
`
