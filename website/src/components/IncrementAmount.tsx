import { ethers } from 'ethers'
import { BigNumber } from 'ethers/utils'
import React from 'react'
import styled from 'styled-components'

const SelectFrame = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  border-radius: 8px;
  color: #000;
  background-color: #fff;
  padding: 8px 12px 8px 12px;
  max-width: 84px;
  font-weight: 600;

  /* margin-top: 0.5rem;
  margin-bottom: 0.5rem; */
`

const SelectMenu = styled.div`
  font-size: 16px;
  /* margin: 1rem; */
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  width: 100%;
  /* height: 48px; */
  box-sizing: border-box;
  margin: 0;
  /* appearance: none;
  display: flex;
  justify-content: flex-start;
  align-items: center; */
  border: none;
  /* padding: 0px 1rem 0px 1rem; */
  text-align: center;
`

const IncrementButton = styled.span`
  cursor: pointer;
  user-select: none;
  width: 48px;
  /* height: 48px; */
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: ${props => props.justify};
  justify-content: center;
`
interface Props {
  max?: ethers.utils.BigNumber
  count: BigNumber,
  setCount: React.Dispatch<React.SetStateAction<BigNumber>>
}

export default function IncrementAmount({ max, count, setCount } : Props) {  //const [count, incrementCount, decrementCount] = useCount(initialValue, max)
  
  const decrement = () => {
    if (count.gt(1)) {
      setCount(count.sub(1))
    }
  }

  const increment = () => {
    const newCount = count.add(1);
    if (!max || newCount.lte(max)) {
      setCount(newCount);
    } 
  }

  return (
    <SelectFrame>
      <IncrementButton justify={'flex-start'} onClick={decrement}>
        -
      </IncrementButton>
      <SelectMenu>{count.toString()}</SelectMenu>

      <IncrementButton justify={'flex-end'} onClick={increment}>
        +
      </IncrementButton>
    </SelectFrame>
  )
}
