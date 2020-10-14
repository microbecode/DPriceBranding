/* var art = artifacts.require("MyToken");
module.exports = deployer => {
    deployer.deploy(art, 100, 'MyToken', 'MT');
}; */

const json = require('@uniswap/v2-core/build/UniswapV2Factory.json')
const contract = require('@truffle/contract');
const UniswapV2Factory = contract(json);

UniswapV2Factory.setProvider(this.web3._provider);

const liq = artifacts.require('LiquidityValueCalculator');
const token1 = artifacts.require("MyToken1Mock");
const token2 = artifacts.require("MyToken2Mock");

module.exports = async function(_deployer, network, accounts) {
  _deployer.deploy(UniswapV2Factory, accounts[0], {from: accounts[0]}).then(function() {
    return _deployer.deploy(liq, UniswapV2Factory.address);
  });
  _deployer.deploy(token1, 100, 'MyToken1', 'MT1');
  _deployer.deploy(token2, 200, 'MyToken2', 'MT2');
};