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
  	let testVault3 = "0x04aFBc548e9df377141497a058b4000aA617F95f";

  	console.log("creating contract on ropsten via infura");
  	deployer.deploy(ValorToken, testVault1,testVault2,testVault3);
  }

  if (network == "rinkeby"){
    let testVault1 = "0x04afbc548e9df377141497a058b4000aa617f95f";
    let testVault2 = "0x04afbc548e9df377141497a058b4000aa617f95f";
    let testVault3 = "0x04afbc548e9df377141497a058b4000aa617f95f";

    console.log("creating contract on ropsten via infura");
    deployer.deploy(ValorToken, testVault1,testVault2,testVault3);
  }

};
