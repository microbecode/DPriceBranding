import React, { useState, useCallback, useEffect } from 'react'
import { useWeb3Context } from 'web3-react'
import { ethers } from 'ethers'

import { TOKEN_SYMBOLS, TOKEN_ADDRESSES, ERROR_CODES, PAIR_ADDRESS, ROUTER_ADDRESS } from '../../utils'
import {
  useTokenContract,
  useExchangeContract,
  useAddressBalance,
  useAddressAllowance,
  useExchangeReserves,
  useExchangeAllowance,
  useTotalSupply,
  useRouterContract
} from '../../hooks'
import Body from '../Body'
import { IValidationError, IValidationTradeResult } from 'types'
import { Web3Context } from 'web3-react/dist/context'

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

// this mocks the getInputPrice function, and calculates the required output
function calculateEtherTokenOutputFromInput(inputAmount, inputReserve, outputReserve) {
  const inputAmountWithFee = inputAmount.mul(ethers.utils.bigNumberify(997))
  const numerator = inputAmountWithFee.mul(outputReserve)
  const denominator = inputReserve.mul(ethers.utils.bigNumberify(1000)).add(inputAmountWithFee)
  return numerator.div(denominator) as ethers.utils.BigNumber;
}

// this mocks the getOutputPrice function, and calculates the required input
function calculateEtherTokenInputFromOutput(outputAmount, inputReserve, outputReserve) {
  const numerator = inputReserve.mul(outputAmount).mul(ethers.utils.bigNumberify(1000))
  const denominator = outputReserve.sub(outputAmount).mul(ethers.utils.bigNumberify(997))
  return numerator.div(denominator).add(ethers.constants.One) as ethers.utils.BigNumber;
}

// get exchange rate for a token/ETH pair
function getExchangeRate(inputValue : ethers.utils.BigNumber, outputValue : ethers.utils.BigNumber, invert = false) {
  const inputDecimals = 18
  const outputDecimals = 18

  if (inputValue && inputDecimals && outputValue && outputDecimals) {
    const factor = ethers.utils.bigNumberify(10).pow(ethers.utils.bigNumberify(18))

    if (invert) {
      return inputValue
        .mul(factor)
        .div(outputValue)
        .mul(ethers.utils.bigNumberify(10).pow(ethers.utils.bigNumberify(outputDecimals)))
        .div(ethers.utils.bigNumberify(10).pow(ethers.utils.bigNumberify(inputDecimals)))
    } else {
      return outputValue
        .mul(factor)
        .div(inputValue)
        .mul(ethers.utils.bigNumberify(10).pow(ethers.utils.bigNumberify(inputDecimals)))
        .div(ethers.utils.bigNumberify(10).pow(ethers.utils.bigNumberify(outputDecimals)))
    }
  }
}

function calculateAmount(
  inputTokenSymbol,
  outputTokenSymbol,
  SOCKSAmount,
  reserveTOKENETH,
  reserveOWNToken,
  reserveSelectedTokenETH,
  reserveSelectedTokenToken
) {
  // eth to token - buy
  if (inputTokenSymbol === TOKEN_SYMBOLS.ETH && outputTokenSymbol === TOKEN_SYMBOLS.OWN) {
    const amount = calculateEtherTokenInputFromOutput(SOCKSAmount, reserveTOKENETH, reserveOWNToken)
    if (amount.lte(ethers.constants.Zero) || amount.gte(ethers.constants.MaxUint256)) {
      throw Error()
    }
    return amount
  }

  // token to eth - sell
  if (inputTokenSymbol === TOKEN_SYMBOLS.OWN && outputTokenSymbol === TOKEN_SYMBOLS.ETH) {
    const amount = calculateEtherTokenOutputFromInput(SOCKSAmount, reserveOWNToken, reserveTOKENETH)
    if (amount.lte(ethers.constants.Zero) || amount.gte(ethers.constants.MaxUint256)) {
      throw Error()
    }

    return amount
  }

  // token to token - buy or sell
  const buyingSOCKS = outputTokenSymbol === TOKEN_SYMBOLS.OWN

  if (buyingSOCKS) {
    // eth needed to buy x socks
    const intermediateValue = calculateEtherTokenInputFromOutput(SOCKSAmount, reserveTOKENETH, reserveOWNToken)
    // calculateEtherTokenOutputFromInput
    if (intermediateValue.lte(ethers.constants.Zero) || intermediateValue.gte(ethers.constants.MaxUint256)) {
      throw Error()
    }
    // tokens needed to buy x eth
    const amount = calculateEtherTokenInputFromOutput(
      intermediateValue,
      reserveSelectedTokenToken,
      reserveSelectedTokenETH
    )
    if (amount.lte(ethers.constants.Zero) || amount.gte(ethers.constants.MaxUint256)) {
      throw Error()
    }
    return amount
  } else {
    // eth gained from selling x socks
    const intermediateValue = calculateEtherTokenOutputFromInput(SOCKSAmount, reserveOWNToken, reserveTOKENETH)
    if (intermediateValue.lte(ethers.constants.Zero) || intermediateValue.gte(ethers.constants.MaxUint256)) {
      throw Error()
    }
    // tokens yielded from selling x eth
    const amount = calculateEtherTokenOutputFromInput(
      intermediateValue,
      reserveSelectedTokenETH,
      reserveSelectedTokenToken
    )
    if (amount.lte(ethers.constants.Zero) || amount.gte(ethers.constants.MaxUint256)) {
      throw Error()
    }
    return amount 
  }
}

export default function Main() {
  const { library, account } : {library?: ethers.providers.Web3Provider, account?: string } = useWeb3Context()
  
/*   if (library != null) {
    const aaa = async () => {
      console.log('price', await (await (library.getGasPrice())).toString())
      // 2198356255
    };
    aaa();  
  } */

  // selected token
  const [selectedTokenSymbol, setSelectedTokenSymbol] = useState(TOKEN_SYMBOLS.ETH)

  // get exchange contracts
  const exchangeContractSOCKS = useExchangeContract(TOKEN_ADDRESSES.OWN)
  const exchangeContractSelectedToken = useExchangeContract(TOKEN_ADDRESSES[selectedTokenSymbol])

  // get pair contract
  const routerContract = useRouterContract(ROUTER_ADDRESS);

  // get token contracts
  const tokenContractSOCKS = useTokenContract(TOKEN_ADDRESSES.OWN)
  const tokenContractSelectedToken = useTokenContract(TOKEN_ADDRESSES[selectedTokenSymbol])

  // get balances
  const balanceETH = useAddressBalance(account, TOKEN_ADDRESSES.ETH)
  const balanceOWN = useAddressBalance(account, TOKEN_ADDRESSES.OWN)
  const balanceSelectedToken = useAddressBalance(account, TOKEN_ADDRESSES[selectedTokenSymbol])

  // totalsupply
  const totalSupply = useTotalSupply(tokenContractSOCKS)

  // get allowances
  const allowanceSOCKS = useAddressAllowance(
    account,
    TOKEN_ADDRESSES.OWN,
    exchangeContractSOCKS && exchangeContractSOCKS.address
  )
  const allowanceSelectedToken = useExchangeAllowance(account, TOKEN_ADDRESSES[selectedTokenSymbol])

  // get reserves
  const reserveTOKENETH = useAddressBalance(exchangeContractSOCKS && exchangeContractSOCKS.address, TOKEN_ADDRESSES.ETH)
  const reserveOWNToken = useAddressBalance(
    exchangeContractSOCKS && exchangeContractSOCKS.address,
    TOKEN_ADDRESSES.OWN
  )
  const { reserveETH: reserveSelectedTokenETH, reserveToken: reserveSelectedTokenToken } = useExchangeReserves(
    TOKEN_ADDRESSES[selectedTokenSymbol]
  )

  const [USDExchangeRateETH, setUSDExchangeRateETH] = useState()
  const [USDExchangeRateSelectedToken, setUSDExchangeRateSelectedToken] = useState()

  const ready = !!(
    (account === null || allowanceSOCKS) &&
    (selectedTokenSymbol === 'ETH' || account === null || allowanceSelectedToken) &&
    (account === null || balanceETH) &&
    (account === null || balanceOWN) &&
    (account === null || balanceSelectedToken) &&
    reserveTOKENETH &&
    reserveOWNToken &&
    (selectedTokenSymbol === 'ETH' || reserveSelectedTokenETH) &&
    (selectedTokenSymbol === 'ETH' || reserveSelectedTokenToken) &&
    selectedTokenSymbol// &&    (USDExchangeRateETH || USDExchangeRateSelectedToken)
  )

  //console.log('is ready', ready);

  function _dollarize(amount, exchangeRate) {
    //console.log('doffari', amount.toString(), exchangeRate)
    return amount.mul(exchangeRate).div(ethers.utils.bigNumberify(10).pow(ethers.utils.bigNumberify(18)))
  }

  function dollarize(amount) {
    return _dollarize(
      amount,
      1//selectedTokenSymbol === TOKEN_SYMBOLS.ETH ? USDExchangeRateETH : USDExchangeRateSelectedToken
    )
  }

  const [dollarPrice, setDollarPrice] = useState<ethers.utils.BigNumber>(ethers.utils.bigNumberify(0))
  useEffect(() => {
    try {
      const SOCKSExchangeRateETH = getExchangeRate(reserveOWNToken, reserveTOKENETH)
      setDollarPrice(
        SOCKSExchangeRateETH.mul(USDExchangeRateETH).div(
          ethers.utils.bigNumberify(10).pow(ethers.utils.bigNumberify(18))
        )
      )
    } catch {
      setDollarPrice(ethers.utils.bigNumberify(0))
    }
  }, [USDExchangeRateETH, reserveTOKENETH, reserveOWNToken])

  async function unlock(buyingSOCKS = true) {
    const contract = buyingSOCKS ? tokenContractSelectedToken : tokenContractSOCKS
    const spenderAddress = buyingSOCKS ? exchangeContractSelectedToken.address : exchangeContractSOCKS.address

    const estimatedGasLimit = await contract.estimate.approve(spenderAddress, ethers.constants.MaxUint256)
    const estimatedGasPrice = await library
      .getGasPrice()
      .then(gasPrice => gasPrice.mul(ethers.utils.bigNumberify(150)).div(ethers.utils.bigNumberify(100)))

    return contract.approve(spenderAddress, ethers.constants.MaxUint256, {
      gasLimit: calculateGasMargin(estimatedGasLimit, GAS_MARGIN),
      gasPrice: estimatedGasPrice
    })
  }

  // buy functionality
  const validateBuy = useCallback(
    (numberOfOwnTokens : string): IValidationTradeResult => {
      // validate passed amount
      let parsedValue : ethers.utils.BigNumber;
      try {
        parsedValue = ethers.utils.parseUnits(numberOfOwnTokens, 18)
      } catch (error) {
        error.code = ERROR_CODES.INVALID_AMOUNT
        throw error
      }

      let requiredValueInSelectedToken
      try {
        requiredValueInSelectedToken = calculateAmount(
          selectedTokenSymbol,
          TOKEN_SYMBOLS.OWN,
          parsedValue,
          reserveTOKENETH,
          reserveOWNToken,
          reserveSelectedTokenETH,
          reserveSelectedTokenToken
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
      if (balanceETH && balanceETH !== undefined && balanceETH.lt(ethers.utils.parseEther('.01'))) {
        const error = {} as IValidationError;
        error.code = ERROR_CODES.INSUFFICIENT_ETH_GAS
        //console.log('accumu1', error)
        if (!errorAccumulator) {
          errorAccumulator = error
        }
      }

      // validate minimum selected token balance
      if (balanceSelectedToken && maximum && balanceSelectedToken.lt(maximum)) {
        const error = {} as IValidationError;
        error.code = ERROR_CODES.INSUFFICIENT_SELECTED_TOKEN_BALANCE
        //console.log('accumu2', error)
        if (!errorAccumulator) {
          errorAccumulator = error
        }
      }

      // validate allowance
      if (selectedTokenSymbol !== 'ETH') {
        if (allowanceSelectedToken && maximum && allowanceSelectedToken.lt(maximum)) {
          const error = {} as IValidationError;
          error.code = ERROR_CODES.INSUFFICIENT_ALLOWANCE
          //console.log('accumu3', error)
          if (!errorAccumulator) {
            errorAccumulator = error
          }
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
      allowanceSelectedToken,
      balanceETH,
      balanceSelectedToken,
      reserveTOKENETH,
      reserveOWNToken,
      reserveSelectedTokenETH,
      reserveSelectedTokenToken,
      selectedTokenSymbol
    ]
  )

  async function buy(maximumInputValue, outputValue) {
    console.log('start buy', maximumInputValue.toString(), outputValue.toString())
    const deadline = Math.ceil(Date.now() / 1000) + DEADLINE_FROM_NOW

    const estimatedGasPrice = await library
      .getGasPrice()
      .then(gasPrice => gasPrice.mul(ethers.utils.bigNumberify(150)).div(ethers.utils.bigNumberify(100)))

    if (selectedTokenSymbol === TOKEN_SYMBOLS.ETH) {
      await routerContract.estimate.swapETHForExactTokens



      const estimatedGasLimit = await exchangeContractSOCKS.estimate.ethToTokenSwapOutput(outputValue, deadline, {
        value: maximumInputValue
      })


      return exchangeContractSOCKS.ethToTokenSwapOutput(outputValue, deadline, {
        value: maximumInputValue,
        gasLimit: calculateGasMargin(estimatedGasLimit, GAS_MARGIN),
        gasPrice: estimatedGasPrice
      })
    } else {
      const estimatedGasLimit = await exchangeContractSelectedToken.estimate.tokenToTokenSwapOutput(
        outputValue,
        maximumInputValue,
        ethers.constants.MaxUint256,
        deadline,
        TOKEN_ADDRESSES.OWN
      )
      return exchangeContractSelectedToken.tokenToTokenSwapOutput(
        outputValue,
        maximumInputValue,
        ethers.constants.MaxUint256,
        deadline,
        TOKEN_ADDRESSES.OWN,
        {
          gasLimit: calculateGasMargin(estimatedGasLimit, GAS_MARGIN),
          gasPrice: estimatedGasPrice
        }
      )
    }
  }

  // sell functionality
  const validateSell = useCallback(
    (numberOfOwnTokens : string) : IValidationTradeResult => {
      // validate passed amount
      let parsedValue : ethers.utils.BigNumber;
      try {
        parsedValue = ethers.utils.parseUnits(numberOfOwnTokens, 18)
      } catch (error) {
        error.code = ERROR_CODES.INVALID_AMOUNT
        throw error
      }

      // how much ETH or tokens the sale will result in
      let requiredValueInSelectedToken
      try {
        requiredValueInSelectedToken = calculateAmount(
          TOKEN_SYMBOLS.OWN,
          selectedTokenSymbol,
          parsedValue,
          reserveTOKENETH,
          reserveOWNToken,
          reserveSelectedTokenETH,
          reserveSelectedTokenToken
        )
      } catch (error) {
        //error.code = ERROR_CODES.INVALID_EXCHANGE
        // LAURITODO
        throw error
      }

      // slippage-ized
      const { minimum } = calculateSlippageBounds(requiredValueInSelectedToken)

      // the following are 'non-breaking' errors that will still return the data
      let errorAccumulator : IValidationError;
      // validate minimum ether balance
      if (balanceETH.lt(ethers.utils.parseEther('.01'))) {
        const error = {} as IValidationError;
        error.code = ERROR_CODES.INSUFFICIENT_ETH_GAS
        if (!errorAccumulator) {
          errorAccumulator = error
        }
      }

      // validate minimum socks balance
      if (balanceOWN.lt(parsedValue)) {
        const error = {} as IValidationError;
        error.code = ERROR_CODES.INSUFFICIENT_SELECTED_TOKEN_BALANCE
        if (!errorAccumulator) {
          errorAccumulator = error
        }
      }

      // validate allowance
      if (allowanceSOCKS.lt(parsedValue)) {
        const error = {} as IValidationError;
        error.code = ERROR_CODES.INSUFFICIENT_ALLOWANCE
        if (!errorAccumulator) {
          errorAccumulator = error
        }
      }

      return {
        inputValue: parsedValue,
        outputValue: requiredValueInSelectedToken,
        minimumOutputValue: minimum,
        error: errorAccumulator
      }
    },
    [
      allowanceSOCKS,
      balanceETH,
      balanceOWN,
      reserveTOKENETH,
      reserveOWNToken,
      reserveSelectedTokenETH,
      reserveSelectedTokenToken,
      selectedTokenSymbol
    ]
  )

  async function sell(inputValue, minimumOutputValue) {
    const deadline = Math.ceil(Date.now() / 1000) + DEADLINE_FROM_NOW

    const estimatedGasPrice = await library
      .getGasPrice()
      .then(gasPrice => gasPrice.mul(ethers.utils.bigNumberify(150)).div(ethers.utils.bigNumberify(100)))

    if (selectedTokenSymbol === TOKEN_SYMBOLS.ETH) {
      const estimatedGasLimit = await exchangeContractSOCKS.estimate.tokenToEthSwapInput(
        inputValue,
        minimumOutputValue,
        deadline
      )
      return exchangeContractSOCKS.tokenToEthSwapInput(inputValue, minimumOutputValue, deadline, {
        gasLimit: calculateGasMargin(estimatedGasLimit, GAS_MARGIN),
        gasPrice: estimatedGasPrice
      })
    } else {
      const estimatedGasLimit = await exchangeContractSOCKS.estimate.tokenToTokenSwapInput(
        inputValue,
        minimumOutputValue,
        ethers.constants.One,
        deadline,
        TOKEN_ADDRESSES[selectedTokenSymbol]
      )
      return exchangeContractSOCKS.tokenToTokenSwapInput(
        inputValue,
        minimumOutputValue,
        ethers.constants.One,
        deadline,
        TOKEN_ADDRESSES[selectedTokenSymbol],
        {
          gasLimit: calculateGasMargin(estimatedGasLimit, GAS_MARGIN),
          gasPrice: estimatedGasPrice
        }
      )
    }
  }

  async function burn(amount) {
    const parsedAmount = ethers.utils.parseUnits(amount, 18)

    const estimatedGasPrice = await library
      .getGasPrice()
      .then(gasPrice => gasPrice.mul(ethers.utils.bigNumberify(150)).div(ethers.utils.bigNumberify(100)))

    const estimatedGasLimit = await tokenContractSOCKS.estimate.burn(parsedAmount)

    return tokenContractSOCKS.burn(parsedAmount, {
      gasLimit: calculateGasMargin(estimatedGasLimit, GAS_MARGIN),
      gasPrice: estimatedGasPrice
    })
  }

  return (
    <Body
      selectedTokenSymbol={selectedTokenSymbol}
      setSelectedTokenSymbol={setSelectedTokenSymbol}
      ready={ready}
      unlock={unlock}
      validateBuy={validateBuy}
      buy={buy}
      validateSell={validateSell}
      sell={sell}
      burn={burn}
      dollarize={dollarize}
      dollarPrice={dollarPrice}
      balanceOWN={balanceOWN}
      reserveOWNToken={reserveOWNToken}
      totalSupply={totalSupply}
    />
  )
}
