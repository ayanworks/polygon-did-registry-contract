const { ethers, upgrades } = require('hardhat');

async function main() {
  try {
    const PolygonDidRegistry = await ethers.getContractFactory('PolygonDidRegistry');

    // To deploy the initial upgradable smart contract
    // const contract = await upgrades.deployProxy(PolygonDidRegistry, {
    //   initializer: 'initialize',
    // });

    const existingContractAddress = '0xe5dbCDDe6933201eF735ae0Ca627C27c83F578AE';

    const contract = await upgrades.upgradeProxy(existingContractAddress, PolygonDidRegistry, {
      unsafeAllowCustomTypes: true,
      initializer: 'initialize',
    });

    await contract.waitForDeployment();
  } catch (error) {
    console.error('Error deploying contract:', error.message);
  }
}

main();
