//SPDX-License-Identifier: Apache 2.0
pragma solidity ^0.8.16;

/**
 *@title PolygonDidRegistry
 *@dev Smart Contract for Polygon DID Method
 */
contract PolygonDidRegistry {
    uint256 totalDIDs;
    address owner;
    uint256 deletedDID;
    struct PolyDID {
        address controller;
        uint256 created;
        uint256 updated;
        string didDoc;
    }

    modifier onlyController(address _id) {
        require(
            polyDIDs[_id].controller == msg.sender,
            'message sender is not the controller of the DID Doc'
        );
        _;
    }
    mapping(address => PolyDID) polyDIDs;
    mapping(uint256 => address) activeDIDs;
    mapping(address => uint256) activeAddress;

    event DIDCreated(address id, string doc);
    event DIDUpdated(address id, string doc);
    event TransferOwnership(address newOwner);
    event ResourceAdded(
        address _id,
        string _resourceId,
        string _resourcePayload
    );

    bool private initialized;

    /**
     *@dev initializes the ownership of contract
     **/

    mapping(address => string[]) private keysById;
    mapping(address => mapping(string => string)) resourceData;

    function initialize() public {
        require(!initialized, 'Contract instance has already been initialized');
        initialized = true;
        owner = msg.sender;
        totalDIDs = 0;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, 'message sender is not the owner');
        _;
    }

    /**
     *@dev transfer the ownership of contract
     *@param _newOwner - Address of the new owner to whom the ownership needs to be passed
     **/

    function transferOwnership(
        address _newOwner
    ) public onlyOwner returns (string memory) {
        if (owner != _newOwner) {
            owner = _newOwner;
            emit TransferOwnership(owner);
            return ('Ownership transferred successfully');
        } else {
            return ('Ownership cannot be transferred to the same account');
        }
    }

    /**
     *@dev Reads contract owner from chain
     */

    function getOwner() public view returns (address _owner) {
        return owner;
    }

    /**
     *@dev Register a new DID
     *@param _id - Address that will refer the DID doc
     *@param _doc - A string object that holds the DID Doc
     */

    function createDID(
        address _id,
        string memory _doc
    )
        public
        returns (
            address controller,
            uint256 created,
            uint256 updated,
            string memory didDoc
        )
    {
        polyDIDs[_id].controller = msg.sender;
        polyDIDs[_id].created = block.timestamp;
        polyDIDs[_id].updated = block.timestamp;
        polyDIDs[_id].didDoc = _doc;
        activeDIDs[totalDIDs] = msg.sender;
        activeAddress[_id] = totalDIDs;
        ++totalDIDs;
        emit DIDCreated(_id, _doc);
        return (
            polyDIDs[_id].controller,
            polyDIDs[_id].created,
            polyDIDs[_id].updated,
            polyDIDs[_id].didDoc
        );
    }

    /**
     *@dev Reads DID Doc from Chain
     *@param _id - Address that refers to the DID doc position
     */

    function getDIDDoc(
        address _id
    ) public view returns (string memory, string[] memory) {
        string[] memory result = new string[](keysById[_id].length);

        for (uint256 i = 0; i < keysById[_id].length; i++) {
            result[i] = resourceData[_id][keysById[_id][i]];
        }
        return (polyDIDs[_id].didDoc, result);
    }

    /**
     *@dev Reads total number of DIDs and total number of active DIDs from Chain
     */

    function getTotalNumberOfDIDs() public view returns (uint256 _totalDIDs) {
        return (totalDIDs);
    }

    /**
     *@dev Reads one DID at a time from Chain based on index
     *@param _index - Uint256 type variable that refers to the DID position
     *@return _did - returns the DID Doc assciated with the index. Returns null if the DID Doc is deleted.
     */

    function getDIDDocByIndex(
        uint256 _index
    ) public view returns (string memory) {
        return polyDIDs[activeDIDs[_index]].didDoc;
    }

    /**
     *@dev To Update the DID doc
     *@param _id - Address that refers to the DID doc
     *@param _doc - A String that holds the DID doc
     */

    function updateDIDDoc(
        address _id,
        string memory _doc
    )
        public
        onlyController(_id)
        returns (
            address controller,
            uint256 created,
            uint256 updated,
            string memory didDoc
        )
    {
        polyDIDs[_id].didDoc = _doc;
        polyDIDs[_id].updated = block.timestamp;
        emit DIDUpdated(_id, _doc);
        return (
            polyDIDs[_id].controller,
            polyDIDs[_id].created,
            polyDIDs[_id].updated,
            polyDIDs[_id].didDoc
        );
    }

    /**
     *@dev To add linked resource in the DID doc
     *@param _id - Address that refers to the DID doc
     *@param _resourceId - Id that refers to the resource
     */
    function addResource(
        address _id,
        string memory _resourceId,
        string memory _resourcePayload
    )
        public
        onlyController(_id)
        returns (address, string memory, string memory)
    {
        resourceData[_id][_resourceId] = _resourcePayload;
        keysById[_id].push(_resourceId);
        emit ResourceAdded(_id, _resourceId, _resourcePayload);
        return (_id, _resourceId, _resourcePayload);
    }

    /**
     *@dev Reads DID linked resource from Chain
     *@param _id - Address that refers to the DID doc
     *@param _resourceId - Id that refers to a specific resource
     */

    function getResource(
        address _id,
        string memory _resourceId
    ) public view returns (string memory) {
        return resourceData[_id][_resourceId];
    }

    /**
     *@dev Reads all DID linked resource for a specific DID from Chain
     *@param _id - Address that refers to the DID doc
     */

    function getAllResources(
        address _id
    ) public view returns (string[] memory) {
        string[] memory result = new string[](keysById[_id].length);

        for (uint256 i = 0; i < keysById[_id].length; i++) {
            result[i] = resourceData[_id][keysById[_id][i]];
        }

        return result;
    }
}