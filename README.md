# Polygon- Identity

This library is an implementation of a registry contract that supports the Polygon DID Method.

## Overview

The Polygon registry contract acts as a public ledger, where the Polygon-Identity specified Decentralised Identifiers will be logged. The specifications related to polygon DID method are mentioned in the      document. A DID generated using the Polygon DID generator, can be stored and managed on the ledger using this contract library.

## Methods

* createDID(address, string) : The method createDID is used to create and log a new DID on the polygon chain. The parameter of address type, will act as the reference key, to refer  the did document stored on the chain. The string type variable will contain the did document, that will be stored on the matic chain.

* updateDID(address, string) : The method updateDID is included in contract, which will facilitate the controller, and only the controller of the did, to update the document if need arises. Though the Polygon DID method, defines how the DID doc is defined as per standards, and that can be resolved.  

* deleteDID(address) : The method deleteDID is included in the  contract, that only the controller of DID can access, to delete a particular DID from ledge.

* getDID(address) : The method getDID helps, the DID controller to resolve the DID document.

## Example ethers code

Using ethers, the following illustrates how one can interact with PolygonRegistry contract, from client side application.

## Loading the Contract

## Creating a DID

## Updating a DID

## Delete a DID

## Resolving a DID 


# Deploying the Contract on Matic network

Pre-requisites

* NodeJS 
* Truffle
* Ganache
* A wallet connected to polygon network, with Matic token in it. One can receive the Matic Test Tokens from their faucet.
 
## Deployment

Clone the above repository

Run a ganache using 

Update your mnemonic in truffle-config.js

On a new console window run

