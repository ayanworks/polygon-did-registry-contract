const { ethers, upgrades } = require('hardhat')

async function main() {
  try {
    const PolygonDidRegistry =
      await ethers.getContractFactory('PolygonDidRegistry')

    // To deploy the initial upgradable smart contract

    // const contract = await upgrades.deployProxy(PolygonDidRegistry, {
    //   initializer: 'initialize',
    // })

    const existingContractAddress = '0x5edaC3E213F724224d68C943318AcF7b095c2B76';

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
