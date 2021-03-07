import React, { useState, useEffect } from 'react'
import { useWeb3Context } from 'web3-react'
import { ethers } from 'ethers'
import { Message } from './styles'
import { getDesiredChainId, ChainIds } from '../../utils'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

export default function Web3ReactManager({ children }) {
  const { setConnector, error, active, networkId, connector } = useWeb3Context()
  const [networkErrorOpen, setNetworkErrorOpen] = React.useState(false);

  const checkCorrectNetwork = async (library) => {
    var network = await library.getNetwork();
    if (network.chainId !== getDesiredChainId()) {
      console.warn("Skipping injected network " + network.chainId + " since we require " + getDesiredChainId());
      setNetworkErrorOpen(true);
      return false;      
    }
    return true;
  }

  // initialization management
  useEffect(()  =>  {
    const main = async () => {
      if (!active) {
        if (window.ethereum) {
          try {
            const library = new ethers.providers.Web3Provider(window.ethereum)
            if (!await checkCorrectNetwork(library)) {
              await setConnector('Network')
            }
            else {
              library.listAccounts().then(accounts => {
                if (accounts.length >= 1) {
                  setConnector('Injected', { suppressAndThrowErrors: true })
                } else {
                  setConnector('Network')
                }
              })
            }
          } catch {
            setConnector('Network')
          }
        } else {
          setConnector('Network')
        }
      }
    }
   main();
  }, [active, setConnector])

  const [showLoader, setShowLoader] = useState(false)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLoader(true)
    }, 750)
    return () => {
      clearTimeout(timeout)
    }
  }, [])

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNetworkErrorOpen(false);
  };

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  if (error) {
    console.error(error)
    return <Message>Connection Error.</Message>
  } else if (!active) {
    return showLoader ? <Message>Initializing...</Message> : null
  } else {
    return (
      <>
      <Snackbar open={networkErrorOpen} autoHideDuration={60000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="error">
        You are using the wrong Ethereum network. Please use {ChainIds[getDesiredChainId()]}
      </Alert>
    </Snackbar>
    {children}
    </>)
  }
}
