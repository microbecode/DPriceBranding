
const routerArtifact = artifacts.require("UniswapV2Router02");

const token1Artifact = artifacts.require('MyToken');

const name = 'My Token';
const symbol = 'MTKN';
const initialSupply = 20000000000;

const weth_ropsten = '0x0a180a76e4466bf68a7f86fb029bed3cccfaaac5';
const factory_ropsten = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';
const router_ropsten = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';


module.exports = async function(_deployer, network, accounts) {
  const token = await token1Artifact.new(initialSupply, name, symbol, {from: accounts[0] });

  const router = await routerArtifact.at(router_ropsten);
  await token.approve(router.address, initialSupply, {from: accounts[0] });

  await router.addLiquidityETH(token.address, 10000000000, 5000000000, 1000000000, accounts[0], 9999999999, {from: accounts[0], gas: 4000000,
    value: 1000000000} )
};
