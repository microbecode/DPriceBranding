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
    PROVIDER_URL_PROD='https://eth-mainnet.alchemyapi.io/v2/YOURPRODKEY'
    PRIVATE_KEY='YOUR_WALLET_PRIVATE_KEY'
    PRIVATE_KEY_PROD='YOUR_WALLET_PRIVATE_KEY_FOR_PROD'
    ETHERSCAN_API_KEY='ETHERSCAN_API_KEY'


## Run stuff only locally (without Uniswap). Only recommended if you know what you're doing
Start local blockchain: `ganache-cli`
Run unit tests: `truffle test`

## Run stuff locally with Ropsten (full functionality)
1. Run `yarn` to install everything needed
1. Compile: `truffle compile`
1. Deploy to Ropsten: `truffle migrate --network ropsten --reset`
1. Note the given `pair address`, `token address` and `nft address`
1. Verify contracts in Etherscan: run `verifyRopsten.bat` and give the `nft address` as parameter to it. Or if you're not using Windows, just check the file contens and run the commands by hand
1. Go to website code: `src/utils/index.tsx` and replace the Ropsten addresses in `GetAddress` function. You need to use the `OWN` for your token address and `PAIR` for your pair address
1. Run website - check its README for instructions

# Production deployment

After you have tested everything in a testnet (Ropsten), you can deploy to mainnet. There are two ways to do it: either all-in-one with a full script, or a minimal deployment.

## All-in-one

Deploys all needed contracts and executes needed transactions to get:

- An ERC20 token contract
- An NFT contract
- A pool created in Uniswap for these two
- All ERC20 and some Ethers added as liquidity to the pool

The good part about this option is that it does everything you need in one script. The bad part is that you have to set gas price high enough, so that the transactions succeed within a reasonable time, since each phase of the script waits for the previous transaction to get processed. "Reasonable time" depends on things, but might be a few minutes.

To execute this, first make sure that:

- The variable `minimalDeploy` in file `migrations/2_deploy_contract.js` is set to `false`. Remember to save the file
- The gas price is set correctly in `truffle-config.js` for mainnet
- The variable `PRIVATE_KEY_PROD` is set in `.env` file
- The variable `PROVIDER_URL_PROD` is set in `.env` file
- The variable `ETHERSCAN_API_KEY` is set in `.env` file (same value for all environments)

Then execute: `truffle migrate --network mainnet --reset`

1. Note the given `pair address`, `token address` and `nft address`
1. Verify contracts in Etherscan: run `verifyProd.bat` and give the `nft address` as parameter to it. Or if you're not using Windows, just check the file contens and run the commands by hand
1. Go to website code: `src/utils/index.tsx` and replace the Mainnet addresses in `GetAddress` function. You need to use the `OWN` for your token address and `PAIR` for your pair address
1. Run website - check its README for instructions

## Minimal deployment

Deploys only the ERC20 token contract, with the accompanying NFT contract. Uniswap-related procedures need to be done manually after that: after the ERC20 is deployed, go create the pool manually in Uniswap and add liquidity to it.

To execute this, first make sure that:

- The variable `minimalDeploy` in file `migrations/2_deploy_contract.js` is set to `true`. Remember to save the file
- The gas price is set correctly in `truffle-config.js` for mainnet
- The variable `PRIVATE_KEY_PROD` is set in `.env` file
- The variable `PROVIDER_URL_PROD` is set in `.env` file
- The variable `ETHERSCAN_API_KEY` is set in `.env` file (same value for all environments)

Then execute: `truffle migrate --network mainnet --reset`

1. Note the given `pair address`, `token address` and `nft address`
1. Verify contracts in Etherscan: run `verifyProd.bat` and give the `nft address` as parameter to it. Or if you're not using Windows, just check the file contens and run the commands by hand
1. Go to website code: `src/utils/index.tsx` and replace the Mainnet addresses in `GetAddress` function. You need to use the `OWN` for your token address and `PAIR` for your pair address
1. Run website - check its README for instructions