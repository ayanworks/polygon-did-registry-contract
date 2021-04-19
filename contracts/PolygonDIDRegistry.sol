pragma solidity 0.5.1;

/**
 *@title PolygonDIDRegistry
 *@dev Smart Contract for Polygon DID Method
 */

contract PolygonDIDRegistry {
    struct PolyDID {
        address controller;
        uint256 created;
        uint256 updated;
        string doc;
    }
    modifier onlyController(address _id) {
        require(
            did[_id].controller == msg.sender,
            "sender has no control of this DID"
        );
        _;
    }

    mapping(address => PolyDID) did;
    event CreateDID(address id, string doc);
    event UpdateDID(address id, string doc);
    event DeleteDID(address id);

    /**
     *@dev Register a new DID
     *@param _id - Address that will refer the DID doc
     *@param _doc - A string object that holds the DID Doc
     */

    function createDID(address _id, string memory _doc)
        public
        returns (address)
    {
        did[_id].controller = msg.sender;
        did[_id].created = now;
        did[_id].updated = now;
        did[_id].doc = _doc;
        emit CreateDID(_id, _doc);
        return _id;
    }

    /**
     *@dev Reads DID Doc from Chain
     *@param _id - Address that refers to the DID doc position
     */

    function getDID(address _id) public view returns (string memory) {
        return did[_id].doc;
    }

    /**
     *@dev To Update the DID doc
     *@param _id - Address that refers to the DID doc
     *@param _doc - A String that holds the DID doc
     */

    function updateDID(address _id, string memory _doc)
        public
        onlyController(_id)
    {
        did[_id].doc = _doc;
        did[_id].updated = now;
        emit UpdateDID(_id, _doc);
    }

    /**
     *@dev To delete a DID from chain
     *@param _id - Address that refers to the DID doc that need to be deleted
     */

    function deleteDID(address _id) public onlyController(_id) {
        delete did[_id];
        emit DeleteDID(_id);
    }
}
