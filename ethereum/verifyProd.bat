REM This script is used to verify contracts. Parameter is the NFT address since otherwise it's not verified.
REM You get the NFT address when first running the migration

truffle run verify MyToken --network mainnet & truffle run verify MyCollectible@%1 --network mainnet