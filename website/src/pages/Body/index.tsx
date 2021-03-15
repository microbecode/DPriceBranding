import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { useWeb3Context } from 'web3-react'
import { Link } from 'react-router-dom'
import { useAppContext } from '../../context'
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
        <UpperLogo src={logo} alt='logo'></UpperLogo>
      </Link>
      <div style={{ display: 'flex', flexDirection: 'row', height: '40px' }}>
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
              <SockCount>{balanceOWN && `${amountFormatter(balanceOWN, 18, 0)}`} {TOKEN_NAME}</SockCount>
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

export function Footer() {

  return (
    <HeaderFrame>
      <FooterBox>
        <Link to="/learnmore" style={{ textDecoration: 'none' }}>
          Learn more
        </Link>
      </FooterBox>
      <FooterBox>
      <Link to="/faq" style={{ textDecoration: 'none' }}>
          FAQ
        </Link>
      </FooterBox>
    </HeaderFrame>
  )
}

const UpperLogo = styled.img`
  background-color: black;
  max-height: 40px;
  border-radius: 6px;
`

const HeaderFrame = styled.div`
 /*  position: fixed; */
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
`

const FooterBox = styled.div`
  background-color: black;
  border: 1px solid red;
  margin-right: 1rem;
  padding: 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  transform: scale(1);
  line-height: 1;
  font-weight: 500;
  font-size: 24px;
  color: ${props => props.theme.textColor};
  font-weight: 500;
  font-size: 14px;
  max-height: 40px;
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
  ready,
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
  ready,
  validateBuy,
  buy,
  burn,
  dollarize,
  dollarPrice,
  balanceOWN,
  reserveOWNToken,
  totalSupply
} : Props) {

  const [currentTransaction, _setCurrentTransaction] = useState<ITransaction>({
    amount: 0,
    hash: null,
    type: null
  })

  const setCurrentTransaction = useCallback((hash, type, amount) => {
    _setCurrentTransaction({ hash, type, amount })
  }, [])
  const clearCurrentTransaction = useCallback(() => {
    _setCurrentTransaction(null)
  }, [])
  const { state } = useAppContext()
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
        <BuyButtonFrame>
          <BuyButtons balanceOWN={balanceOWN} />
          <RedeemButton balanceOWN={balanceOWN} />
        </BuyButtonFrame>
      </Content>
      <Checkout
        ready={ready}
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
      <Footer></Footer>
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
  background-color: black;
  border-radius: 6px;
`