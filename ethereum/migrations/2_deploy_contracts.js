const BN = require('bn.js');

const routerArtifact = artifacts.require("UniswapV2Router02");
const token1Artifact = artifacts.require('MyToken');

const json = require('@uniswap/v2-core/build/UniswapV2Factory.json')
const contract = require('@truffle/contract');
const factoryArtifact = contract(json);

const ten = new BN('10');
const eighteen = new BN('18');
const powered = ten.pow(eighteen);

// IMPORTANT PARAMETERS
// How many tokens to create and put into pool
const tokenAmount = (new BN('30')).mul(powered);
// How much Eth to put into pool
const ethAmount = (new BN('83')).mul(powered).div(new BN('100'));
const tokenName = 'HIDDENKLASST';
const tokenSymbol = 'HDKT';

module.exports = async function(_deployer, network, accounts) {
  let routerAddr = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';

  // Deploy ERC20 token contract - also deploys NFT contract
  await _deployer.deploy(token1Artifact, tokenAmount, tokenName, tokenSymbol, {from: accounts[0] });
  const token = await token1Artifact.deployed();
  const nft = await token.nft();

  if (network != 'development') {
    const router = await routerArtifact.at(routerAddr);

    // Add an allowance for the router to withdraw ERC20 tokens from me
    await token.approve(router.address, tokenAmount, {from: accounts[0] });

    // Adds liquidity to Uniswap (also creates the pair)
    await router.addLiquidityETH(token.address, tokenAmount, 1, 1, accounts[0], 9999999999, 
      {from: accounts[0], value: ethAmount} ) 

    const factAddr = await router.factory();
    const wethAddress = await router.WETH();

    factoryArtifact.setProvider(this.web3._provider);
    const factory = await factoryArtifact.at(factAddr);
    
    const pair = await factory.getPair(token.address, wethAddress)
    console.log('pair', pair);
  }

  console.log('token name', tokenName, "token address", token.address, "nft address", nft);
};
