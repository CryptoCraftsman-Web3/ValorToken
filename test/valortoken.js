
const chai = require('chai');

const BN = web3.utils.BN;

const should = chai
  .use(require('chai-bn')(BN))
  .use(require('chai-as-promised'))
  .should();


const ValorToken = artifacts.require('./ValorToken.sol');
const VALOR = (new BN(10)).pow(new BN(18)); //1 VALOR = 10^18
const milliVALOR = (new BN(10)).pow(new BN(15));//1 mVALOR = 10^15

contract('ValorToken', async ([companyWallet,someUser,anotherUser,employeePool,futureDevFund]) => {


  beforeEach(async () => {
     this.valor       = await ValorToken.new(employeePool,futureDevFund,companyWallet);
     this.totalSupply = new BN(100000000).mul(VALOR); //100 million of VALOR
  });

  /**
   * Lets validate that intial supply is equal to total supply.
  */
  it("initial supply is total supply.", async () => {
    (await this.valor.INITIAL_SUPPLY.call()).should.be.bignumber.equal(this.totalSupply);
  });

  /**
   * We are giving the initial supply to three accounts, accounts[7], accounts[8] and accounts[9]
  */
  it("should distribute initial tokens to three wallets at TGE", async () => {

    //const _1e24 = new BN(10).pow(new BN(24));
    (await this.valor.balanceOf.call(employeePool)).should.be.bignumber.equal(new BN(19000000).mul(VALOR));
    (await this.valor.balanceOf.call(futureDevFund)).should.be.bignumber.equal(new BN(26000000).mul(VALOR));
    (await this.valor.balanceOf.call(companyWallet)).should.be.bignumber.equal(new BN(55000000).mul(VALOR));
  });

  /**
   * let's make a small transfer to another account and make sure send is ok.
  */
  it("companyWallet transfers some valor tokens to someUser account.", async () => {
    let amount=new BN(10).mul(VALOR);//10 VALOR


    // lets get initial balance of owner companyWallet
    let initialOwnerBalance = await this.valor.balanceOf.call(companyWallet);

    // perform transfer from companyWallet to someUser
    await this.valor.transfer.sendTransaction(someUser, amount, {from: companyWallet}).should.be.fulfilled;
    (await this.valor.balanceOf.call(companyWallet)).should.be.bignumber.equal(initialOwnerBalance.sub(amount));

    // let's make sure owner balance has been updated.
    (await this.valor.balanceOf.call(someUser)).should.be.bignumber.equal(amount);

  });


  /**
   * let's make a approve/tranferFrom
  */
  it("companyWallet approves amount to someUser which transfers funds to anotherUser", async () => {
    let amount=new BN(4).mul(VALOR);//4 VALOR


    // lets get initial balance of owner companyWallet
    let initialBalance = await this.valor.balanceOf.call(companyWallet);

    //companyWallet perapprove funds to someUser
    await this.valor.approve.sendTransaction(someUser, amount, {from: companyWallet}).should.be.fulfilled;

    //someUser transfers on behalf of company wallet to another user
    await this.valor.transferFrom.sendTransaction(companyWallet, anotherUser, amount, {from: someUser}).should.be.fulfilled;

    //check company balance
    (await this.valor.balanceOf.call(companyWallet)).should.be.bignumber.equal(initialBalance.sub(amount));

    //check another user balance
    (await this.valor.balanceOf.call(anotherUser)).should.be.bignumber.equal(amount);

  });


  /**
   * let's make a small test to make sure we can burn correctly tokens.
   *
   */
   it("someUser should burn tokens.", async () => {
     let burnt = new BN(100).mul(milliVALOR); // 100 milli VALOR = 0.1 VALOR

    // perform transfer from companyWallet to someUser, to make sure someUser has enough tokens to burn
     await this.valor.transfer.sendTransaction(someUser, burnt, {from: companyWallet}).should.be.fulfilled;

     // we capture someUser balance
     let initialBalance = await this.valor.balanceOf.call(someUser);

     //now someUser burns tokens.
     await this.valor.burn.sendTransaction(burnt, {from: someUser}).should.be.fulfilled;

     //now lets check balance and total supply
     let newBalance = await this.valor.balanceOf.call(someUser);
     let newSupply = await this.valor.totalSupply.call();

     newBalance.should.be.bignumber.equal(initialBalance.sub(burnt));
     newSupply.should.be.bignumber.equal(this.totalSupply.sub(burnt));
   });

  /**
   * let's make a small test to burn more tokens than your balance
   */
   it("someUser shouldn't burn more tokens than in his balance", async () => {

     // we capture account balance and total supply as this will be decreased.
     let balance = await this.valor.balanceOf.call(someUser);


     //now lets try to burn the balance + 1000. Should fail!
     await this.valor.burn.sendTransaction(balance.add(new BN(1000)), {from: someUser}).should.be.rejected;

   });

   /**
    * now we will test the burnFrom method that allows another account to burn
    * tokens from another account
    */
    it("someUser allows companyWallet to burn tokens in his behalf", async () => {
      let amount = new BN(100).mul(milliVALOR); // 100 milli VALOR


      // perform transfer from companyWallet to someUser, to make sure someUser has  tokens to burn
      await this.valor.transfer.sendTransaction(someUser, amount, {from: companyWallet}).should.be.fulfilled;

      // someUser authorizes companyWallet to transfer or burn .
      await this.valor.approve.sendTransaction(companyWallet, amount, {from: someUser}).should.be.fulfilled;

      // we capture someUser balance and total supply as this will be decreased.
      let initialBalance = await this.valor.balanceOf.call(someUser);

      //now let companyWallet burn it.
      await this.valor.burnFrom.sendTransaction(someUser, amount, {from: companyWallet}).should.be.fulfilled;

      //now lets check balance and total supply
      let newBalance = await this.valor.balanceOf.call(someUser);
      let newSupply = await this.valor.totalSupply.call();

      newSupply.should.be.bignumber.equal(this.totalSupply.sub(amount));
      newBalance.should.be.bignumber.equal(initialBalance.sub(amount));
    });



});
