import { ethers } from 'ethers'

import ERC20_ABI from './erc20.json'
import EXCHANGE_ABI from './router02.json'
import ROUTER_ABI from './router02.json'
import FACTORY_ABI from './factory02.json'

import UncheckedJsonRpcSigner from './signer'

export const FACTORY_ADDRESS = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';// 02 ropsten //;process.env.REACT_APP_FACTORY_ADDRESS;
export const ROUTER_ADDRESS = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'; 
export const WETH_ADDRESS ='0xc778417e063141139fce010982780140aa0cd5ab'; // Ropsten

export const TOKEN_ADDRESSES = {
  ETH: 'ETH',
  //SOCKS: '0xad6d458402f60fd3bd25163575031acdce07538d' // <- DAi. old://'0x23B608675a2B2fB1890d3ABBd85c5775c51691d5'
  OWN: '0x0306bac141b07ab9dd8cbabfc0d8aaa995821ae2' // My own token in ropsten, 50 * 1e18 totalsupply
}

export const PAIR_ADDRESS= '0x1210CFdbce237500f77119DfbDe9177b035Ff24A'; // Wrong?

export const TOTAL_NUM_OF_TOKENS = 50;
export const USED_CHAIN_ID : number = 3;

export const TOKEN_SYMBOLS = { ETH: 'ETH', OWN: 'OWN'};/* Object.keys(TOKEN_ADDRESSES).reduce((o, k) => {
  o[k] = k
  return o
}, {}); */


export const ERROR_CODES =
{
  INVALID_AMOUNT: 'INVALID_AMOUNT',
  INVALID_TRADE: 'INVALID_TRADE',
  INSUFFICIENT_ETH_GAS: 'INSUFFICIENT_ETH_GAS',
  INSUFFICIENT_SELECTED_TOKEN_BALANCE: 'INSUFFICIENT_SELECTED_TOKEN_BALANCE',
  INSUFFICIENT_ALLOWANCE: 'INSUFFICIENT_ALLOWANCE'
};
/* [
  'INVALID_AMOUNT',
  'INVALID_TRADE',
  'INSUFFICIENT_ETH_GAS',
  'INSUFFICIENT_SELECTED_TOKEN_BALANCE',
  'INSUFFICIENT_ALLOWANCE'
].reduce((o, k, i) => {
  o[k] = i
  return o
}, {}) */

export const TRADE_TYPES = {
  BUY: 'BUY',
  SELL: 'SELL',
  UNLOCK: 'UNLOCK'
};
  /* ['BUY', 'SELL', 'UNLOCK'].reduce((o, k, i) => {
  o[k] = i
  return o
}, {}) */

export function isAddress(value) {
  try {
    ethers.utils.getAddress(value)
    return true
  } catch {
    return false
  }
}

// account is optional
export function getProviderOrSigner(library, account) {
  //console.log('get provider', account, library);
  return account ? new UncheckedJsonRpcSigner(library.getSigner(account)) : library
}

// account is optional
export function getContract(address, ABI, library, account) {
  if (!isAddress(address) || address === ethers.constants.AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
//console.log('getting contract ', address, ABI, getProviderOrSigner(library, account));
  const c = new ethers.Contract(address, ABI, getProviderOrSigner(library, account))
  //console.log('found contract ', c);
  return c;
}

export function getTokenContract(tokenAddress, library, account) {
  return getContract(tokenAddress, ERC20_ABI, library, account)
}

export function getExchangeContract(exchangeAddress, library, account) {
  return getContract(exchangeAddress, EXCHANGE_ABI, library, account)
}

export function getRouterContract(address, library, account) {
  return getContract(address, ROUTER_ABI, library, account)
}

export async function getTokenExchangeAddressFromFactory(tokenAddress, library, account) {
  if (!FACTORY_ABI) {
    console.log('nope');
  }
  return getContract(FACTORY_ADDRESS, FACTORY_ABI, library, account).getExchange(tokenAddress)
}

// get the ether balance of an address
export async function getEtherBalance(address, library) {
  if (!isAddress(address)) {
    throw Error(`Invalid 'address' parameter '${address}'`)
  }

  return library.getBalance(address)
}

// get the token balance of an address
export async function getTokenBalance(tokenAddress, address, library) {
  if (!isAddress(tokenAddress) || !isAddress(address)) {
    throw Error(`Invalid 'tokenAddress' or 'address' parameter '${tokenAddress}' or '${address}'.`)
  }

  return getContract(tokenAddress, ERC20_ABI, library, null).balanceOf(address) as ethers.utils.BigNumber
}

export async function getTokenAllowance(address, tokenAddress, spenderAddress, library) {
  if (!isAddress(address) || !isAddress(tokenAddress) || !isAddress(spenderAddress)) {
    throw Error(
      "Invalid 'address' or 'tokenAddress' or 'spenderAddress' parameter" +
        `'${address}' or '${tokenAddress}' or '${spenderAddress}'.`
    )
  }

  return getContract(tokenAddress, ERC20_ABI, library, null).allowance(address, spenderAddress) as ethers.utils.BigNumber
}

export function amountFormatter(amount, baseDecimals = 18, displayDecimals = 3, useLessThan = true) {
  if (baseDecimals > 18 || displayDecimals > 18 || displayDecimals > baseDecimals) {
    throw Error(`Invalid combination of baseDecimals '${baseDecimals}' and displayDecimals '${displayDecimals}.`)
  }

  // if balance is falsy, return undefined
  if (!amount) {
    return undefined
  }
  // if amount is 0, return
  else if (amount.isZero()) {
    return '0'
  }
  // amount > 0
  else {
    // amount of 'wei' in 1 'ether'
    const baseAmount = ethers.utils.bigNumberify(10).pow(ethers.utils.bigNumberify(baseDecimals))

    const minimumDisplayAmount = baseAmount.div(
      ethers.utils.bigNumberify(10).pow(ethers.utils.bigNumberify(displayDecimals))
    )

    // if balance is less than the minimum display amount
    if (amount.lt(minimumDisplayAmount)) {
      return useLessThan
        ? `<${ethers.utils.formatUnits(minimumDisplayAmount, baseDecimals)}`
        : `${ethers.utils.formatUnits(amount, baseDecimals)}`
    }
    // if the balance is greater than the minimum display amount
    else {
      const stringAmount = ethers.utils.formatUnits(amount, baseDecimals)

      // if there isn't a decimal portion
      if (!stringAmount.match(/\./)) {
        return stringAmount
      }
      // if there is a decimal portion
      else {
        const [wholeComponent, decimalComponent] = stringAmount.split('.')
        const roundUpAmount = minimumDisplayAmount.div(ethers.constants.Two)
        const roundedDecimalComponent = ethers.utils
          .bigNumberify(decimalComponent.padEnd(baseDecimals, '0'))
          .add(roundUpAmount)
          .toString()
          .padStart(baseDecimals, '0')
          .substring(0, displayDecimals)

        // decimals are too small to show
        if (roundedDecimalComponent === '0'.repeat(displayDecimals)) {
          return wholeComponent
        }
        // decimals are not too small to show
        else {
          return `${wholeComponent}.${roundedDecimalComponent.toString().replace(/0*$/, '')}`
        }
      }
    }
  }
}
