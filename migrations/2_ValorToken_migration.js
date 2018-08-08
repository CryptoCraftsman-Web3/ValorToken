var ValorToken = artifacts.require("./ValorToken.sol");

module.exports = function(deployer, network, accounts) {
  // for now we are deploying into network with three accounts
  if (network == "develop"){
    deployer.deploy(ValorToken, accounts[7], accounts[8], accounts[9]);
  }
};
