pragma solidity ^0.4.24;

import "./MultiSigWallet.sol";
import "openzeppelin-solidity/contracts/token/ERC20/TokenVesting.sol";

/**
 * @title CompanyVault
 * @dev a MultiSignature wallet that allows the creation of a new Employee with a TokenVesting contract.
 * @dev the delivery of tokens to the Employee's vesting contract must be authorized by multi sig owners
 */
contract CompanyVault is MultiSigWallet {
  /*
   *  constants
  */
  bool constant internal VESTING_REVOCABLE = true;

  /*
   *  Events
  */
  event NewEmployee (TokenVesting _tokenVesting, address _address);

  /*
   *  Storage
  */
   mapping (address => TokenVesting) public employees;

  /*
  * Modifiers
  */
  modifier isNewEmployee (address employee) {
    require(employees[employee] == address(0));
    _;
  }

  modifier employeeExists(address employee){
    require (employees[employee] != address(0));
    _;
  }


  /**
   * public functions
  */

  /**
   * @dev generates a new employee tokenVesting contract for the specified address.
   * @param _address the address of the employee
   * @param _start the time (as Unix time) at which point vesting starts
   * @param _cliff duration in seconds of the cliff in which tokens will begin to vest
   * @param _duration duration in seconds of the period in which the tokens will vest
  */
  function newEmployee(address _address, uint256 _start, uint256 _cliff, uint256 _duration)
    public
    isNewEmployee(_address)
    notNull(_address)
  {
    TokenVesting tokenVesting = new TokenVesting(_address, _start, _cliff, _duration, VESTING_REVOCABLE);
    employees[_address]= tokenVesting;

    emit NewEmployee(tokenVesting, _address);
  }

  /**
   * @dev Sends tokens to the Vest contract for the assigned _employee.
   * @dev This is a multi signature transactions.
   * @param _employee an existing employee's address
   * @param _value the amount of tokens to send to the vesting contract.
   * @param _data Transaction data payload.
  */
  function vestEmployee(address _employee, uint _value, bytes _data)
    public
    employeeExists(_employee)
    returns (uint transactionId)
  {
    return submitTransaction(_employee, _value, _data);
  }
}
