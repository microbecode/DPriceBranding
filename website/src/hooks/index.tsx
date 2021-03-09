import { useEffect, useState, useCallback, useMemo } from 'react'
import { useWeb3Context } from 'web3-react'
import { AddressTypes, GetAddress, getPairContract, getRouterContract } from '../utils'

import {
  isAddress,
  getTokenContract,
  getEtherBalance,
  getTokenBalance
} from '../utils'
import { ethers, utils } from 'ethers'
import { BigNumber } from 'ethers/utils'
import { IPairReserves } from 'types'

export function useBlockEffect(functionToRun) {
  const { library } = useWeb3Context()

  useEffect(() => {
    function wrappedEffect(blockNumber) {
      functionToRun(blockNumber)
    }
    if (library) {      
      library.on('block', wrappedEffect)
      return () => {
        library.removeListener('block', wrappedEffect)
      }
    }
  }, [library, functionToRun])
}

export function useTokenContract(tokenAddress, withSignerIfPossible = true) {
  const { library, account } = useWeb3Context()

  return useMemo(() => {
    try {
      return getTokenContract(tokenAddress, library, withSignerIfPossible ? account : undefined)
    } catch {
      return null
    }
  }, [account, library, tokenAddress, withSignerIfPossible])
}

export function useRouterContract(routerAddress : string, withSignerIfPossible = true ) {
  const { library, account } : {library?: ethers.providers.Web3Provider, account?: string } = useWeb3Context()

  return useMemo(() => {
    try {
      return getRouterContract(routerAddress, library, withSignerIfPossible ? account : undefined)
    } catch {
      return null
    }
  }, [routerAddress, library, withSignerIfPossible, account])
}

export function usePairContract(pairAddress : string, withSignerIfPossible = true ) {
  const { library, account } : {library?: ethers.providers.Web3Provider, account?: string } = useWeb3Context()

  return useMemo(() => {
    try {
      return getPairContract(pairAddress, library, withSignerIfPossible ? account : undefined)
    } catch {
      return null
    }
  }, [pairAddress, library, withSignerIfPossible, account])
}

export function useAddressBalance(address, tokenAddress) {
  const { library } = useWeb3Context()

  const [balance, setBalance] = useState<utils.BigNumber>()

  const updateBalance = useCallback(() => {
    if (isAddress(address) && (tokenAddress === 'ETH' || isAddress(tokenAddress))) {
      let stale = false;

      (tokenAddress === 'ETH' ? getEtherBalance(address, library) : getTokenBalance(tokenAddress, address, library))
        .then(value => {
          if (!stale) {
            setBalance(value)
          }
        })
        .catch(() => {
          if (!stale) {
            setBalance(null)
          }
        })
      return () => {
        stale = true
        setBalance(null)
      }
    }
  }, [address, library, tokenAddress])

  useEffect(() => {
    return updateBalance()
  }, [updateBalance])

  useBlockEffect(updateBalance)

  return balance
}

export function useTotalSupply(contract) {
  const [totalSupply, setTotalSupply] = useState()

  const updateTotalSupply = useCallback(() => {
    if (!!contract) {
      let stale = false

      contract
        .totalSupply()
        .then(value => {
          if (!stale) {
            setTotalSupply(value)
          }
        })
        .catch(() => {
          if (!stale) {
            setTotalSupply(null)
          }
        })
      return () => {
        stale = true
        setTotalSupply(null)
      }
    }
  }, [contract])

  useEffect(() => {
    return updateTotalSupply()
  }, [updateTotalSupply])

  useBlockEffect(updateTotalSupply)

  return totalSupply && Math.round(Number(utils.formatEther(totalSupply)))
}

export function usePairReserves() : IPairReserves {
  const defaultVal = useCallback(() => {
    return { reserveETH: utils.bigNumberify(0), reserveToken: utils.bigNumberify(0) };
  }, []);

  const [reserves, setReserves] = useState<IPairReserves>(defaultVal())
  const contr = usePairContract(GetAddress(AddressTypes.PAIR));
  const updateReserves = useCallback(() => {
    let stale = false;
    if (contr == null) {
      setReserves(defaultVal());
    }
    else {
      contr.getReserves().then(res => {
        if (!stale) {
          const reserveETH = res[1] as BigNumber;
          const reserveToken = res[0] as BigNumber;
          const data : IPairReserves = { reserveETH, reserveToken };
          setReserves(data);        
        }
      })
      .catch(() => {
        if (!stale) {
          setReserves(defaultVal())
        }
      });
    }
    return () => {
      stale = true
      setReserves(defaultVal())
    }    
  }, [contr, defaultVal])

  useEffect(() => {
    return updateReserves()
  }, [updateReserves])

  useBlockEffect(updateReserves)

  return reserves
}
