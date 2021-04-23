const PolygonDidRegistry = artifacts.require("PolygonDidRegistry");

module.exports = function(deployer){
    deployer.deploy(PolygonDidRegistry);
};