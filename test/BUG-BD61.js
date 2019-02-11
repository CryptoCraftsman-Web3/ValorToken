//[VALOR token] Wrong balances if initial beneficiaries are the same address
// in previoius implementation if the 3 beneficiaires were the same account
// the final balance was wrong






const chai = require('chai');

const BN = web3.utils.BN;

const should = chai
  .use(require('chai-bn')(BN))
  .should();

  

const ValorToken = artifacts.require('./ValorToken.sol');
const VALOR = (new BN(10)).pow(new BN(18));

console.log("[VALOR token] Wrong balances if initial beneficiaries are the same address");

contract('ValorToken', async ([companyWallet,someUser,employeePool,futureDevFund]) => {


  beforeEach(async () => {
    //corner case, the 3 beneficiaries are the same account
     this.valor       = await ValorToken.new(companyWallet,companyWallet,companyWallet);
     this.totalSupply = 1e8 * VALOR;

  });

  /**
   * We are giving the initial supply to one account
  */
  it("all 100M tokens are in the companyWallet - no bug bd61 happens", async () => {

    let balance = await this.valor.balanceOf.call(companyWallet);
    console.log("HERE!!!!");

    console.log("---" + typeof(balance));
    balance.should.be.bignumber.equal(new BN("100000000").mul(VALOR));

  });
});