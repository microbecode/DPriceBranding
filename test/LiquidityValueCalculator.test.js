//const { account, contract } = require('@openzeppelin/test-environment');

const { BN, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const { ZERO_ADDRESS } = constants;

const token1Artifact = artifacts.require('MyToken1Mock');
const token2Artifact = artifacts.require('MyToken2Mock');

const routerArtifact = artifacts.require("UniswapV2Router02");
const factoryArtifact = artifacts.require("UniswapV2Factory");

contract('aaa', accounts  => {
  const [ initialHolder, recipient, anotherAccount ] = accounts;

  const name = 'My Token';
  const symbol = 'MTKN';

  const initialSupply = 500;//new BN(100);

/*   beforeEach(async () => {
 

     
  }); */

  it('a', async () => {
/*    const acc2 = await web3.eth.getAccounts();
    console.log('someacc', acc2[0]); */
    console.log('account', accounts[0]);
   // console.log('aaaac', owner);
    this.token1 = await token1Artifact.new(initialSupply, name, symbol, {from: accounts[0] });
    this.token2 = await token2Artifact.new(initialSupply, name, symbol, {from: accounts[0] });
    
    this.router = await routerArtifact.deployed();
    const factory = await this.router.factory.call();
    this.factory = await factoryArtifact.at(factory);

     await this.factory.createPair(this.token1.address, this.token2.address);
    const pairAddr = await this.factory.allPairs.call(0); 
    
    console.log('pair', pairAddr);
    console.log('router', this.router.address);
    console.log('factory', this.factory.address);
    console.log('token1', this.token1.address);
    console.log('token2', this.token2.address);

   await this.token1.approve(this.router.address, 50, {from: accounts[0] });
    await this.token2.approve(this.router.address, 60, {from: accounts[0] });

    const supply = await this.token1.totalSupply.call();
    console.log('supply', supply.toString());

    const supply2 = await this.token2.totalSupply.call();
    console.log('supply2', supply.toString());

    const appr = await this.token2.allowance.call(accounts[0], this.router.address);
    console.log('aa', appr.toString());

    const appr1 = await this.token1.allowance.call(accounts[0], this.router.address);
    console.log('aa1', appr1.toString());

    await this.router.addLiquidity(this.token1.address, this.token2.address, 10, 20, 1, 2, accounts[1], 9999999999)
  }); 

});
