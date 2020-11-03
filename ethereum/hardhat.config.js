/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require("@nomiclabs/hardhat-truffle5");

const fs = require('fs');
const FsWalletProvider = require("@truffle/hdwallet-provider");
//const PrivkeyWalletProvider = require("truffle-hdwallet-provider-privkey");
const mnemonic = fs.readFileSync('..\\..\\mnemonic.env', 'utf-8');
const ropstenId = fs.readFileSync('..\\..\\ropsten_infura_dpricebranding_projectid.env', 'utf-8');
const goerliId = fs.readFileSync('..\\..\\goerli_infura_dpricebranding_projectid.env', 'utf-8');

module.exports = {
  solidity: "0.6.6",
  networks: {
    hardhat: {

    },
    ropsten: {
      url: "https://ropsten.infura.io/v3/" + ropstenId,
      chainId: 3,
      gas: 8000000,
      gasPrice: 5000000000, // 5gwei
      accounts: {
        mnemonic: mnemonic
      }
    }
    /*
    ropsten: {
      network_id: 3,
      gasPrice: 5000000000, // 5gwei
      gas: 8000000,
      provider: function() {
        return new FsWalletProvider(mnemonic, "https://ropsten.infura.io/v3/" + ropstenId);
      }
    },
    goerli: {
      network_id: 5,
      gasPrice: 5000000000, // 5gwei
      gas: 8000000,
      provider: function() {
        return new FsWalletProvider(mnemonic, "https://goerli.infura.io/v3/" + goerliId);
      }
    }
    */
  }
};
