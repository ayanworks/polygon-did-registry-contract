//SPDX-License-Identifier: Apache 2.0
pragma solidity 0.8.16;

/**
 *@title PolygonDidRegistry
 *@dev Smart Contract for Polygon DID Method
 */
contract PolygonDidRegistry {
    address owner;
    struct PolyDID {
        address controller;
        uint256 created;
        uint256 updated;
        string didDoc;
    }

    mapping(address => PolyDID) polyDIDs;
    mapping(address => mapping(string => string)) resourceData;
    mapping(address => string[]) private keysById;
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
     *@dev modifiers for access control
     **/

    modifier onlyController(address _id) {
        require(
            polyDIDs[_id].controller == msg.sender,
            'message sender is not the controller of the DID Doc'
        );
        _;
    }

    modifier nonReentrant() {
        require(!initialized, 'Contract instance has already been initialized');
        initialized = true;
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, 'message sender is not the owner');
        _;
    }

    /**
     *@dev initializes the ownership of contract
     **/

    function initialize() external nonReentrant {
        require(msg.sender != address(0), 'Invalid owner address');
        owner = msg.sender;
    }

    /**
     *@dev transfer the ownership of contract
     *@param _newOwner - Address of the new owner to whom the ownership needs to be passed
     **/

    function transferOwnership(
        address _newOwner
    ) external onlyOwner returns (string memory) {
        require(_newOwner != address(0), 'Invalid owner address');
        require(
            owner != _newOwner,
            'Ownership cannot be transferred to the same account'
        );
        owner = _newOwner;
        emit TransferOwnership(owner);
        return ('Ownership transferred successfully');
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
        external
        returns (
            address controller,
            uint256 created,
            uint256 updated,
            string memory didDoc
        )
    {
        require(_id != address(0), 'Invalid address provided');
        require(polyDIDs[_id].controller != _id, 'DID already exist');
        polyDIDs[_id].controller = _id;
        polyDIDs[_id].created = block.timestamp;
        polyDIDs[_id].updated = block.timestamp;
        polyDIDs[_id].didDoc = _doc;
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
     *@dev To Update the DID doc
     *@param _id - Address that refers to the DID doc
     *@param _doc - A String that holds the DID doc
     */

    function updateDIDDoc(
        address _id,
        string memory _doc
    )
        external
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
        external
        onlyController(_id)
        returns (address, string memory, string memory)
    {
        require(_id != address(0), 'Invalid address provided');
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