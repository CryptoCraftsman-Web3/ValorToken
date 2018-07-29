var CompanyVault = artifacts.require("./CompanyVault.sol");

module.exports = function(deployer) {
  deployer.deploy(CompanyVault);
};
