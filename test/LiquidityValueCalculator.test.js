const { accounts, contract } = require('@openzeppelin/test-environment');

const { BN, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const { ZERO_ADDRESS } = constants;

const factory = contract.fromArtifact('UniswapV2FactoryMock');
const liq = contract.fromArtifact('LiquidityValueCalculator');
const token1Artifact = contract.fromArtifact('MyToken1Mock');
const token2Artifact = contract.fromArtifact('MyToken2Mock');
//const factory = IUniswapV2Factory (liq.factory);

describe('aaa', function () {
  const [ initialHolder, recipient, anotherAccount ] = accounts;

  const name = 'My Token';
  const symbol = 'MTKN';

  const initialSupply = new BN(100);

  beforeEach(async function () {
    this.token1 = await token1Artifact.new(initialSupply, name, symbol);
    this.token2 = await token2Artifact.new(initialSupply, name, symbol);
    //console.log(this.token1.address);
    this.factory = await factory.new(accounts[0]);
    this.pairAddress = await this.factory.createPair(this.token1.address, this.token2.address, { from: accounts[0] });
     const pairAddress = await this.factory.allPairs(0);

  });

   it('a', async function () {

   /*  console.log('a', await this.pairAddress); */


    //const hmm = await liq.deployed();
    //console.log('bbbb', hmm);
    //expect(await this.token.name()).to.equal(name);
    
  }); 
/*   it('b', async function () {
    console.log('b', await this.pairAddress());
  }); 
  it('c', async function () {
    console.log('c', this.pairAddress());
  });
  it('d', async function () {
    console.log('d', this.pairAddress);
  });  */ 
});
