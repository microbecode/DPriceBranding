const { accounts, contract } = require('@openzeppelin/test-environment');

const { BN, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const { ZERO_ADDRESS } = constants;

const factory = contract.fromArtifact('UniswapV2Factory');
//const liq = contract.fromArtifact('LiquidityValueCalculator');
const token1Artifact = contract.fromArtifact('MyToken1Mock');
const token2Artifact = contract.fromArtifact('MyToken2Mock');

const routerArtifact = artifacts.require("UniswapV2Router02");
const factoryArtifact = artifacts.require("UniswapV2Factory");
//const factory = IUniswapV2Factory (liq.factory);

describe('aaa', function () {
  const [ initialHolder, recipient, anotherAccount ] = accounts;

  const name = 'My Token';
  const symbol = 'MTKN';

  const initialSupply = new BN(100);

  beforeEach(async function () {
    //this.token = await ERC20Mock.new(name, symbol, initialHolder, initialSupply);
/*      this.factory = await factory.new(accounts[0]);
     console.log('faq', this.factory);
    this.li = await liq.new(this.factory);  */
    this.token1 = await token1Artifact.new(initialSupply, name, symbol);
    this.token2 = await token2Artifact.new(initialSupply, name, symbol);

    this.router = await routerArtifact.deployed();
    //const facA = await factoryArtifact.deployed();
    //console.log('refa', facA.adddress);
    const factory = await this.router.factory.call();
    console.log('router', this.router.address);
    console.log('factory', factory);
    this.factory = await factoryArtifact.at(factory);
  });

 // console.log('aaa', liq);
  //console.log('yyyy', factory);

  it('a', async function () {
    await this.factory.createPair(this.token1.address, this.token2.address);
    const pairAddr = await this.factory.allPairs.call(0);
    console.log('pair', pairAddr);

    console.log( this.router.addLiquidity);

    await this.router.addLiquidity(this.token1.address, this.token2.address, 10, 20, 1, 2, accounts[1], 9999999999)

    //expect(await this.token.name()).to.equal(name);
    
  }); 

});
