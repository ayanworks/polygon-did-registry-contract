# Polygon DID Registry Contract

This library is an implementation of a registry contract that supports the Polygon DID Method.

## Overview

The Polygon registry contract acts as a public ledger, where the Polygon-Identity specified Decentralised Identifiers will be logged. The specifications related to polygon DID method are mentioned in the document. A DID generated using the Polygon DID generator, can be stored and managed on the ledger using this contract library.

## Contract Deployment

|        Network         | ChainId |              Registry Address              |
| :--------------------: | :-----: | :----------------------------------------: |
|    Polygon Mainnet     |   137   | 0x0C16958c4246271622201101C83B9F0Fc7180d15 |
| Polygon Testnet (amoy) |  80002  | 0xcB80F37eDD2bE3570c6C9D5B0888614E04E1e49E |

## Methods

- `createDID(address, string)` : The method createDID is used to create and log a new DID on the polygon chain. The parameter of address type, will act as the reference key, to refer the did document stored on the chain. The string type variable will contain the did document, that will be stored on the matic chain.

- `updateDIDDoc(address, string)` : The method updateDID is included in contract, which will facilitate the controller, and only the controller of the did, to update the document if need arises. Though the Polygon DID method, defines how the DID doc is defined as per standards, and that can be resolved.

- `getDIDDoc(address)` : The method getDID helps to resolve the DID document.

- `transferOwnership(address)` : The method transferOwnership, helps in transferring the ownership of contract to a new owner. Only the current owner can access this function.

- `getOwner()` : the method getOwner helps one to fetch the current owner of the contract.

- `addResource(address, string, string)` : The addResource method allows the controller of a DID to add a linked resource to the DID document. This method ensures that only authorized controllers can add resources by requiring the caller to be the controller of the DID.

- `getResource(address, string)` : The getResource method fetches a specific linked resource from the blockchain that is associated with a given DID document.

- `getAllResources(address)` : The getAllResources method retrieves all resources linked to a specific DID document. This provides a comprehensive list of all resources associated with a given DID.

## Example ethers code

Using ethers, the following illustrates how one can interact with PolygonRegistry contract, from client side application.

## Loading the Contract

```
const ethers = require('ethers');
const url = https://rpc-amoy.polygon.technology; // For amoy testnet
const DID_ADDRESS = `<Contract Address>`;
const provider = new ethers.providers.JsonRpcProvider(url);

let wallet = new ethers.Wallet(`<Signer Key/Private Key>`, provider);
let registry = new ethers.Contract(DID_ADDRESS, <Contract ABI>, wallet);
```

```

# Deploying the Contract on Matic network

Pre-requisites

- NodeJS

```

<https://nodejs.org/en/download/>

```

- Hardhat

```

<https://hardhat.org/>

```


- A wallet connected to polygon network, with Matic token in it. One can receive the Matic Test Tokens from their faucet.

## Deployment

Clone the above repository

```

git clone <https://gitlab.com/polygon-did/polygon-did-smart-contract.git>

```

Install Dependencies

```

pnpm i

```


Update your and RPC URL in .env file.

```

RPCURL="<Place your RPC URL here>"
SIGNER="<Place your private Key here>"

```

On a new console window run

```

nxp hardhat run deploy --network <network name>

```

## Testing

For Testing use the command

```

pnpm test

```

```
