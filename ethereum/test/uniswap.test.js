//const { account, contract } = require('@openzeppelin/test-environment');

const { BN, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
//const { expect } = require('chai');

/* 
const token1Artifact = artifacts.require('MyToken1Mock');
const token2Artifact = artifacts.require('MyToken2Mock');

const tokenAmount = new BN(1 * (10 ^ 18));
const ethAmount = new BN(1 * (10 ^ 15));

const routerArtifact = artifacts.require("IUniswapV2Router02");
//const factoryArtifact = artifacts.require("UniswapV2Factory");

contract('test uniswap', accounts  => {
  const [ initialHolder, recipient, anotherAccount ] = accounts;

  const name = 'My Token';
  const symbol = 'MTKN';

  //const initialSupply = 5000;//new BN(100);

  it('liquidity', async () => {
    console.log('account', accounts[0]);
   // console.log('aaaac', owner);
    this.token1 = await token1Artifact.new(tokenAmount, name, symbol, {from: accounts[0] });
    
    this.router = await routerArtifact.deployed();
    const factory = await this.router.factory.call();
    this.factory = await factoryArtifact.at(factory);
    //this.token2 = await token2Artifact.new(initialSupply, name, symbol, {from: accounts[0] });
  
    await this.token1.approve(this.router.address, tokenAmount, {from: accounts[0] });

    await this.router.addLiquidityETH(this.token1.address, tokenAmount, tokenAmount / 10, ethAmount / 10, accounts[0], 9999999999, {from: accounts[0], value: ethAmount} )
  
  }); 

}); */
