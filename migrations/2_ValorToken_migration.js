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
  	let testVault3 = "0x25100E346bfB990CBc82B5EF658d32360285b582";

  	console.log("creating contract on ropsten via infura");
  	deployer.deploy(ValorToken, testVault1,testVault2,testVault3);
  }

  if (network == "rinkeby"){
    let testVault1 = "0x04afbc548e9df377141497a058b4000aa617f95f";
    let testVault2 = "0x04afbc548e9df377141497a058b4000aa617f95f";
    let testVault3 = "0x04afbc548e9df377141497a058b4000aa617f95f";

    console.log("creating contract on rinkeby via infura");
    deployer.deploy(ValorToken, testVault1,testVault2,testVault3);
  }

  if (network == "mainnet"){
    let vault1 = "0xA76ee55d63CC9ae431C1618bFEB953487C06C3c2";
    let vault2 = "0xF5d3E5586EF9Ca8A18F137808ff7e162a638E621";
    let vault3 = "0xBedC09625d4233631Bca1Ee670B24E0651CfBe17";

    console.log("creating contract on mainnet via infura");
    deployer.deploy(ValorToken, vault1,vault2,vault3);
  }  

};
