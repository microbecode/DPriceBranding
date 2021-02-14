import React, { useState, useCallback, useContext } from 'react'
import styled from 'styled-components'
import { useWeb3Context } from 'web3-react'
import { Link } from 'react-router-dom'

import { AppContext, useAppContext } from '../../context'
import Card from '../../components/Card'
import BuyButtons from '../../components/Buttons'
import RedeemButton, { BuyButtonFrame } from '../../components/RedeemButton'
import Checkout from '../../components/Checkout'
import { amountFormatter, TOKEN_NAME, TOTAL_NUM_OF_TOKENS } from '../../utils'
import { ITransaction, IValidateTrade, } from 'types'
import { ethers } from 'ethers'
import logo from '../../components/Gallery/hiddenklass-rojo.png'

interface HeaderProps {
  totalSupply, 
  ready, 
  balanceOWN : ethers.utils.BigNumber, 
  setShowConnect : (boolean) => void
}

export function Header(
  { totalSupply, 
    ready, 
    balanceOWN, 
    setShowConnect 
  } : HeaderProps) {
  const { account, setConnector } = useWeb3Context()

  function handleAccount() {
    setConnector('Injected', { suppressAndThrowErrors: true }).catch(error => {
      setShowConnect(true)
    })
  }

  return (
    <HeaderFrame balanceSOCKS={balanceOWN}>
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
      {/*   <Unicorn>
          <span role="img" aria-label="unicorn">
            🦄
          </span>{' '}
          Unisocks
        </Unicorn> */}
        <UpperLogo src={logo} alt='logo'></UpperLogo>
      </Link>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {totalSupply && (
          <Link to="/stats" style={{ textDecoration: 'none' }}>
            <Burned>
              <span role="img" aria-label="fire">
                🔥
              </span>{' '}
              {TOTAL_NUM_OF_TOKENS - totalSupply} <HideMobile>redeemed</HideMobile>
            </Burned>
          </Link>
        )}
        <Account onClick={() => handleAccount()} balanceOWN={balanceOWN}>
          {account ? (
            balanceOWN && balanceOWN.gt(0) ? (
              <SockCount>{balanceOWN && `${amountFormatter(balanceOWN, 18, 0)}`} SOCKS</SockCount>
            ) : (
              <SockCount>{account.slice(0, 6)}...</SockCount>
            )
          ) : (
            <SockCount>Connect Wallet</SockCount>
          )}

          <Status balanceOWN={balanceOWN} ready={ready} account={account} />
        </Account>
      </div>
    </HeaderFrame>
  )
}

const UpperLogo = styled.img`
  background-color: black;
`

const HeaderFrame = styled.div`
  position: fixed;
  width: 100%;
  box-sizing: border-box;
  margin: 0px;
  font-size: 1.25rem;
  color: ${props => (props.balanceOWN ? props.theme.primary : 'white')};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 1rem;
`

const Account = styled.div`
  background-color: black;/* ${props => (props.balanceOWN ? '#f1f2f6' : props.theme.blue)}; */
  padding: 0.75rem;
  border-radius: 6px;
  cursor: ${props => (props.balanceOWN ? 'auto' : 'pointer')};

  transform: scale(1);
  transition: transform 0.3s ease;

  :hover {
    transform: ${props => (props.balanceOWN ? 'scale(1)' : 'scale(1.02)')};
    text-decoration: underline;
  }
`

const Burned = styled.div`
  background-color: black;
  border: 1px solid red;
  margin-right: 1rem;
  padding: 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  transform: scale(1);
  transition: transform 0.3s ease;
  line-height: 1;

  :hover {
    transform: scale(1.02);
  }

  font-weight: 500;
  font-size: 14px;
  color: red;
`

const HideMobile = styled.span`
  @media only screen and (max-width: 480px) {
    display: none;
  }
`

const SockCount = styled.p`
  /* color: #6c7284; */
  font-weight: 500;
  margin: 0px;
  font-size: 14px;
  float: left;
`

const Status = styled.div`
  display: ${props => (props.balanceOWN ? 'initial' : 'none')};
  width: 12px;
  height: 12px;
  border-radius: 100%;
  margin-left: 12px;
  margin-top: 2px;
  float: right;
  background-color: ${props =>
    props.account === null ? props.theme.orange : props.ready ? props.theme.green : props.theme.orange};
  // props.account === null ? props.theme.orange : props.theme.green};
`

interface Props {
  selectedTokenSymbol,
  setSelectedTokenSymbol,
  ready,
  unlock,
  validateBuy : IValidateTrade,
  buy,
  burn,
  dollarize,
  dollarPrice,
  balanceOWN : ethers.utils.BigNumber,
  reserveOWNToken : ethers.utils.BigNumber,
  totalSupply : ethers.utils.BigNumber
};

export default function Body({
  selectedTokenSymbol,
  setSelectedTokenSymbol,
  ready,
  unlock,
  validateBuy,
  buy,
  burn,
  dollarize,
  dollarPrice,
  balanceOWN,
  reserveOWNToken,
  totalSupply
} : Props) {
  const { account } = useWeb3Context()

  

  const [currentTransaction, _setCurrentTransaction] = useState<ITransaction>({
    amount: 0,
    hash: null,
    type: null
  })
  //console.log('curr tran', currentTransaction)
  const setCurrentTransaction = useCallback((hash, type, amount) => {
    _setCurrentTransaction({ hash, type, amount })
  }, [])
  const clearCurrentTransaction = useCallback(() => {
    _setCurrentTransaction(null)
  }, [])
  const { state, setState } = useAppContext()
  const [showConnect, setShowConnect] = useState(false)
  const [showWorks, setShowWorks] = useState(false)

  return (
    <AppWrapper overlay={state.visible}>
      <Header
        totalSupply={totalSupply}
        ready={ready}
        balanceOWN={balanceOWN}
        setShowConnect={setShowConnect}
      />
      <Content>
        <Card totalSupply={totalSupply} reserveOWNToken={reserveOWNToken} />{' '}
        <Info>
          <div style={{ marginBottom: '4px' }}>Buy and sell real {TOKEN_NAME} with digital currency.</div>
          <div style={{ marginBottom: '4px' }}>
            Delivered on demand.{' '}
            <a
              href="/"
              onClick={e => {
                e.preventDefault()
                setState(state => ({ ...state, visible: !state.visible }))
                setShowWorks(true)
              }}
            >
              Learn more
            </a>
          </div>
          {/* <SubInfo>
            An experiment in pricing and user experience by the team at Uniswap.{' '}
            <a
              href="/"
              onClick={e => {
                e.preventDefault()
                setState(state => ({ ...state, visible: !state.visible }))
                setShowWorks(true)
              }}
            >
              How it works.
            </a>
          </SubInfo> */}
        </Info>
        <BuyButtonFrame>
          <BuyButtons balanceOWN={balanceOWN} />
          <RedeemButton balanceOWN={balanceOWN} />
        </BuyButtonFrame>
      </Content>
      <Checkout
        selectedTokenSymbol={selectedTokenSymbol}
        setSelectedTokenSymbol={setSelectedTokenSymbol}
        ready={ready}
        unlock={unlock}
        validateBuy={validateBuy}
        buy={buy}
        burn={burn}
        balanceOWN={balanceOWN}
        dollarPrice={dollarPrice}
        reserveOWNToken={reserveOWNToken}
        dollarize={dollarize}
        showConnect={showConnect}
        setShowConnect={setShowConnect}
        currentTransactionHash={currentTransaction?.hash}
        currentTransactionType={currentTransaction?.type}
        currentTransactionAmount={currentTransaction?.amount}
        setCurrentTransaction={setCurrentTransaction}
        clearCurrentTransaction={clearCurrentTransaction}
        showWorks={showWorks}
        setShowWorks={setShowWorks}
      />
    </AppWrapper>
  )
}

const AppWrapper = styled.div`
  width: 100vw;
  height: 100%;
  margin: 0px auto;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
  overflow: ${props => (props.overlay ? 'hidden' : 'scroll')};
  scroll-behavior: smooth;
  position: ${props => (props.overlay ? 'fixed' : 'initial')};
`

const Content = styled.div`
  width: calc(100vw - 32px);
  max-width: 375px;
  margin-top: 72px;
`

const Info = styled.div`
  color: ${props => props.theme.textColor};
  font-weight: 500;
  margin: 0px;
  font-size: 14px;
  padding: 20px;
  padding-top: 32px;
  border-radius: 0 0 8px 8px;
  /* border-radius: 8px; */
  margin-bottom: 12px;
  margin-top: -12px;
  /* margin-top: 16px; */
  background-color: black;
  a {
    color: ${props => props.theme.uniswapPink};
    text-decoration: none;
    /* padding-top: 8px; */
    /* font-size: 14px; */
  }
  a:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`

const OrderStatusLink = styled.p`
  color: ${props => props.theme.uniswapPink};
  text-align: center;
  font-size: 0.6rem;
`

const Unicorn = styled.p`
  color: ${props => props.theme.uniswapPink};
  font-weight: 600;
  margin: auto 0px;
  font-size: 16px;
`
