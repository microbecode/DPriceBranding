# Hiddenklass store

This website is created with React + ethers.js.

# Local testing

## Install stuff
1. Install "netlify dev" from https://www.netlify.com/products/dev/
1. Install yarn
1. Install ganache-cli
1. Install truffle

## Setup services

1. Create a Netlify account
1. Create a FaunaDb account (can be linked to Netlify)
    1. Create a collection there called `addresses`
1. Use an Ethereum node (Alchemy)
1. Have an Ethereum wallet ready with Ropsten Eth

## Create environment settings

You need to create a file called `.env` in this folder with the following settings:

    REACT_APP_FAUNADB_SERVER_SECRET='FAUNA_SECRET'
    REACT_APP_PROVIDER_URL='https://eth-ropsten.alchemyapi.io/v2/YOUR_KEY'
    REACT_APP_ETHERSCAN_API_KEY_PRICE='YOUR_KEY'
    REACT_APP_ENVIRONMENT='dev'

## Run

1. Run `yarn` to install everything needed
1. Run the project with `netlify dev`

Check the ethereum folder's README for instructions on how to get your own version running properly