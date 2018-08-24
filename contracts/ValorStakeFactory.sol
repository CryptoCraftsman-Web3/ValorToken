pragma solidity ^0.4.24;

import "./ValorTimelock.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
/**
 * @title ValorStakeFactory
 * @dev ValorStakeFactory creates ValorTimelock objects on demand
 */
contract ValorStakeFactory is Ownable{

    address public tokenAddress;

    event TimelockedStakeCreated(address beneficiary,uint256 duration, address _owner); 

    constructor(address _tokenAddress) public{
    	owner = msg.sender;
    	tokenAddress = _tokenAddress;
    }


    function createTimeLockedStake(address beneficiary, uint256 duration, address _owner) public onlyOwner {
    	ValorTimelock timelock = new ValorTimelock(tokenAddress, beneficiary, duration, _owner);
    	
    }
}