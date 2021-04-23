pragma solidity ^0.5.1;

/**
 *@title PolygonDIDRegistry
 *@dev Smart Contract for Polygon DID Method
 */
contract PolygonDIDRegistry {
    struct PolyDID {
        address controller;
        uint256 created;
        uint256 updated;
        string did_doc;
    }
    modifier onlyController(address _id) {
        require(
            did[_id].controller == msg.sender
        );
        _;
    }

    mapping(address => PolyDID) did;
    event DidCreated(address id, string doc);
    event DidUpdated(address id, string doc);
    event DidDeleted(address id);

    /**
     *@dev Register a new DID
     *@param _id - Address that will refer the DID doc
     *@param _doc - A string object that holds the DID Doc
     *returns controller, created, updated and did_doc
     */
    function createDID(address _id, string memory _doc)
        public
        returns (address controller, uint256 created, uint256 updated, string memory did_doc)
    {
        did[_id].controller = msg.sender;
        did[_id].created = now;
        did[_id].updated = now;
        did[_id].did_doc = _doc;
        emit DidCreated(_id, _doc);
        return (did[_id].controller, did[_id].created, did[_id].updated, did[_id].did_doc);
    }

    /**
     *@dev Reads DID Doc from Chain
     *@param _id - Address that refers to the DID doc position
     */
    function getDID(address _id) public view returns (string memory) {
        return did[_id].did_doc;
    }

    /**
     *@dev To Update the DID doc
     *@param _id - Address that refers to the DID doc
     *@param _doc - A String that holds the DID doc
     * returns controller, created, updated and did_doc
     */
    function updateDID(address _id, string memory _doc)
        public
        onlyController(_id) returns(address controller, uint256 created, uint256 updated, string memory did_doc)
    {
        did[_id].did_doc = _doc;
        did[_id].updated = now;
        emit DidUpdated(_id, _doc);
        return (did[_id].controller, did[_id].created, did[_id].updated, did[_id].did_doc);
    }

    /**
     *@dev To delete a DID from chain
     *@param _id - Address that refers to the DID doc that need to be deleted and returns error if not deleted
     */
    function deleteDID(address _id) public onlyController(_id) {
        delete did[_id];
        emit DidDeleted(_id);
    }
}
