import React from 'react'
import styled from 'styled-components'

import { Spinner } from '../theme'
import Circle from './Gallery/circle.svg'

const ButtonFrame = styled.button`
  margin: 3px;
  padding: 0;
  text-align: center;
  border-radius: 8px;
  box-sizing: border-box;
  height: 48px;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: center;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1;
  border-width: 1px;
  border: none;
  cursor: pointer;
  border-style: solid;
  opacity: ${props => (props.disabled ? 1 : 1)};
  pointer-events: ${props => (props.disabled ? 'none' : 'auto')};
  border-width: ${props => (props.type === 'cta' ? '0px' : props.disabled ? '0px' : '1px')};
  border-color: ${props => (props.type === 'cta' ? 'none' : props.disabled ? 'none' : props.theme.uniswapPink)};
  background: ${props =>
    props.type === 'cta'
      ? props.disabled
        ? // ? 'linear-gradient(97.28deg, rgba(254, 109, 222, 0.2) 2.08%, rgba(255, 157, 234, 0.2) 106.51%)'
          '#f1f2f6'
        : 'black'
      : props.disabled // ? 'linear-gradient(97.28deg, rgba(254, 109, 222, 0.2) 2.08%, rgba(255, 157, 234, 0.2) 106.51%)'
      ? '#f1f2f6'
      : 'none'};

  color: ${props =>
    props.type === 'cta'
      ? props.disabled
        ? props.theme.textDisabled
        : props.theme.white
      : props.disabled
      ? '#aeaeae'
      : props.theme.textColor};
  transform: scale(1);
  transition: transform 0.3s ease;

  :hover {
    transform: scale(1.02);
  }
`

const CtaText = styled.div`
  width: 100%;
`

const CtaTextFlex = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const SpinnerWrapper = styled(Spinner)`
  margin: 0 0.25rem 0 0.3rem;
`

interface Props {
  text: string,
  onClick: (event) => void,
  preventDefault?: boolean,
  pending?: boolean
  type?: string
}

export default function Button({ text, onClick = (ev) => {}, preventDefault = true, pending, ...rest } : Props) {
  return (
    <ButtonFrame
      onClick={e => {
        if (preventDefault) {
          e.preventDefault()
        }
        onClick(e)
      }}
      {...rest}
    >
      {pending ? (
        <CtaTextFlex>
          {text}
          <SpinnerWrapper src={Circle} alt="loader" />{' '}
        </CtaTextFlex>
      ) : (
        <CtaText>{text}</CtaText>
      )}
    </ButtonFrame>
  )
}
