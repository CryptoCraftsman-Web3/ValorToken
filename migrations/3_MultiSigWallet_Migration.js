var MultiSigWallet = artifacts.require("./MultiSigWallet.sol");

module.exports = function(deployer, network, accounts) {
  const requiredConfirmations = 2;
  deployer.deploy(MultiSigWallet,[accounts[0], accounts[1]], requiredConfirmations);
};
