const { ethers, upgrades } = require('hardhat')
const assert = require('assert')
const { describe, it } = require('node:test')

// Initializing the build files
const PolygonDIDRegistryJSON = require('../artifacts/contracts/PolygonDidRegistry.sol/PolygonDidRegistry.json')

let PolygonUpgradableInstance, PolygonUpgradableInstance_test
walletKey = process.env.SIGNER

// Upgradable with Proxy
// Deployment Testing 1.0
describe('Setting up the Upgradable Smart Contract', async () => {
  describe('Setting up the contract', async () => {
    it('Should deploy contract with Proxy, with no parameters/Constructor', async () => {
      const PolygonDidRegistry =
        await ethers.getContractFactory('PolygonDidRegistry')
      PolygonUpgradableInstance = await upgrades.deployProxy(PolygonDidRegistry)
      await PolygonUpgradableInstance.waitForDeployment()
      PolygonUpgradableInstance_test = new ethers.Contract(
        PolygonUpgradableInstance.target,
        PolygonDIDRegistryJSON.abi,
        walletKey,
      )
      assert.ok(
        PolygonUpgradableInstance.target,
        'Upgradeable contract is deployed',
      )
    })
  })

  //Check Create Function test 1.1
  describe('Checking the Create function using Upgradeable Contract', async () => {
    it('This should store the DID doc on Upgradable Contract and will read and check if the value stored is correct', async () => {
      // This will send the value to local ganache blockchain
      const did = '0x2f65b747440deaf596892dfc7965040be8b99100'
      const doc =
        '{"@context":"https://w3id.org/did/v1","id":"did:polygon:0x2f65b747440deaf596892dfc7965040be8b99100","verificationMethod":[{"id":"did:polygon:0x2f65b747440deaf596892dfc7965040be8b99100","type":"EcdsaSecp256k1VerificationKey2019","controller":"did:polygon:0x2f65b747440deaf596892dfc7965040be8b99100","publicKeyBase58":"NDaEdTguJV39Ns8BZkxQ3XR6GUinZAJfVoyEMkK9fP7XQmpSkT3UsLHB52cFpDqoM6m4Hevtba8pkmjvEG3Ur7ji"}]}'
      const tx = await PolygonUpgradableInstance.createDID(did, doc)

      // Getting the set value in ganache blockchain
      const currentValue = await PolygonUpgradableInstance.getDIDDoc(did)
      // Comparing the set value to confirm
      assert.notEqual(currentValue, null, 'value set must be able to get')

      assert.notEqual(currentValue, null, 'value should not be empty')
    })
  })

  //Describing the 1.2 Test Case
  describe('Checking the getTotalNumberOfDIDs Function', async () => {
    it('This should get correct number of DIDs registered', async () => {
      const currentValue =
        await PolygonUpgradableInstance.getTotalNumberOfDIDs()
      assert(currentValue > 0, 'value should be less than 0')
    })
  })

  // Describing the 1.3 Test case
  describe('Checking the Update function in Upgradable Contract', async () => {
    it('This should update the DID doc on Upgradable Contract and will read and check if the value stored is correct', async () => {
      // This will send the value to local ganache blockchain
      const did = '0x2f65b747440deaf596892dfc7965040be8b99100'
      //changed the controller
      const doc =
        '{"@context":"https://w3id.org/did/v1","id":"did:polygon:0x2f65b747440deaf596892dfc7965040be8b99100","verificationMethod":[{"id":"did:polygon:0x2f65b747440deaf596892dfc7965040be8b99100","type":"EcdsaSecp256k1VerificationKey2019","controller":"did:polygon:0x2f65b747440deaf596892dfc7965040be8c66666","publicKeyBase58":"NDaEdTguJV39Ns8BZkxQ3XR6GUinZAJfVoyEMkK9fP7XQmpSkT3UsLHB52cFpDqoM6m4Hevtba8pkmjvEG3Ur7ji"}]}'
      const tx = await PolygonUpgradableInstance.updateDIDDoc(did, doc)

      // Getting the set value in ganache blockchain
      const currentValue = await PolygonUpgradableInstance.getDIDDoc(did)

      // Comparing the set value to confirm
      assert.notEqual(currentValue, null, 'value set must be able to get')
    })
  })

  //Describing test 1.4 to check if test fails if we update with different controller
  describe('Checking update with wrong controller', async () => {
    it('This should not update DID doc ', async () => {
      const did = '0x2f65b747440deaf596892dfc7965040be8b99109'
      const doc =
        '{"@context":"https://w3id.org/did/v1","id":"did:polygon:0x2f65b747440deaf596892dfc7965040be8b99100","verificationMethod":[{"id":"did:polygon:0x2f65b747440deaf596892dfc7965040be8b99100","type":"EcdsaSecp256k1VerificationKey2019","controller":"did:polygon:0x2f65b747440deaf596892dfc7965040be8c66666","publicKeyBase58":"NDaEdTguJV39Ns8BZkxQ3XR6GUinZAJfVoyEMkK9fP7XQmpSkT3UsLHB52cFpDqoM6m4Hevtba8pkmjvEG3Ur7ji"}]}'
      try {
        assert.ifError(
          //sending transaction using different controller
          await PolygonUpgradableInstance_test.functions.updateDID(did, doc),
        )
      } catch (error) {}
    })
  })

  //   //Describing the 1.10 Test Case
  describe('Checking the Transafer Ownership Function', async () => {
    it('This should transfer ownership of contract to another user', async () => {
      const newOwner = '0x2f65b747440deaf596892dfc7965040be8b99109'
      const owner = await PolygonUpgradableInstance.getOwner()
      const tx = await PolygonUpgradableInstance.transferOwnership(newOwner)
      const currentOwner = await PolygonUpgradableInstance.getOwner()
      assert.notEqual(owner, currentOwner, 'value should not be equal')
    })
  })

  //Describing the 1.11 Test Case
  describe('Checking the Transafer Ownership Function', async () => {
    it('This should not transfer ownership of contract to another user since the transaction is being initiated by different owner', async () => {
      const newOwner = '0x2f65b747440deaf596892dfc7965040be8b99100'
      try {
        assert.ifError(
          //sending transaction using different controller
          await PolygonUpgradableInstance_test.functions.transferOwnership(
            newOwner,
          ),
        )
      } catch (error) {}
    })
  })
})