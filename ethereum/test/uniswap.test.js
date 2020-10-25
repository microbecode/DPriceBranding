//const { account, contract } = require('@openzeppelin/test-environment');

const { BN, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
//const { expect } = require('chai');


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
/*    const acc2 = await web3.eth.getAccounts();
    console.log('someacc', acc2[0]); */
    console.log('account', accounts[0]);
   // console.log('aaaac', owner);
    this.token1 = await token1Artifact.new(tokenAmount, name, symbol, {from: accounts[0] });
    
    this.router = await routerArtifact.deployed();
    const factory = await this.router.factory.call();
    this.factory = await factoryArtifact.at(factory);
    //this.token2 = await token2Artifact.new(initialSupply, name, symbol, {from: accounts[0] });
   /*  
    

    //this.token2 = await token2Artifact.new(initialSupply, name, symbol, {from: accounts[0] });
    const wethAddr = await this.router.WETH.call();
    console.log('weth add', wethAddr);
    this.weth = await token2Artifact.at(wethAddr);
    //console.log('weth', this.weth);
    await this.weth.approve(this.router.address, 600, {from: accounts[0] });

     await this.factory.createPair(this.token1.address, this.token2.address);
    const pairAddr = await this.factory.allPairs.call(0); 
    
    console.log('pair', pairAddr); 
    console.log('router', this.router.address);
    console.log('factory', this.factory.address);
    console.log('token1', this.token1.address);
    //console.log('token2', this.token2.address);

    await this.token1.approve(this.router.address, 500, {from: accounts[0] });
     await this.token2.approve(this.router.address, 60, {from: accounts[0] });

    await this.token1.approve(this.factory.address, 50, {from: accounts[0] });
    await this.token2.approve(this.factory.address, 60, {from: accounts[0] });

    await this.token1.approve(pairAddr, 50, {from: accounts[0] });
    await this.token2.approve(pairAddr, 60, {from: accounts[0] });

    await this.token1.transfer(pairAddr, 50, {from: accounts[0] });
    await this.token2.transfer(pairAddr, 60, {from: accounts[0] });

    await this.token1.transfer(this.factory.address, 50, {from: accounts[0] });
    await this.token2.transfer(this.factory.address, 60, {from: accounts[0] });

    await this.token1.transfer(this.router.address, 50, {from: accounts[0] });
    await this.token2.transfer(this.router.address, 60, {from: accounts[0] }); 

    console.log('supply', (await this.token1.totalSupply.call()).toString());
    console.log('supply2', (await this.token2.totalSupply.call()).toString());
    console.log('approval', (await this.token1.allowance.call(accounts[0], this.router.address)).toString());
    console.log('approval2', (await this.token2.allowance.call(accounts[0], this.router.address)).toString());
 */
await this.token1.approve(this.router.address, tokenAmount, {from: accounts[0] });
/*     const supply = await this.token1.totalSupply.call();
    console.log('supply', supply.toString());

    const supply2 = await this.token2.totalSupply.call();
    console.log('supply2', supply.toString());

    const appr = await this.token2.allowance.call(accounts[0], this.router.address);
    console.log('aa', appr.toString());

    const appr1 = await this.token1.allowance.call(accounts[0], this.router.address);
    console.log('aa1', appr1.toString()); */

    //await this.router.addLiquidity(this.token1.address, this.token2.address, 10, 10, 20, 30, accounts[0], 9999999999, {from: accounts[0] })
/*
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    */
    await this.router.addLiquidityETH(this.token1.address, tokenAmount, tokenAmount / 10, ethAmount / 10, accounts[0], 9999999999, {from: accounts[0], value: ethAmount} )
  }); 

});
