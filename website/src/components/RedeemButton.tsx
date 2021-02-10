import React from 'react'
import styled from 'styled-components'
import { ethers } from 'ethers'
import { useWeb3Context } from 'web3-react'

import Button from './Button'
import { useAppContext } from '../context'
import { TRADE_TYPES } from '../utils'
import { BigNumber } from 'ethers/utils'

const BuyButtonFrame = styled.div`
  margin: 0.5rem 0rem 0.5rem 0rem;
  display: flex;
  align-items: center;
  flex-direction: center;
  flex-direction: row;
  color: ${props => props.theme.black};

  div {
    width: 100%;
  }

  @media only screen and (max-width: 480px) {
    /* For mobile phones: */
    /* margin: 1.5rem 2rem 0.5rem 2rem; */
  }
`
const ButtonFrame = styled(Button)`
  width: 100%;
`

const Shim = styled.div`
  width: 1rem !important;
  height: 1rem;
`

export default function RedeemButton({ balanceOWN } : { balanceOWN: BigNumber }) {
  const { setState } = useAppContext()
  const { account } = useWeb3Context()

  function handleToggleCheckout(tradeType) {
    setState(state => ({ ...state, visible: !state.visible, tradeType }))
  }

  return (
    <BuyButtonFrame>
       <ButtonFrame
        disabled={
          account === null ||
          !balanceOWN ||
          balanceOWN.lt(ethers.utils.bigNumberify(10).pow(ethers.utils.bigNumberify(18)))
        }
        text={'Redeem'}
        type={'secondary'}
        onClick={() => {
          handleToggleCheckout(TRADE_TYPES.REDEEM)
        }}
      />
    </BuyButtonFrame>
  )
}
