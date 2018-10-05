var ValorToken = artifacts.require("./ValorToken.sol");

module.exports = function(deployer, network, accounts) {
  console.log("network:"+network);
  // for now we are deploying into network with three accounts
  if (network == "development" || network == "test"){
   console.log("contracts are created in testcases");
  }

  if (network == "ropsten"){
  	let testVault1 = "0x7afde2464bbfcc17984fa5369ef227d34302dea7";
  	let testVault2 = "0x955f30afedc4bac1695efc57cf105bfd6ab693bb";
  	let testVault3 = "0xf35a95c93a23337a3b73e622fb9dd7e6c394b29e";

  	console.log("creating contract on ropsten via infura");
  	deployer.deploy(ValorToken, testVault1,testVault2,testVault3);
  }
};
