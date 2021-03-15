import React from 'react'
import styled from 'styled-components'
import { useAppContext } from '../../context'
import { Header } from '../Body'

export default function Body() {
  const { state } = useAppContext()

  return (
    <AppWrapper overlay={state.visible}>
      <Header />
      <Content>
      <p>How it works:</p>
      <p>
      $HDK is a token that entitles you to 1 real limited edition T-shirt, shipped anywhere in the world.You can sell the token back at any time. To get a real T-shirt, redeem a $HDK token.
      </p>
      <p>How it's priced:</p>
      <p>
      $HDK tokens are starting at $50. Each buy/sell will move the price. The increase or decrease follows a bonding curve. HIDDEN KLASS will eventually find an equilibrium based on market demand.
      </p>
      <p>Uniswap:</p>
      <p>
      Buying or selling HDK uses the uniswap protocol and accepts ETH as a payment method. The pool of $HDK is a uniswap pool where 30 $HDK tokens were deposited along with the starting value of ETH.
      </p>
      <p>
        <a href="https://docs.uniswap.io/" target="_blank" rel="noopener noreferrer">
          Learn more about how uniswap works.
        </a>
      </p>
      </Content>
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
  background: #000000;
  background: linear-gradient(162.92deg, #2b2b2b 12.36%, #000000 94.75%);
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 2rem;
`
