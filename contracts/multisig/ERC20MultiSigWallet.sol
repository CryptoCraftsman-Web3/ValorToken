pragma solidity ^0.4.24;

import "./MultiSigWallet.sol";

/**
 * @title ERC20MultiSigWallet
 * @dev ERC20 Token MultiSigWallet. Extends Consensys MultiSigWallet and adds a method to operate
 * @dev only with ERC20 tokens, instead of Ethers.
*/

 contract ERC20MultiSigWallet is MultiSigWallet {

   /**
    * @dev adds transaction with default values for address and ethers amounts
    * @dev and call to ERC20 transfer goes in payload of _data.
    * @param _data payload of the command to execute.
  */
   function submitERC20Transaction(bytes _data)
   public
   returns (uint transactionId)
   {
      submitTransaction(address(this), 0, _data)
   }
}
