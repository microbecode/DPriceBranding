/* var art = artifacts.require("MyToken");
module.exports = deployer => {
    deployer.deploy(art, 100, 'MyToken', 'MT');
}; */

//const liq = artifacts.require('LiquidityValueCalculator');

// Get this by running migrations in localtest
const factoryAddress = '0xc31344103eb8e5fe971aca9ea2f924e9924f9891';

const token1 = artifacts.require("MyToken1Mock");
const token2 = artifacts.require("MyToken2Mock");
const router = artifacts.require("UniswapV2Router02");
/* router.defaults({
  gasPrice: 0
}) */

const json = require('@uniswap/v2-core/build/UniswapV2Factory.json')
const contract = require('@truffle/contract');
const UniswapV2Factory = contract(json);

UniswapV2Factory.setProvider(this.web3._provider);

module.exports = async function(_deployer, network, accounts) {
  await _deployer.deploy(UniswapV2Factory, accounts[0], {from: accounts[0]});
  console.log('factory', UniswapV2Factory.address);
  await _deployer.deploy(router, UniswapV2Factory.address, accounts[0]);
  console.log('router', router.address);

};

//module.exports = async function(_deployer, network, accounts) {
/*   _deployer.deploy(UniswapV2Factory, accounts[0], {from: accounts[0]}).then(function() {
    return _deployer.deploy(router, UniswapV2Factory.address, accounts[0]);
  }); */

/*   _deployer.then(function() {
    // Create a new version of A
    return router.new('0x2C615860A799b5FEbE42ECF99fC5aeB66e487Fd3', accounts[1]);
  }).then(function(instance) {
    console.log('uuuu', instance.address);
    return instance;
  }) */

  //_deployer.deploy(router, factoryAddress, accounts[0]);
/*   _deployer.deploy(token1, 100, 'MyToken1', 'MT1');
  _deployer.deploy(token2, 200, 'MyToken2', 'MT2'); */
//}; 

//module.exports = async function(_deployer, network, accounts) { };