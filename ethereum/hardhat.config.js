/**
 * @type import('hardhat/config').HardhatUserConfig
 */

//require("@nomiclabs/hardhat-truffle5");
require("@nomiclabs/hardhat-ethers");
require('dotenv').config();

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
      url: process.env.PROVIDER_URL,
      chainId: 3,
      gas: 8000000,
      gasPrice: 5000000000, // 5gwei
      accounts: {
        mnemonic: process.env.MNEMONIC
      },
      loggingEnabled: true
    }
    /*
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
