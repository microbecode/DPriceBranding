import React from 'react'
import styled from 'styled-components'

import { Controls } from './Redeem'

const WorksFrame = styled.div`
  width: 100%;
  padding: 24px;
  padding-top: 16px;
  box-sizing: border-box;
  font-size: 24px;
  font-weight: 600;
  /* line-height: 170%; */
  /* text-align: center; */
`
const Title = styled.p`
  margin-top: 1rem !important;

  font-weight: 600;
  font-size: 16px;
`

const Desc = styled.p`
  line-height: 150%;
  font-size: 14px;
  margin-top: 1rem !important;
  font-weight: 500;
`

export const EtherscanLink = styled.a`
  text-decoration: none;
  color: ${props => props.theme.uniswapPink};
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
`

export default function Works({ closeCheckout }) {
  return (
    <WorksFrame>
      <Controls closeCheckout={closeCheckout} theme={'dark'} />

      <Title>How it works:</Title>
      <Desc>
      $HDK is a token that entitles you to 1 real limited-edition T-shirt, shipped anywhere in the world. You can sell the token back at any time. To get a real T-shirt, redeem a $HDK token.
      </Desc>
      <Title>How it's priced:</Title>
      <Desc>
      $HDK tokens are listed starting at $50. Each buy/sell will move the price. The increase or decrease follows a bonding curve. HIDDENKLASS will eventually find an equilibrium based on market demand.
      </Desc>
      <Title>Uniswap:</Title>
      <Desc>
      Buying or selling HDK uses the uniswap protocol and accepts ETH as a payment method. The pool of $HDK is a uniswap pool where X $HDK tokens were deposited along with the starting value of ETH.
      </Desc>
      <Desc>
        <a href="https://docs.uniswap.io/" target="_blank" rel="noopener noreferrer">
          Learn more about how uniswap works.
        </a>
      </Desc>
    </WorksFrame>
  )
}
