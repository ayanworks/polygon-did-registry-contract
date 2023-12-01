const { deployProxy } = require('@openzeppelin/truffle-upgrades')

const PolygonDidRegistry = artifacts.require('PolygonDidRegistry')

module.exports = async function (deployer) {
  const instance = await deployProxy(PolygonDidRegistry, { deployer })
  console.log('Deployed', instance.address)
}
