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


## Run tests locally
1. Install packages: `yarn`
1. Start local blockchain: `ganache-cli`
1. Run unit tests: `truffle test`

## Run stuff with Ropsten
1. Install packages: `yarn`
1. Compile: `truffle compile`
1. Go to folder `contracts/mocks` and remove file `UniswapV2Router02Mock.sol`. See notes below for reasons why.
1. Compile: `truffle compile`
1. Deploy to Ropsten: `truffle migrate --network Ropsten`
1. Note the given `pair address`, `token address` and `nft address`
1. Verify contracts in Etherscan: run `verify.bat` and give the `nft address` as parameter to it. Or if you're not using Windows, just check the file contens and run the commands by hand
1. Go to website code: `src/utils/index.tsx` and replace the Ropsten addresses in `GetAddress` function. You need to use the `OWN` for your token address and `PAIR` for your pair address
1. Run website - check its README for instructions

### Issues with UniswapV2Router02Mock

The reason why we have that file in the project is to get the uniswap router artifacts in our project when the contracts are compiled. But, at the same time, when trying to migrate the project with that file, truffle will complain about conflicting contracts (IERC20 and SafeMath), since Uniswap uses its own versions of those files.

If you don't do this small trickery, you may face problems in verifying your contracts in Etherscan.
