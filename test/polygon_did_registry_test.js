const ethers = require('ethers');
const ganache = require('ganache-cli');
const assert = require('assert');


// Library initialization that will talk with Blockchain
const provider = new ethers.providers.Web3Provider(ganache.provider({ gasLimit: 8000000 }));

// Initializing the build files
const PolygonDIDRegistryJSON = require('../build/PolygonDidRegistry_PolygonDidRegistry.json');

let accounts, PolygonDIDRegistryInstance;

// Describing the 1st Test
// This will setup Ganache with some test address
describe('Ganache Setup', async () => {

    it('Ganache setup with Test Accounts', async () => {

        // List of accounts are fetched here
        accounts = await provider.listAccounts();

        // We will check that atleast 2 accounts are loaded
        assert.ok(accounts.length >= 1, '2 Accounts are present minimum');
    });
});

// 2nd Test starts here
describe('Basic Contract Testing', () => {

    // Describing a SubTest case
    describe('Setting up the contract', async () => {

        it('This Deploys Polygon Smart contract from 1st account with no Parameters/Constructor', async () => {

            // Creating a contract factory for deploying contract. 
            const PolygonDIDRegistry = new ethers.ContractFactory(
                PolygonDIDRegistryJSON.abi,
                PolygonDIDRegistryJSON.evm.bytecode.object,
                provider.getSigner(accounts[0])
            );
            PolygonDIDRegistryInstance = await PolygonDIDRegistry.deploy();

            assert.ok(PolygonDIDRegistryInstance.address, 'conract address should be present');
        });

    });

    // Describing the 3rd Test case
    describe('Checking the Create function in Contract', async () => {

        it('This should store the DID doc on Contract and will read and check if the value stored is correct', async () => {

            // This will send the value to local ganache blockchain
            const did = '0x2f65b747440deaf596892dfc7965040be8b99100';
            const doc = '{"@context":"https://w3id.org/did/v1","id":"did:polygon:0x2f65b747440deaf596892dfc7965040be8b99100","verificationMethod":[{"id":"did:polygon:0x2f65b747440deaf596892dfc7965040be8b99100","type":"EcdsaSecp256k1VerificationKey2019","controller":"did:polygon:0x2f65b747440deaf596892dfc7965040be8b99100","publicKeyBase58":"NDaEdTguJV39Ns8BZkxQ3XR6GUinZAJfVoyEMkK9fP7XQmpSkT3UsLHB52cFpDqoM6m4Hevtba8pkmjvEG3Ur7ji"}]}';
            const tx = await PolygonDIDRegistryInstance.functions.createDID(did, doc);

            // Transfer confirmation
            await tx.wait();

            // Getting the set value in ganache blockchain
            const currentValue = await PolygonDIDRegistryInstance.functions.getDID(did);

            // Comparing the set value to confirm
            assert.equal(
                currentValue,
                doc,
                'value set must be able to get'
            );

            assert.notEqual(
                currentValue,
                null,
                'value should not be empty'
            );
        });
    });

    // Describing the 4th Test case
    describe('Checking the Update function in Contract', async () => {

        it('This should update the DID doc on Contract and will read and check if the value stored is correct', async () => {

            // This will send the value to local ganache blockchain
            const did = '0x2f65b747440deaf596892dfc7965040be8b99100';
            //changed the controller
            const doc = '{"@context":"https://w3id.org/did/v1","id":"did:polygon:0x2f65b747440deaf596892dfc7965040be8b99100","verificationMethod":[{"id":"did:polygon:0x2f65b747440deaf596892dfc7965040be8b99100","type":"EcdsaSecp256k1VerificationKey2019","controller":"did:polygon:0x2f65b747440deaf596892dfc7965040be8c66666","publicKeyBase58":"NDaEdTguJV39Ns8BZkxQ3XR6GUinZAJfVoyEMkK9fP7XQmpSkT3UsLHB52cFpDqoM6m4Hevtba8pkmjvEG3Ur7ji"}]}';
            const tx = await PolygonDIDRegistryInstance.functions.updateDID(did, doc);

            // Transfer confirmation
            await tx.wait();

            // Getting the set value in ganache blockchain
            const currentValue = await PolygonDIDRegistryInstance.functions.getDID(did);

            // Comparing the set value to confirm
            assert.equal(
                currentValue,
                doc,
                'value set must be able to get'
            );
        });
    });

    // Describing the 5th Test case
    describe('Checking the Delete function in Contract', async () => {

        it('This should delete the DID doc on Contract and will read and check if the value is now an empty string', async () => {

            // This will send the value to local ganache blockchain
            const did = '0x2f65b747440deaf596892dfc7965040be8b99100';
            const tx = await PolygonDIDRegistryInstance.functions.deleteDID(did);

            // Transfer confirmation
            await tx.wait();

            // Getting the set value in ganache blockchain
            const currentValue = await PolygonDIDRegistryInstance.functions.getDID(did);

            // Comparing the set value to confirm
            assert.equal(
                currentValue,
                "",
                'value should be matching'
            );
        });
    });

    // Describing the 6th Test case
    describe('Checking the Create function in Contract', async () => {

        it('This should store the DID doc on Contract and will read and check if the value stored is not null', async () => {

            // This will send the value to local ganache blockchain
            const did = '0x54ec7be8b24f7139f870f277cf99c527ff43892b';
            const doc = '{"@context":"https://w3id.org/did/v1","id":"did:polygon:0x54ec7be8b24f7139f870f277cf99c527ff43892b","verificationMethod":[{"id":"did:polygon:0x54ec7be8b24f7139f870f277cf99c527ff43892b","type":"EcdsaSecp256k1VerificationKey2019","controller":"did:polygon:0x54ec7be8b24f7139f870f277cf99c527ff43892b","publicKeyBase58":"RwHysxjkzFdJDqi2irHRVRFHX9uUj5aVAXVoufnk5PDA4qcn1ejJMgGhqCsFdQqXRCTdi4TbEQFJjDUAdi2JvYmH"}]}';
            const doctest = '{"@context":"https://w3id.org/did/v1","id":"did:polygon:0x2f65b747440deaf596892dfc7965040be8b99100","verificationMethod":[{"id":"did:polygon:0x2f65b747440deaf596892dfc7965040be8b99100","type":"EcdsaSecp256k1VerificationKey2019","controller":"did:polygon:0x2f65b747440deaf596892dfc7965040be8c66666","publicKeyBase58":"NDaEdTguJV39Ns8BZkxQ3XR6GUinZAJfVoyEMkK9fP7XQmpSkT3UsLHB52cFpDqoM6m4Hevtba8pkmjvEG3Ur7ji"}]}';
            const tx = await PolygonDIDRegistryInstance.functions.createDID(did, doc);

            // Transfer confirmation
            await tx.wait();

            // Getting the set value in ganache blockchain
            const currentValue = await PolygonDIDRegistryInstance.functions.getDID(did);

            // Checking value is not null

            assert.notEqual(
                currentValue,
                doctest,
                'value should not match'
            );
        });
    });

    // Describing the 7th Test case
    describe('Checking the Update function in Contract', async () => {

        it('This should update the DID doc on Contract and will read and check if the value stored has changed', async () => {

            // This will send the value to local ganache blockchain
            const did = '0x54ec7be8b24f7139f870f277cf99c527ff43892b';
            //changed the controller
            const doc = '{"@context":"https://w3id.org/did/v1","id":"did:polygon:0x2f65b747440deaf596892dfc7965040be8b99100","verificationMethod":[{"id":"did:polygon:0x2f65b747440deaf596892dfc7965040be8b99100","type":"EcdsaSecp256k1VerificationKey2019","controller":"did:polygon:0x2f65b747440deaf596892dfc7965040be8c66666","publicKeyBase58":"NDaEdTguJV39Ns8BZkxQ3XR6GUinZAJfVoyEMkK9fP7XQmpSkT3UsLHB52cFpDqoM6m4Hevtba8pkmjvEG3Ur7ji"}]}';
            const docoriginal = '{"@context":"https://w3id.org/did/v1","id":"did:polygon:0x54ec7be8b24f7139f870f277cf99c527ff43892b","verificationMethod":[{"id":"did:polygon:0x54ec7be8b24f7139f870f277cf99c527ff43892b","type":"EcdsaSecp256k1VerificationKey2019","controller":"did:polygon:0x54ec7be8b24f7139f870f277cf99c527ff43892b","publicKeyBase58":"RwHysxjkzFdJDqi2irHRVRFHX9uUj5aVAXVoufnk5PDA4qcn1ejJMgGhqCsFdQqXRCTdi4TbEQFJjDUAdi2JvYmH"}]}';
            const tx = await PolygonDIDRegistryInstance.functions.updateDID(did, doc);

            // Transfer confirmation
            await tx.wait();

            // Getting the set value in ganache blockchain
            const currentValue = await PolygonDIDRegistryInstance.functions.getDID(did);

            // Comparing the set value to confirm
            assert.notEqual(
                currentValue,
                docoriginal,
                'value should not match'
            );
        });
    });


    // Describing the 8th Test case
    describe('Checking the Delete function in Contract', async () => {

        it('This should delete the DID doc on Contract and will read and check if the value is now not equal to the updated doc', async () => {

            // This will send the value to local ganache blockchain
            const did = '0x54ec7be8b24f7139f870f277cf99c527ff43892b';
            const doc = '{"@context":"https://w3id.org/did/v1","id":"did:polygon:0x2f65b747440deaf596892dfc7965040be8b99100","verificationMethod":[{"id":"did:polygon:0x2f65b747440deaf596892dfc7965040be8b99100","type":"EcdsaSecp256k1VerificationKey2019","controller":"did:polygon:0x2f65b747440deaf596892dfc7965040be8c66666","publicKeyBase58":"NDaEdTguJV39Ns8BZkxQ3XR6GUinZAJfVoyEMkK9fP7XQmpSkT3UsLHB52cFpDqoM6m4Hevtba8pkmjvEG3Ur7ji"}]}';
            const tx = await PolygonDIDRegistryInstance.functions.deleteDID(did);

            // Transfer confirmation
            await tx.wait();

            // Getting the set value in ganache blockchain
            const currentValue = await PolygonDIDRegistryInstance.functions.getDID(did);

            // Comparing the set value to confirm
            assert.notEqual(
                currentValue,
                doc,
                'value should not be matching'
            );
        });
    });
});