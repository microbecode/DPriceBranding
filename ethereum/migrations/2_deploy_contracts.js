const BN = require('bn.js');

const routerArtifact = artifacts.require("UniswapV2Router02");
const token1Artifact = artifacts.require('MyToken');

const json = require('@uniswap/v2-core/build/UniswapV2Factory.json')
const contract = require('@truffle/contract');
const factoryArtifact = contract(json);

const ten = new BN('10');
const eighteen = new BN('18');
const powered = ten.pow(eighteen);
const tokenAmount = (new BN('50')).mul(powered);
const ethAmount = 1000;

module.exports = async function(_deployer, network, accounts) {
  let routerAddr = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
 // const factoryAddress = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';
  const wethAddress = '0xc778417E063141139Fce010982780140Aa0cD5Ab'; // different in mainnet?

   await _deployer.deploy(token1Artifact, tokenAmount, 'name', 'symbol', {from: accounts[0] });
  const token = await token1Artifact.deployed();

console.log('token ', token.address) 

  const router = await routerArtifact.at(routerAddr);
  await token.approve(router.address, tokenAmount, {from: accounts[0] });

  await router.addLiquidityETH(token.address, tokenAmount, 1, 1, token.address, 9999999999, 
    {from: accounts[0], value: ethAmount} ) 

  const factAddr = await router.factory();
  console.log('factAddr' , factAddr)

  factoryArtifact.setProvider(this.web3._provider);
  const factory = await factoryArtifact.at(factAddr);
  console.log('fact', factory.address)
  
  const pair = await factory.getPair(token.address, wethAddress)
  console.log('pair', pair)
};
