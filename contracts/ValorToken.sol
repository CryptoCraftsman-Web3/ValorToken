pragma solidity ^0.4.24;


import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";


/**
 * @title ValorToken
 * @dev Very simple ERC20 Token example, where all tokens are pre-assigned to the creator.
 * Note they can later distribute these tokens as they wish using `transfer` and other
 * `StandardToken` functions.
 */
contract SimpleToken is StandardToken {

  string public constant name = "ValorToken"; //  to be approved
  string public constant symbol = "VALOR"; //  to be approved
  uint8 public constant decimals = 18; //  to be approved

  uint256 public constant INITIAL_SUPPLY = 1e8 * (10 ** uint256(decimals)); //100000000 VALOR. to be approved

  /**
   * @dev Constructor that gives msg.sender all of existing tokens.
   */
  constructor() public {
    totalSupply_ = INITIAL_SUPPLY;
    balances[msg.sender] = INITIAL_SUPPLY;
    emit Transfer(address(0), msg.sender, INITIAL_SUPPLY);
  }

}