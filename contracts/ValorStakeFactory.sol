pragma solidity ^0.4.24;

import "./ValorTimelock.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

/**
 * @title ValorStakeFactory
 * @dev ValorStakeFactory creates ValorTimelock objects on demand
 */
contract ValorStakeFactory is Ownable{

    ERC20 public token;

    event StakeCreated(address stake, uint256 atStake); 

    constructor(address _tokenAddress) public{
    	token = ERC20(_tokenAddress);
        owner = msg.sender;
    }



    //creates a stake and tries to transfer the required amount atStake
    //if transferFrom fails the transaction fails and gas is burnt
    function createStake(address beneficiary, uint256 lockPeriod, uint256 atStake) 
    public {

        ValorTimelock stake = new ValorTimelock(token, beneficiary, owner, lockPeriod);
        token.transferFrom(beneficiary, address(stake), atStake);
        emit StakeCreated(address(stake), atStake);
    }
}