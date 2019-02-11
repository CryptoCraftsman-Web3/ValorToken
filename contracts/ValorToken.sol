pragma solidity 0.4.25;

import "openzeppelin-solidity/contracts/token/ERC20/StandardBurnableToken.sol";
/**
 * @title ValorToken
 */
contract ValorToken is StandardBurnableToken {

    string public constant name    =   "ValorToken(test)";
    string public constant symbol  =   "T-VALOR";
    uint8  public constant decimals =   18;

    // initial supply addresses
    address public employeePool;
    address public futureDevFund;
    address public companyWallet;

    // initial supply and distribution of tokens
    uint256 internal constant VALOR = 10 ** uint256(decimals);
    uint256 public constant INITIAL_SUPPLY = 1e8 * VALOR; //100000000 VALOR.

    // required distribution is:
    // employeePool : 19%
    // futureDevFund: 26%
    // companyWallet: 55%
    uint256 internal constant employeePoolSupply =  1.9e7 * VALOR; // 19 000 000 VALOR
    uint256 internal constant futureDevFundSupply = 2.6e7 * VALOR; // 26 000 000 VALOR
    uint256 internal constant companyWalletSupply = 5.5e7 * VALOR; // 55 000 000 VALOR

    /**
     * @dev Constructor that distributes at TGS the supply among three predefined wallets 
     * @param _employeePool the account of employees pool funds
     * @param _futureDevFund the account of future development fund
     * @param _companyWallet the account of company managed cold wallet
     */
    constructor(address _employeePool, address _futureDevFund, address _companyWallet) public {
        require(_employeePool  != address(0),  "0x0 address is not allowed");
        require(_futureDevFund != address(0),  "0x0 address is not allowed");
        require(_companyWallet != address(0),  "0x0 address is not allowed");

        employeePool  = _employeePool;
        futureDevFund = _futureDevFund;
        companyWallet = _companyWallet;

        assert(INITIAL_SUPPLY == employeePoolSupply + futureDevFundSupply + companyWalletSupply);

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
