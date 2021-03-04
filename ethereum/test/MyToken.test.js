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

  const ten = new BN('10');
const eighteen = new BN('18');
const powered = ten.pow(eighteen);
const tokenAmount = (new BN('50')).mul(powered);
  //const initialSupply = new BN(100);

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

    it('can be minted by minter', async function () {
      const one = new BN(1);
      await this.nft.mintCollectible(recipient, 5, { from: initialHolder });
      expect(this.nft.balanceOf(recipient).to.be.bignumber.equal(one));
    })

    it('can\' be minted by non-minter', async function ()  {
      const zero = new BN(0);
      await this.nft.mintCollectible(recipient, 5, { from: recipient });
      expect(this.nft.balanceOf(recipient).to.be.bignumber.equal(zero));
    })
  });

  /* describe('_setupDecimals', function () {
    const decimals = new BN(6);

    it('can set decimals during construction', async function () {
      const token = await ERC20DecimalsMock.new(name, symbol, decimals);
      expect(await token.decimals()).to.be.bignumber.equal(decimals);
    });
  });

  shouldBehaveLikeERC20('ERC20', initialSupply, initialHolder, recipient, anotherAccount);

  describe('decrease allowance', function () {
    describe('when the spender is not the zero address', function () {
      const spender = recipient;

      function shouldDecreaseApproval (amount) {
        describe('when there was no approved amount before', function () {
          it('reverts', async function () {
            await expectRevert(this.token.decreaseAllowance(
              spender, amount, { from: initialHolder }), 'ERC20: decreased allowance below zero',
            );
          });
        });

        describe('when the spender had an approved amount', function () {
          const approvedAmount = amount;

          beforeEach(async function () {
            ({ logs: this.logs } = await this.token.approve(spender, approvedAmount, { from: initialHolder }));
          });

          it('emits an approval event', async function () {
            const { logs } = await this.token.decreaseAllowance(spender, approvedAmount, { from: initialHolder });

            expectEvent.inLogs(logs, 'Approval', {
              owner: initialHolder,
              spender: spender,
              value: new BN(0),
            });
          });

          it('decreases the spender allowance subtracting the requested amount', async function () {
            await this.token.decreaseAllowance(spender, approvedAmount.subn(1), { from: initialHolder });

            expect(await this.token.allowance(initialHolder, spender)).to.be.bignumber.equal('1');
          });

          it('sets the allowance to zero when all allowance is removed', async function () {
            await this.token.decreaseAllowance(spender, approvedAmount, { from: initialHolder });
            expect(await this.token.allowance(initialHolder, spender)).to.be.bignumber.equal('0');
          });

          it('reverts when more than the full allowance is removed', async function () {
            await expectRevert(
              this.token.decreaseAllowance(spender, approvedAmount.addn(1), { from: initialHolder }),
              'ERC20: decreased allowance below zero',
            );
          });
        });
      }

      describe('when the sender has enough balance', function () {
        const amount = initialSupply;

        shouldDecreaseApproval(amount);
      });

      describe('when the sender does not have enough balance', function () {
        const amount = initialSupply.addn(1);

        shouldDecreaseApproval(amount);
      });
    });

    describe('when the spender is the zero address', function () {
      const amount = initialSupply;
      const spender = ZERO_ADDRESS;

      it('reverts', async function () {
        await expectRevert(this.token.decreaseAllowance(
          spender, amount, { from: initialHolder }), 'ERC20: decreased allowance below zero',
        );
      });
    }); 
  });*/

  
});
