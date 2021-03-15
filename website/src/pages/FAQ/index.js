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
      <p>HIDDENKLASS:</p>
      <p>
      HIDDENKLASS is a decentralized fashion store. Design and manufacturing is owned by the brand, Price is dynamic, determined by an automated market-maker.
      </p>
      <p>
      The T-shirt has a non-fungible token(NFT) associated with it. Each T-shirt is unique, and is part of a limited edition series, $HIDDENKLASS is a scarce digital representation of an “asset“, in this case, the T-shirt. 
      </p>
      <p>
      Any attempt to replicate is useless, the T-shirt has a printed integer ID which simply says that the T-shirt owner has an NFT. The real owner can always prove he holds the NFT with the ID.
      </p>
      <p>
      How to sell the $HDK token?
      </p>
      <p>Token can be swapped through <a href='http://www.uniswap.com'>Uniswap</a> , using the swap function between $HDK and ETH.</p>
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
