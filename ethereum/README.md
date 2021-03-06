# DpriceBranding
Smart contracts for DpriceBranding project (Ethereum NFTs)

# Local testing

## Install stuff
1. Install yarn
1. Install ganache-cli
1. Install truffle

## Setup services

1. Use an Ethereum node (Alchemy)
1. Have an Ethereum wallet ready with Ropsten Eth
1. Create an Etherscan account and API key

## Create environment settings

You need to create a file called `.env` in this folder with the following settings:

    PROVIDER_URL='https://eth-ropsten.alchemyapi.io/v2/YOURKEY'
    PRIVATE_KEY='YOUR_WALLET_PRIVATE_KEY'
    ETHERSCAN_API_KEY='ETHERSCAN_API_KEY'


## Run stuff only locally
Start local blockchain: `ganache-cli`
Run unit tests: `truffle test`

## Run stuff with Ropsten
1. Deploy to Ropsten: `truffle migrate --network Ropsten`
1. Note the given `pair address`, `token address` and `nft address`
1. Verify contracts in Etherscan: run `verify.bat` and give the `nft address` as parameter to it
1. Go to website code: `src/utils/index.tsx` and replace the Ropsten addresses in `GetAddress` function. You need to use the `OWN` for your token address and `PAIR` for your pair address
1. Run website - check its README for instructions
