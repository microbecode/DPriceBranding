/* var art = artifacts.require("MyToken");
module.exports = deployer => {
    deployer.deploy(art, 100, 'MyToken', 'MT');
}; */

/* const liq = artifacts.require('LiquidityValueCalculator');
const token1 = artifacts.require("MyToken1Mock");
const token2 = artifacts.require("MyToken2Mock");

module.exports = async function(_deployer, network, accounts) {
  _deployer.deploy(UniswapV2Factory, accounts[0], {from: accounts[0]}).then(function() {
    return _deployer.deploy(liq, UniswapV2Factory.address);
  });
  _deployer.deploy(token1, 100, 'MyToken1', 'MT1');
  _deployer.deploy(token2, 200, 'MyToken2', 'MT2');
}; */

module.exports = async function(_deployer, network, accounts) { };