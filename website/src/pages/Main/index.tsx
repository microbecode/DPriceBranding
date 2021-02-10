import React, { useState, useCallback, useEffect } from 'react'
import { useWeb3Context } from 'web3-react'
import { ethers } from 'ethers'

import { TOKEN_SYMBOLS, TOKEN_ADDRESSES, ERROR_CODES, PAIR_ADDRESS, ROUTER_ADDRESS, WETH_ADDRESS, LAURI_WALLET } from '../../utils'
import {
  useTokenContract,
  useExchangeContract,
  useAddressBalance,
  useAddressAllowance,
  usePairReserves,
  useExchangeAllowance,
  useTotalSupply,
  useRouterContract
} from '../../hooks'
import Body from '../Body'
import { IValidationError, IValidationTradeResult } from 'types'
import { Web3Context } from 'web3-react/dist/context'
import { BigNumber } from 'ethers/utils'

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
  tokenAmount,
  reserveETH,
  reserveToken,
/*   reserveSelectedTokenETH,
  reserveSelectedTokenToken */
) {

  console.log('reserveEth', reserveETH.toString(), "reserveToken", reserveToken.toString(), "tokenAmount", tokenAmount.toString());
  // eth to token - buy
  if (inputTokenSymbol === TOKEN_SYMBOLS.ETH && outputTokenSymbol === TOKEN_SYMBOLS.OWN) {
    const amount = calculateEtherTokenInputFromOutput(tokenAmount, reserveETH, reserveToken)
    if (amount.lte(ethers.constants.Zero) || amount.gte(ethers.constants.MaxUint256)) {
      throw Error()
    }
    return amount
  }

  // token to eth - sell
  if (inputTokenSymbol === TOKEN_SYMBOLS.OWN && outputTokenSymbol === TOKEN_SYMBOLS.ETH) {
    const amount = calculateEtherTokenOutputFromInput(tokenAmount, reserveToken, reserveETH)
    if (amount.lte(ethers.constants.Zero) || amount.gte(ethers.constants.MaxUint256)) {
      throw Error()
    }

    return amount
  }
  console.log('shouldnt happen')

  /* // token to token - buy or sell
  const buyingSOCKS = outputTokenSymbol === TOKEN_SYMBOLS.OWN

  if (buyingSOCKS) {
    // eth needed to buy x socks
    const intermediateValue = calculateEtherTokenInputFromOutput(tokenAmount, reserveTOKENETH, reserveOWNToken)
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
    const intermediateValue = calculateEtherTokenOutputFromInput(tokenAmount, reserveOWNToken, reserveTOKENETH)
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
  } */
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
  //const exchangeContractSOCKS = useExchangeContract(TOKEN_ADDRESSES.OWN)
  //const exchangeContractSelectedToken = useExchangeContract(TOKEN_ADDRESSES[selectedTokenSymbol])

  // get pair contract
  const routerContract = useRouterContract(ROUTER_ADDRESS);

  // get token contracts
  const tokenContractSOCKS = useTokenContract(TOKEN_ADDRESSES.OWN)
  //const tokenContractSelectedToken = useTokenContract(TOKEN_ADDRESSES[selectedTokenSymbol])

  // get balances
  const myBalanceETH = useAddressBalance(account, TOKEN_ADDRESSES.ETH)
  const myBalanceOWN = useAddressBalance(account, TOKEN_ADDRESSES.OWN)
  //const balanceSelectedToken = useAddressBalance(account, TOKEN_ADDRESSES[selectedTokenSymbol])
//console.log('my bal', myBalanceETH.toString(), 'se', myBalanceOWN.toString())

  // totalsupply
  const totalSupply = useTotalSupply(tokenContractSOCKS)

  // get allowances
  const allowanceSOCKS = useAddressAllowance(
    account,
    TOKEN_ADDRESSES.OWN,
    ROUTER_ADDRESS
  )
  const allowanceSelectedToken = useExchangeAllowance(account, TOKEN_ADDRESSES[selectedTokenSymbol])

  // get reserves
/*   const reserveTOKENETH = useAddressBalance(ROUTER_ADDRESS, TOKEN_ADDRESSES.ETH)
  const reserveOWNToken = useAddressBalance(ROUTER_ADDRESS, TOKEN_ADDRESSES.OWN) */
   const { reserveETH, reserveToken } = usePairReserves() 
   

/*   const [USDExchangeRateETH, setUSDExchangeRateETH] = useState()
  const [USDExchangeRateSelectedToken, setUSDExchangeRateSelectedToken] = useState() */

  const ready = !!(
    (account === null || allowanceSOCKS) &&
    (selectedTokenSymbol === 'ETH' || account === null || allowanceSelectedToken) &&
    (account === null || myBalanceETH) &&
    (account === null || myBalanceOWN) &&
 //   (account === null || balanceSelectedToken) &&
    reserveETH &&
    reserveToken &&
    (selectedTokenSymbol === 'ETH' || reserveETH) &&
  //  (selectedTokenSymbol === 'ETH' || reserveSelectedTokenToken) &&
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
/*   useEffect(() => {
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
  }, [USDExchangeRateETH, reserveTOKENETH, reserveOWNToken]) */

  async function unlock(buyingSOCKS = true) {
/*     const contract = buyingSOCKS ? tokenContractSelectedToken : tokenContractSOCKS
    const spenderAddress = buyingSOCKS ? exchangeContractSelectedToken.address : exchangeContractSOCKS.address */

    const estimatedGasLimit = await tokenContractSOCKS.estimate.approve(ROUTER_ADDRESS, ethers.constants.MaxUint256)
    const estimatedGasPrice = await library
      .getGasPrice()
      .then(gasPrice => gasPrice.mul(ethers.utils.bigNumberify(150)).div(ethers.utils.bigNumberify(100)))

    return tokenContractSOCKS.approve(ROUTER_ADDRESS, ethers.constants.MaxUint256, {
      gasLimit: calculateGasMargin(estimatedGasLimit, GAS_MARGIN),
      gasPrice: estimatedGasPrice
    })
  }

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
        console.log('validating buy with data', reserveETH.toString(), reserveToken.toString());
        requiredValueInSelectedToken = calculateAmount(
          selectedTokenSymbol,
          TOKEN_SYMBOLS.OWN,
          parsedValue,
          reserveETH,
          reserveToken/* ,
          reserveSelectedTokenETH,
          reserveSelectedTokenToken */
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
        //console.log('accumu1', error)
        if (!errorAccumulator) {
          errorAccumulator = error
        }
      }

      // validate minimum selected token balance
      /* if (myBalanceOWN && maximum && myBalanceOWN.lt(maximum)) {
        const error = {} as IValidationError;
        error.code = ERROR_CODES.INSUFFICIENT_SELECTED_TOKEN_BALANCE
        //console.log('accumu2', error)
        if (!errorAccumulator) {
          errorAccumulator = error
        }
      } */

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
      myBalanceETH,
     // myBalanceOWN,
      reserveETH,
      reserveToken,
/*       reserveSelectedTokenETH,
      reserveSelectedTokenToken, */
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

      console.log('eth');

      const oneToken = ethers.utils.bigNumberify(10).pow(17);
      console.log('one token' , oneToken.toString())
      const routerPath = [WETH_ADDRESS, TOKEN_ADDRESSES.OWN];

      const aa = await routerContract.getAmountsIn(oneToken, routerPath) as BigNumber;
    //  const maximumInputValue = aa[1];
      console.log('aaa', aa[0].toString(), aa[1].toString());
      console.log('max input', maximumInputValue.toString(), "output", outputValue.toString());

      const estimatedGasLimit = await routerContract.estimate.swapETHForExactTokens(1, routerPath, LAURI_WALLET, 9999999999, {value: aa[0]}) as BigNumber;
      console.log('res', estimatedGasLimit.toString());

      const trx = await routerContract.swapETHForExactTokens(outputValue, routerPath, LAURI_WALLET, deadline, {
        value: maximumInputValue,
        gasLimit: calculateGasMargin(estimatedGasLimit, GAS_MARGIN),
        gasPrice: estimatedGasPrice
      }) as BigNumber;
console.log('trx', trx)
return trx;


      /*const estimatedGasLimit = await exchangeContractSOCKS.estimate.ethToTokenSwapOutput(outputValue, deadline, {
        value: maximumInputValue
      })


      return exchangeContractSOCKS.ethToTokenSwapOutput(outputValue, deadline, {
        value: maximumInputValue,
        gasLimit: calculateGasMargin(estimatedGasLimit, GAS_MARGIN),
        gasPrice: estimatedGasPrice
      }) */
/*     } else {
      const estimatedGasLimit = await routerContract.estimate.tokenToTokenSwapOutput(
        outputValue,
        maximumInputValue,
        ethers.constants.MaxUint256,
        deadline,
        TOKEN_ADDRESSES.OWN
      )
      return routerContract.tokenToTokenSwapOutput(
        outputValue,
        maximumInputValue,
        ethers.constants.MaxUint256,
        deadline,
        TOKEN_ADDRESSES.OWN,
        {
          gasLimit: calculateGasMargin(estimatedGasLimit, GAS_MARGIN),
          gasPrice: estimatedGasPrice
        }
      ) */
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

/*   const check = async () => {
    const myTokenBalance = await a();
  } */
  useEffect(() => {
    if (myBalanceOWN) {
      console.log('my balance', myBalanceOWN.toString())
    }
  }, [myBalanceOWN]);
  useEffect(() => {
    if (reserveToken) {
      console.log('used res, eth', reserveETH.toString(), 'used tok', reserveToken.toString())
    }
  }, [reserveToken, reserveETH]);

  

  return (
    <Body
      selectedTokenSymbol={selectedTokenSymbol}
      setSelectedTokenSymbol={setSelectedTokenSymbol}
      ready={ready}
      unlock={unlock}
      validateBuy={validateBuy}
      buy={buy}
      burn={burn}
      dollarize={dollarize}
      dollarPrice={dollarPrice}
      balanceOWN={myBalanceOWN}
      reserveOWNToken={reserveToken}
      totalSupply={totalSupply}
    />
  )
}
