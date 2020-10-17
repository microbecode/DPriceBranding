# DpriceBranding
Smart contracts for DpriceBranding project (Ethereum NFTs)

# Local testing

## Run ganache
ganache-cli --gasLimit=9007199254740990 --gasPrice=0 --allowUnlimitedContractSize --account "0x0000000000000000000000000000000000000000000000000000000000000001,9000000000000000000000" --account "0x0000000000000000000000000000000000000000000000000000000000000002,9000000000000000000000"

## Run test
truffle test test/LiquidityValueCalculator.test.js
