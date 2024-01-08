const { ethers, upgrades } = require('hardhat')

async function main() {
  try {
    const PolygonDidRegistry =
      await ethers.getContractFactory('PolygonDidRegistry')

    // To deploy the initial upgradable smart contract

    // const contract = await upgrades.deployProxy(PolygonDidRegistry, {
    //   initializer: 'initialize',
    // })

    const existingContractAddress = '0xF7dc016E5752e413f6C6188BaCAa8B5c30A4DFF2';

    const contract = await upgrades.upgradeProxy(existingContractAddress, PolygonDidRegistry, {
      unsafeAllowCustomTypes: true,
      initializer: 'initialize',
    });

    await contract.waitForDeployment()

    console.log('Contract address::', contract.target)
  } catch (error) {
    console.error('Error deploying contract:', error.message)
  }
}

main()
