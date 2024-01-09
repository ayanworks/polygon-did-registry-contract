const { ethers, upgrades } = require('hardhat')

async function main() {
  try {
    console.log('Deploying the smart contract...')
    const PolygonDidRegistry =
      await ethers.getContractFactory('PolygonDidRegistry')

    // To deploy the initial upgradable smart contract

    // const contract = await upgrades.deployProxy(PolygonDidRegistry, {
    //   initializer: 'initialize',
    // })

    const contract = await upgrades.upgradeProxy(
      process.env.CONTRACT_ADDRESS,
      PolygonDidRegistry,
      {
        initializer: 'initialize',
      },
    )

    await contract.waitForDeployment()

    console.log('Contract address::', contract.target)
  } catch (error) {
    console.error('Error deploying contract:', error.message)
  }
}

main()
