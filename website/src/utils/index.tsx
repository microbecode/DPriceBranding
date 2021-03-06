import { ethers } from 'ethers'

import ERC20_ABI from './erc20.json'
import EXCHANGE_ABI from './router02.json'
import ROUTER_ABI from './router02.json'
import PAIR_ABI from './pair.json'

import UncheckedJsonRpcSigner from './signer'

export const TOKEN_NAME = '$HDK';
export const TOTAL_NUM_OF_TOKENS = 30;

export enum AddressTypes {
  OWN,
  PAIR,
  WETH,
  ROUTER,
  ETH
}

enum ChainIds {
  Mainnet = 1,
  Ropsten = 3
}

export const getDesiredChainId = () : number => {
  return process.env.REACT_APP_ENVIRONMENT === 'prod' ? ChainIds.Mainnet : ChainIds.Ropsten;
}

export const GetAddress = (type : AddressTypes) : string => {
  if (getDesiredChainId() === ChainIds.Ropsten) {
    switch (type) {
      case AddressTypes.OWN:
        return '0xBB393edDe4A8301b06968955EC13A2ab601239A6';
      case AddressTypes.PAIR:
        return '0x4d596212C9734882E0b6D4f148e27fdF33aDd183';
      case AddressTypes.ROUTER:
        return '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
      case AddressTypes.WETH:
        return '0xc778417e063141139fce010982780140aa0cd5ab';
    }
  }
  else if (getDesiredChainId() === ChainIds.Mainnet) {
    switch (type) {
      case AddressTypes.OWN:
        return '';
      case AddressTypes.PAIR:
        return '';
      case AddressTypes.ROUTER:
        return '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
      case AddressTypes.WETH:
        return '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
    }
  }
  if (type === AddressTypes.ETH) {
    return 'ETH';
  }
  return null;
}

export const TOKEN_SYMBOLS = { ETH: 'ETH', OWN: 'OWN'};

export const ERROR_CODES =
{
  INVALID_AMOUNT: 'INVALID_AMOUNT',
  INVALID_TRADE: 'INVALID_TRADE',
  INSUFFICIENT_ETH_GAS: 'INSUFFICIENT_ETH_GAS',
  INSUFFICIENT_SELECTED_TOKEN_BALANCE: 'INSUFFICIENT_SELECTED_TOKEN_BALANCE',
  INSUFFICIENT_ALLOWANCE: 'INSUFFICIENT_ALLOWANCE'
};

export const TRADE_TYPES = {
  BUY: 'BUY',
  UNLOCK: 'UNLOCK',
  REDEEM: 'REDEEM'
};

export function isAddress(value) {
  try {
    ethers.utils.getAddress(value)
    return true
  } catch {
    return false
  }
}

export function getEtherscanLink(hash) {
  if (process.env.REACT_APP_ENVIRONMENT === 'prod') {
    return `https://etherscan.io/tx/${hash}`    
  }
  return `https://ropsten.etherscan.io/tx/${hash}`;
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

export function getPairContract(address, library, account) {
  return getContract(address, PAIR_ABI, library, account)
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
