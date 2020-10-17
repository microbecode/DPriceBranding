const router = artifacts.require("UniswapV2Router02");

const json = require('@uniswap/v2-core/build/UniswapV2Factory.json')
const contract = require('@truffle/contract');
const UniswapV2Factory = contract(json);

UniswapV2Factory.setProvider(this.web3._provider);

module.exports = async function(_deployer, network, accounts) {
  await _deployer.deploy(UniswapV2Factory, accounts[0], {from: accounts[0]});
  //console.log('factory', UniswapV2Factory.address);
  await _deployer.deploy(router, UniswapV2Factory.address, accounts[0]);
  //console.log('router', router.address);

};
