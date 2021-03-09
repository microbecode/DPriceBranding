import React, { useState, useCallback, useEffect } from 'react'
import { useWeb3Context } from 'web3-react'
import { ethers } from 'ethers'
import { ERROR_CODES, GetAddress, AddressTypes } from '../../utils'
import {
  useTokenContract,
  useAddressBalance,
  usePairReserves,
  useTotalSupply,
  useRouterContract
} from '../../hooks'
import Body from '../Body'
import { IValidationError, IValidationTradeResult } from 'types'
import { BigNumber } from 'ethers/utils'
import Stats from 'pages/Stats'
import LearnMore from 'pages/LearnMore'
import FAQ from 'pages/FAQ'

// denominated in bips
const GAS_MARGIN = ethers.utils.bigNumberify(1000)

export function calculateGasMargin(value, margin) {
  const offset = value.mul(margin).div(ethers.utils.bigNumberify(10000))
  return value.add(offset)
}

// denominated in seconds
const DEADLINE_FROM_NOW = 60 * 15

// denominated in bips
const ALLOWED_SLIPPAGE = ethers.utils.bigNumberify(200)

function calculateSlippageBounds(value) {
  const offset = value.mul(ALLOWED_SLIPPAGE).div(ethers.utils.bigNumberify(10000))
  const minimum = value.sub(offset)
  const maximum = value.add(offset)
  return {
    minimum: minimum.lt(ethers.constants.Zero) ? ethers.constants.Zero : minimum as ethers.utils.BigNumber,
    maximum: maximum.gt(ethers.constants.MaxUint256) ? ethers.constants.MaxUint256 : maximum as ethers.utils.BigNumber
  }
}

// this mocks the getOutputPrice function, and calculates the required input
function calculateEtherTokenInputFromOutput(outputAmount, inputReserve, outputReserve) {
  const numerator = inputReserve.mul(outputAmount).mul(ethers.utils.bigNumberify(1000))
  const denominator = outputReserve.sub(outputAmount).mul(ethers.utils.bigNumberify(997))
  return numerator.div(denominator).add(ethers.constants.One) as ethers.utils.BigNumber;
}

function calculateAmount(
  tokenAmount,
  reserveETH,
  reserveToken,
) {
  // eth to token - buy
  const amount = calculateEtherTokenInputFromOutput(tokenAmount, reserveETH, reserveToken)
  if (amount.lte(ethers.constants.Zero) || amount.gte(ethers.constants.MaxUint256)) {
    throw Error()
  }
  return amount;  
}

interface Props {
  showStats?: boolean;
  showLearnMore?: boolean;
  showFAQ?: boolean;
}

export default function Main({showStats, showLearnMore, showFAQ} : Props) {
  const { library, account } : {library?: ethers.providers.Web3Provider, account?: string } = useWeb3Context()

  // get pair contract
  const routerContract = useRouterContract(GetAddress(AddressTypes.ROUTER));

  // get token contracts
  const tokenContractSOCKS = useTokenContract(GetAddress(AddressTypes.OWN))

  // get balances
  const myBalanceETH = useAddressBalance(account, GetAddress(AddressTypes.ETH))
  const myBalanceOWN = useAddressBalance(account, GetAddress(AddressTypes.OWN))

  // totalsupply
  const totalSupply = useTotalSupply(tokenContractSOCKS)

  const { reserveETH, reserveToken } = usePairReserves() 

  const ready = !!(
    reserveETH &&
    reserveToken
  )

  function _dollarize(amount, exchangeRate) {
    return amount
      .mul(exchangeRate)
      .div(ethers.utils.bigNumberify(10).pow(ethers.utils.bigNumberify(18)))
  }

  function dollarize(amount) {
    const val = _dollarize(
      amount,
      dollarPrice
    );
    return val;
  }

  const [dollarPrice, setDollarPrice] = useState<ethers.utils.BigNumber>(ethers.utils.bigNumberify(0))
  useEffect(() => {    
    try {
      const getPrice = async () => {
        const url = '.netlify/functions/ethprice';
        const res = await fetch(url);
        const json = await res.json();
        const rate = json.result.ethusd.split(".")[0] as string;
        const bnRate = ethers.utils.bigNumberify(rate);
        setDollarPrice(bnRate);
      }
      
      getPrice();
    } catch {
      setDollarPrice(ethers.utils.bigNumberify(0))
    }
  }, []) 

  // buy functionality
  const validateBuy = useCallback(
    (numOfTokensIWant : string): IValidationTradeResult => {
      // validate passed amount
      let parsedValue : ethers.utils.BigNumber;
      try {
        parsedValue = ethers.utils.parseUnits(numOfTokensIWant, 18)
      } catch (error) {
        error.code = ERROR_CODES.INVALID_AMOUNT
        throw error
      }

      let requiredValueInSelectedToken
      try {
        requiredValueInSelectedToken = calculateAmount(
          parsedValue,
          reserveETH,
          reserveToken
        )
      } catch (error) {
        error.code = ERROR_CODES.INVALID_TRADE
        throw error
      }

      // get max slippage amount
      const { maximum } = calculateSlippageBounds(requiredValueInSelectedToken)

      // the following are 'non-breaking' errors that will still return the data
      let errorAccumulator : IValidationError;
      // validate minimum ether balance
      if (myBalanceETH && myBalanceETH !== undefined && myBalanceETH.lt(ethers.utils.parseEther('.01'))) {
        const error = {} as IValidationError;
        error.code = ERROR_CODES.INSUFFICIENT_ETH_GAS
        if (!errorAccumulator) {
          errorAccumulator = error
        }
      }

      return {
        inputValue: requiredValueInSelectedToken,
        maximumInputValue: maximum,
        outputValue: parsedValue,
        error: errorAccumulator
      }
    },
    [
      myBalanceETH,
      reserveETH,
      reserveToken
    ]
  )

  async function buy(maximumInputValue, outputValue) {
    const deadline = Math.ceil(Date.now() / 1000) + DEADLINE_FROM_NOW

    const estimatedGasPrice = await library
      .getGasPrice()
      .then(gasPrice => gasPrice.mul(ethers.utils.bigNumberify(150)).div(ethers.utils.bigNumberify(100)))

    const weth = GetAddress(AddressTypes.WETH);
    const own = GetAddress(AddressTypes.OWN);
    const routerPath = [weth, own];
    const estimatedGasLimit = await routerContract.estimate.swapETHForExactTokens(outputValue, routerPath, account, deadline, {value: maximumInputValue }) as BigNumber;

    const trx = await routerContract.swapETHForExactTokens(outputValue, routerPath, account, deadline, {
      value: maximumInputValue,
      gasLimit: calculateGasMargin(estimatedGasLimit, GAS_MARGIN),
      gasPrice: estimatedGasPrice
    }) as BigNumber;

    return trx;
  }

  async function burn(amount) {
    const parsedAmount = ethers.utils.parseUnits(amount.toString(), 18)

    const estimatedGasPrice = await library
      .getGasPrice()
      .then(gasPrice => gasPrice.mul(ethers.utils.bigNumberify(150)).div(ethers.utils.bigNumberify(100)))

    const estimatedGasLimit = await tokenContractSOCKS.estimate.burn(parsedAmount)

    return tokenContractSOCKS.burn(parsedAmount, {
      gasLimit: calculateGasMargin(estimatedGasLimit, GAS_MARGIN),
      gasPrice: estimatedGasPrice
    }) 
  }

  if (showStats) {
    return <Stats reserveSOCKSToken={reserveToken} totalSupply={totalSupply} ready={ready} balanceSOCKS={myBalanceOWN} />
  }
  else if (showLearnMore) {
    return <LearnMore/>
  }
  else if (showFAQ) {
    return <FAQ/>
  }
  else {
    return <Body
    ready={ready}
    validateBuy={validateBuy}
    buy={buy}
    burn={burn}
    dollarize={dollarize}
    dollarPrice={dollarPrice}
    balanceOWN={myBalanceOWN}
    reserveOWNToken={reserveToken}
    totalSupply={totalSupply}
    />
  }
}
