const { accounts, contract } = require('@openzeppelin/test-environment');

const { BN, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const { ZERO_ADDRESS } = constants;

/* const ERC20Mock = contract.fromArtifact('ERC20Mock');
const ERC20DecimalsMock = contract.fromArtifact('ERC20DecimalsMock'); */

const MyToken = contract.fromArtifact('MyToken');
const MyCollectible = contract.fromArtifact('MyCollectible');

describe('MyToken', async function () {
  const [ initialHolder, recipient, anotherAccount ] = accounts;

  const name = 'My Token';
  const symbol = 'MTKN';

  const zero = new BN('0');
  const one = new BN('1');
  const two = new BN('2');
  const ten = new BN('10');
  const eighteen = new BN('18');
  const oneToken = ten.pow(eighteen);

  const tokenAmount = (new BN('50')).mul(oneToken);

  beforeEach(async function () {
    this.token = await MyToken.new(tokenAmount, name, symbol, { from: initialHolder });
  });

  it('tx sender has all ERC20 tokens', async function () {
    expect(await this.token.balanceOf(initialHolder)).to.be.bignumber.equal(tokenAmount);
  });
 
  describe('NFT', async function () {
    beforeEach(async function () {
      const nftAddr = await this.token.nft();
      this.nft = await MyCollectible.at(nftAddr);
    });

    it('is set', async function ()  {
      expect(this.nft.length > 1);
    })

    it('can\' be minted by non-minter (only by the ERC20 contract)', async function ()  {
      await expectRevert(this.nft.mintCollectible(recipient, 5, { from: initialHolder }), 'Only minter can mint');
    })
  });

  describe('NFT from ERC20', async function () {
    beforeEach(async function () {
      const nftAddr = await this.token.nft();
      this.nft = await MyCollectible.at(nftAddr);
    });

    it('No NFT received for too small burn', async function ()  {
      await this.token.burn(new BN('1'), { from: initialHolder });
      expect(await this.nft.balanceOf(initialHolder)).to.be.bignumber.equal(zero);
    });

    it('No NFT received for too small burn ver2', async function ()  {
      const almostOne = oneToken.sub(new BN('1'));
      await this.token.burn(almostOne, { from: initialHolder });
      expect(await this.nft.balanceOf(initialHolder)).to.be.bignumber.equal(zero);
    });

    it('1 NFT for exactly 1 ERC20', async function ()  {
      await this.token.burn(oneToken, { from: initialHolder });
      expect(await this.nft.balanceOf(initialHolder)).to.be.bignumber.equal(one);
      expect(await this.nft.ownerOf(one)).to.be.bignumber.equal(initialHolder);
      expect(await this.nft.totalSupply()).to.be.bignumber.equal(one);
    });

    it('1 NFT for almost 2 ERC20', async function ()  {
      const almostTwo = oneToken.add(oneToken).sub(one);
      await this.token.burn(almostTwo, { from: initialHolder });
      expect(await this.nft.balanceOf(initialHolder)).to.be.bignumber.equal(one);
      expect(await this.nft.ownerOf(one)).to.be.bignumber.equal(initialHolder);
      expect(await this.nft.totalSupply()).to.be.bignumber.equal(one);
    }); 

    it('2 NFT for exactly 2 ERC20', async function ()  {
      const twoTokens = oneToken.mul(two);
      await this.token.burn(twoTokens, { from: initialHolder });
      expect(await this.nft.balanceOf(initialHolder)).to.be.bignumber.equal(two);
      expect(await this.nft.ownerOf(one)).to.be.equal(initialHolder);
      expect(await this.nft.ownerOf(two)).to.be.equal(initialHolder);
      expect(await this.nft.totalSupply()).to.be.bignumber.equal(two); 
    });

    it('2 NFT for a bit above 2 ERC20', async function ()  {
      const aBitAboveTwoTokens = oneToken.mul(two).add(one);
      await this.token.burn(aBitAboveTwoTokens, { from: initialHolder });
      expect(await this.nft.balanceOf(initialHolder)).to.be.bignumber.equal(two);
      expect(await this.nft.ownerOf(one)).to.be.equal(initialHolder);
      expect(await this.nft.ownerOf(two)).to.be.equal(initialHolder);
      expect(await this.nft.totalSupply()).to.be.bignumber.equal(two);
    });

    it('10 NFT for exactly 10 ERC20', async function ()  {
      const tenTokens = oneToken.mul(ten);
      await this.token.burn(tenTokens, { from: initialHolder });
      expect(await this.nft.balanceOf(initialHolder)).to.be.bignumber.equal(ten);
      expect(await this.nft.ownerOf(one)).to.be.equal(initialHolder);
      expect(await this.nft.ownerOf(two)).to.be.equal(initialHolder);
      expect(await this.nft.ownerOf(ten)).to.be.equal(initialHolder);
      expect(await this.nft.totalSupply()).to.be.bignumber.equal(ten); 
    });
  });
});
