var ValorToken = artifacts.require("./ValorToken.sol");

module.exports = function(deployer) {
  deployer.deploy(ValorToken);
};
