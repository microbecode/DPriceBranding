const BN = require('bn.js');

const routerArtifact = artifacts.require("UniswapV2Router02");
const token1Artifact = artifacts.require('MyToken');

const json = require('@uniswap/v2-core/build/UniswapV2Factory.json')
const contract = require('@truffle/contract');
const factoryArtifact = contract(json);

const tempDivider = new BN('100'); // use less Eth so cheaper to buy

const ten = new BN('10');
const eighteen = new BN('18');
const powered = ten.pow(eighteen);
const tokenAmount = (new BN('50')).mul(powered);
const ethAmount = (new BN('4')).mul(powered).div(tempDivider);



module.exports = async function(_deployer, network, accounts) {
  let routerAddr = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';

const tokenName = 'tok' + new Date().toLocaleTimeString();
const tokenSymbol = 'toks' + new Date().toLocaleTimeString();

   await _deployer.deploy(token1Artifact, tokenAmount, tokenName, tokenSymbol, {from: accounts[0] });
  const token = await token1Artifact.deployed();
  const nft = await token.col();

  if (network != 'development') {
    const router = await routerArtifact.at(routerAddr);
    await token.approve(router.address, tokenAmount, {from: accounts[0] });

    await router.addLiquidityETH(token.address, tokenAmount, 1, 1, token.address, 9999999999, 
      {from: accounts[0], value: ethAmount} ) 

    const factAddr = await router.factory();
    //console.log('factAddr' , factAddr)

    const wethAddress = await router.WETH();
    //console.log('weth', wethAddress);

    factoryArtifact.setProvider(this.web3._provider);
    const factory = await factoryArtifact.at(factAddr);
    //console.log('fact', factory.address)
    
    const pair = await factory.getPair(token.address, wethAddress)
    console.log('pair', pair)
  }

  console.log('token name', tokenName, "token address", token.address, "nft address", nft.address)
};
