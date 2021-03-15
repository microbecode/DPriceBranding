import React from 'react'
import styled from 'styled-components'

import Button from './Button'
import { useAppContext } from '../context'
import { TRADE_TYPES } from '../utils'
import { ButtonFrame, BuyButtonFrame } from './RedeemButton'

export default function BuyButtons(props) {
  const {setState} = useAppContext()

  function handleToggleCheckout(tradeType) {
    setState(state => ({ ...state, visible: !state.visible, tradeType }))
  }

  return (
    <BuyButtonFrame>
      <ButtonFrame
        disabled={false}
        text={'Buy'}

        onClick={() => {
          handleToggleCheckout(TRADE_TYPES.BUY)
        }}
      />
    </BuyButtonFrame>
  )
}
