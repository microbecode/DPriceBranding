/**
 * @type import('hardhat/config').HardhatUserConfig
 */

//require("@nomiclabs/hardhat-truffle5");
require("@nomiclabs/hardhat-ethers");

const fs = require('fs');
const FsWalletProvider = require("@truffle/hdwallet-provider");
//const PrivkeyWalletProvider = require("truffle-hdwallet-provider-privkey");
const mnemonic = fs.readFileSync('..\\..\\mnemonic.env', 'utf-8');
const ropstenId = fs.readFileSync('..\\..\\ropsten_infura_dpricebranding_projectid.env', 'utf-8');
const goerliId = fs.readFileSync('..\\..\\goerli_infura_dpricebranding_projectid.env', 'utf-8');

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.6.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        } 
      },
      {
        version: "0.5.16",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        } 
      }
    ]
  },
  networks: {
    hardhat: {
      gas: 9007199254740990,
      blockGasLimit: 9007199254740990,
      gasPrice: 0,
      allowUnlimitedContractSize: true,
      loggingEnabled: true
    },
    ropsten: {
      url: "https://ropsten.infura.io/v3/" + ropstenId,
      chainId: 3,
      gas: 8000000,
      gasPrice: 5000000000, // 5gwei
      accounts: {
        mnemonic: mnemonic
      },
      loggingEnabled: true
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
