import React from 'react'
import Web3Provider, { Connectors } from 'web3-react'
import WalletConnectApi from '@walletconnect/web3-subprovider'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'

import GlobalStyle, { ThemeProvider } from '../theme'
import Web3ReactManager from '../components/Web3ReactManager'
import AppProvider from '../context'
import Main from './Main'
import { USED_CHAIN_ID } from '../utils'

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
  return (
    <ThemeProvider>
      <>
        <GlobalStyle />
        <Web3Provider connectors={connectors} libraryName={'ethers.js'}>
          <Web3ReactManager>
            <AppProvider>
              <BrowserRouter>
                <Switch>
                  <Route exact strict path="/" render={() => <Main />} />
                  <Route exact strict path="/status" render={() => <Main status />} />
                  <Route exact strict path="/stats" render={() => <Main stats />} />
                  <Redirect to="/" />
                </Switch>
              </BrowserRouter>
            </AppProvider>
          </Web3ReactManager>
        </Web3Provider>
      </>
    </ThemeProvider>
  )
}
