/**
 * @type import('hardhat/config').HardhatUserConfig
 */

// import 'hardhat';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import '@openzeppelin/hardhat-upgrades';

import 'dotenv/config';

export default {
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
