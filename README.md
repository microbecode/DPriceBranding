# DPriceBranding

This project is a modified version of Unisocks (https://unisocks.exchange/) with the following functionality:
- An ERC20 token is created
- An ERC-721 (NFT) token contract is created
- All of the ERC20 tokens are placed in a Uniswap pool, along with some Ethers
- If you buy one full (10**18) ERC20 token, you can redeem it. Redeeming it burns the token, mints you a unique NFT token and you get a physical HIDDENKLASS (https://www.instagram.com/hiddenklass_official) T-shirt mailed to you.

The repository is divided in two parts: website and ethereum folders. The website folder contains everything needed for running the actual website (https://hiddenklass.store/). The ethereum folder contains the Ethereum smart contracts which are used in the background, plus their corresponding unit tests. Both have a README, so have a look at those.

## Differences compared to Unisocks

- No sell functionality is included. You can go directly to the pool to do that
- Only Ether purchases are supported, so you can't buy these tokens with other tokens
- No order tracking
- Less wallet types supported
- Upgraded Uniswap support to use V2 instead of V1
- Upgraded the codebase to use TypeScript. Rewritten part of the codebase to utilize TypeScript
- Various styling and other non-essential changes
- And, of course, different physical product

USE AT YOUR OWN RISK. No support is guaranteed, but it can be requested at Telegram @Lauri_P