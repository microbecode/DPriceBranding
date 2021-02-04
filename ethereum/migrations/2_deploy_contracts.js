const BN = require('bn.js');

const routerArtifact = artifacts.require("UniswapV2Router02");
const token1Artifact = artifacts.require('MyToken');

const ten = new BN('10');
const eighteen = new BN('18');
const powered = ten.pow(eighteen);
const tokenAmount = (new BN('50')).mul(powered);
console.log(tokenAmount.toString())
const ethAmount = 1000;

module.exports = async function(_deployer, network, accounts) {
  let routerAddr = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';

  const token = await token1Artifact.new(tokenAmount, 'name', 'symbol', {from: accounts[0] });

  const router = await routerArtifact.at(routerAddr);
  await token.approve(router.address, tokenAmount, {from: accounts[0] });

  await router.addLiquidityETH(token.address, tokenAmount, 1, 1, token.address, 9999999999, 
    {from: accounts[0], value: ethAmount} )
};
