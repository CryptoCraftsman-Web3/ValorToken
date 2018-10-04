pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/StandardBurnableToken.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
/**
 * @title ValorToken
 */
contract ValorToken is StandardBurnableToken {

    string public constant name    =   "ValorToken";
    string public constant symbol  =   "VALOR";
    uint8  public constant decimals =   18;

    // initial supply addresses
    address public employeePool;
    address public futureDevFund;
    address public companyWallet;

    // initial supply and distribution of tokens
    uint256 internal constant VALOR = 10 ** uint256(decimals);
    uint256 public constant INITIAL_SUPPLY = 1e8 * VALOR; //100000000 VALOR.

    // distribution is:
    // employeePool : 19%
    // futureDevFund: 26%
    // companyWallet: 55%
    uint256 internal constant employeePoolSupply =  1.9e7 * VALOR; // 19 000 000 VALOR
    uint256 internal constant futureDevFundSupply = 2.6e7 * VALOR; // 26 000 000 VALOR
    uint256 internal constant companyWalletSupply = 5.5e7 * VALOR; // 55 000 000 VALOR

    /**
     * @dev Constructor that distributes at once the supply among Employee pool,
     * @dev Future Dev fund and SmartValor Company.
     */
    constructor(address _employeePool, address _futureDevFund, address _companyWallet) public {
        require(_employeePool != address(0),  "0x0 address is not allowed");
        require(_futureDevFund != address(0), "0x0 address is not allowed");
        require(_companyWallet != address(0), "0x0 address is not allowed");

        employeePool = _employeePool;
        futureDevFund = _futureDevFund;
        companyWallet = _companyWallet;

        totalSupply_ = INITIAL_SUPPLY;

        // EmployeePool
        balances[employeePool] += employeePoolSupply;
        emit Transfer(address(0), employeePool, employeePoolSupply);

        // FutureDevFund
        balances[futureDevFund] += futureDevFundSupply;
        emit Transfer(address(0), futureDevFund, futureDevFundSupply);

        //CompanyWallet
        balances[companyWallet] += companyWalletSupply;
        emit Transfer(address(0), companyWallet, companyWalletSupply);
    }
}
