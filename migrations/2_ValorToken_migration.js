var ValorToken = artifacts.require("./ValorToken.sol");

module.exports = function(deployer, network, accounts) {
  console.log("network:"+network);
  // for now we are deploying into network with three accounts
  if (network == "development" || network == "test"){
   console.log("contracts are created in testcases");
  }
};
