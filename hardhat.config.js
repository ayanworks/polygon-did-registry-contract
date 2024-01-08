/**
 * @type import('hardhat/config').HardhatUserConfig
 */

// import 'hardhat';
require('@nomiclabs/hardhat-ethers');
require('@nomiclabs/hardhat-waffle');
require('@openzeppelin/hardhat-upgrades');

require('dotenv/config');

module.exports = {
  solidity: {
    version: '0.8.16',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {},
    mumbai: {
      url: process.env.RPCURL, // Update with Mumbai Matic RPC URL
      accounts: [`0x${process.env.SIGNER}`],
    },
  },
};
