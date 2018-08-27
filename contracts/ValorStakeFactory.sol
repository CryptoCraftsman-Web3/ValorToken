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
    mapping (address => address) public stakes;

    event StakeCreated(address beneficiary,uint256 duration); 

    constructor(address _tokenAddress) public{
    	owner = msg.sender;
    	token = ERC20(_tokenAddress);
    }


    function createStake(address beneficiary, uint256 lockPeriod) public onlyOwner {
        require(stakes[beneficiary] == address(0), "this user has already a stake");
    	ValorTimelock stake = new ValorTimelock(token, beneficiary, owner, lockPeriod);
        emit StakeCreated(beneficiary,lockPeriod);
        stakes[beneficiary] = stake;
    }
}