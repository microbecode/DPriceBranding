import React, { useState } from 'react'
import Web3Provider, { Connectors } from 'web3-react'
import WalletConnectApi from '@walletconnect/web3-subprovider'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'

import GlobalStyle, { ThemeProvider } from '../theme'
import Web3ReactManager from '../components/Web3ReactManager'
import Main from './Main'
import { TRADE_TYPES, USED_CHAIN_ID } from '../utils'
import { AppContext, initialContextState } from 'context'
import { IAppContextState } from 'types'
import { ethers } from 'ethers'

const PROVIDER_URL = process.env.REACT_APP_PROVIDER_URL

const { NetworkOnlyConnector, InjectedConnector, WalletConnectConnector } = Connectors
const Network = new NetworkOnlyConnector({
  providerURL: PROVIDER_URL
})
const Injected = new InjectedConnector({ supportedNetworks: [USED_CHAIN_ID] })
const WalletConnect = new WalletConnectConnector({
  api: WalletConnectApi,
  bridge: 'https://bridge.walletconnect.org',
  supportedNetworkURLs: {
    USED_CHAIN_ID: PROVIDER_URL
  },
  defaultNetwork: USED_CHAIN_ID
})
const connectors = { Network, Injected, WalletConnect  }



export default function App() {
/* 
  const aa = async () => {
    var p1 = (await Injected.getProvider()) as ethers.providers.Provider;
    var p2 = await Network.getProvider();
    //var p3 = await WalletConnect.getProvider();
    var netw = await p1.;
    
    console.log('app', p1, netw.chainId)
    //console.log('aaaa', p1.getNetwork())
  }
  aa(); */

  const [state, setState] = useState<IAppContextState>(initialContextState);
  const value = { state, setState };

  return (
    <ThemeProvider>
        <GlobalStyle />
        <Web3Provider connectors={connectors} libraryName={'ethers.js'}>
          <Web3ReactManager>
            <AppContext.Provider value={value}>
              <BrowserRouter>
                <Switch>
                  <Route exact strict path="/" render={() => <Main />} />
                  <Redirect to="/" />
                </Switch>
              </BrowserRouter>
            </AppContext.Provider>
          </Web3ReactManager>
        </Web3Provider>
    </ThemeProvider>
  )
}
