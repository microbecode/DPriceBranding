const { BN } = require('@openzeppelin/test-helpers');

/* const routerArtifact = artifacts.require("UniswapV2Router02");
const token1Artifact = artifacts.require('MyToken');

const tokenAmount = 10000000;
const ethAmount = 1000; */

module.exports = async () => {
/*   let routerAddr;
  if (network == 'ropsten') {
    routerAddr = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
  }
  if (network == 'goerli') {
    routerAddr = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
  }
  const token = await token1Artifact.new(tokenAmount, 'name', 'symbol', {from: accounts[0] });
  token1Artifact.setAsDeployed(token);

  const router = await routerArtifact.at(routerAddr);
  routerArtifact.setAsDeployed(router);
  
  await token.approve(router.address, tokenAmount, {from: accounts[0] });
  console.log('approved');

  await router.addLiquidityETH(token.address, tokenAmount, 1, 1, token.address, 9999999999, 
    {from: accounts[0], value: ethAmount} ) */
};

/* module.exports = async () => {
  const greeter = await Greeter.new();
  Greeter.setAsDeployed(greeter);
} */


/* module.exports = function(deployer) {
  deployer.deploy(Greeter);
}; */

/*const { BN } = require('@openzeppelin/test-helpers');

const routerArtifact = artifacts.require("UniswapV2Router02");
const token1Artifact = artifacts.require('MyToken');

const tokenAmount = 10000000;
const ethAmount = 1000;

module.exports = async function(_deployer, network, accounts) {
  let routerAddr;
  if (network == 'ropsten') {
    routerAddr = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
  }
  if (network == 'goerli') {
    routerAddr = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
  }
  const token = await token1Artifact.new(tokenAmount, 'name', 'symbol', {from: accounts[0] });

  const router = await routerArtifact.at(routerAddr);
  await token.approve(router.address, tokenAmount, {from: accounts[0] });
  console.log('approved');

  await router.addLiquidityETH(token.address, tokenAmount, 1, 1, token.address, 9999999999, 
    {from: accounts[0], value: ethAmount} )
};


*/