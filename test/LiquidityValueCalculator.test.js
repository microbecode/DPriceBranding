const { accounts, contract } = require('@openzeppelin/test-environment');

const { BN, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const { ZERO_ADDRESS } = constants;

const factory = contract.fromArtifact('UniswapV2FactoryMock');
const liq = contract.fromArtifact('LiquidityValueCalculator');
const token1 = contract.fromArtifact('MyToken1Mock');
const token2 = contract.fromArtifact('MyToken2Mock');
//const factory = IUniswapV2Factory (liq.factory);

describe('aaa', function () {
  const [ initialHolder, recipient, anotherAccount ] = accounts;

  const name = 'My Token';
  const symbol = 'MTKN';

  const initialSupply = new BN(100);

  beforeEach(async function () {
    //this.token = await ERC20Mock.new(name, symbol, initialHolder, initialSupply);
     this.factory = await factory.new(accounts[0]);
     console.log('faq', this.factory);
    this.li = await liq.new(this.factory); 
  });

 // console.log('aaa', liq);
  //console.log('yyyy', factory);

   it('has a name', async function () {
    const hmm = await liq.deployed();
    console.log('bbbb', hmm);
    //expect(await this.token.name()).to.equal(name);
    
  }); 

});
