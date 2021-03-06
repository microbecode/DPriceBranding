import React, { useState } from 'react'
import Web3Provider, { Connectors } from 'web3-react'
import WalletConnectApi from '@walletconnect/web3-subprovider'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'

import GlobalStyle, { ThemeProvider } from '../theme'
import Web3ReactManager from '../components/Web3ReactManager'
import Main from './Main'
import { AppContext, initialContextState } from 'context'
import { IAppContextState } from 'types'
import { getDesiredChainId } from 'utils'

const PROVIDER_URL = process.env.REACT_APP_PROVIDER_URL

const { NetworkOnlyConnector, InjectedConnector, /* WalletConnectConnector */ } = Connectors
const Network = new NetworkOnlyConnector({
  providerURL: PROVIDER_URL
})
const Injected = new InjectedConnector({ supportedNetworks: [
  getDesiredChainId()
] })

const connectors = { Network, Injected, /* WalletConnect */  }

export default function App() {

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
                  <Route exact strict path="/learnmore" render={() => <Main showLearnMore={true} />} />
                  <Route exact strict path="/stats" render={() => <Main showStats={true} />} />
                  <Route exact strict path="/faq" render={() => <Main showFAQ={true} />} />
                  <Redirect to="/" />
                </Switch>
              </BrowserRouter>
            </AppContext.Provider>
          </Web3ReactManager>
        </Web3Provider>
    </ThemeProvider>
  )
}
