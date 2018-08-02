
//not nice import, useful to have some helper functions available
//especially .shoud.be.rejected interface
//waiting for open-zeppelin helpers.js to remove babel dependencies  
var util = require ("./util.js");
var BigNumber      = util.BigNumber;

const ValorToken = artifacts.require('./ValorToken.sol');

contract('ValorToken', async ([Alice, Bob, Charlie]) => {
  

  beforeEach(async () => {
     this.valor       = await ValorToken.deployed();
     this.totalSupply = await this.valor.totalSupply.call();
  });

  /**
   * Lets validate that intial supply is equal to total supply.
  */
  it("initial supply is total supply.", async () => {
    console.log(this.totalSupply);
    (await this.valor.INITIAL_SUPPLY.call()).should.be.bignumber.equal(this.totalSupply);
  });

  /**
   * We are giving the initial supply to the owner, let's validate that.
  */
  it("should the owner Alice get the total supply of tokens.", async () => {
   (await this.valor.balanceOf.call(Alice)).should.be.bignumber.equal(this.totalSupply);
  });

  /**
   * let's make a small transfer to another account and make sure send is ok.
  */
  it("Alice transfers some valor tokens to Bob account.", async () => {

    let amount=1000;
    // lets get initial balance of owner Alice
    let initialOwnerBalance = await this.valor.balanceOf.call(Alice);

    // perform transfer from Alice to Bob
    await this.valor.transfer.sendTransaction(Bob, amount, {from: Alice}).should.be.fulfilled;

    (await this.valor.balanceOf.call(Alice)).should.be.bignumber.equal(initialOwnerBalance.add(-amount));
    // let's make sure owner balance has been updated.
    
    (await this.valor.balanceOf.call(Bob)).should.be.bignumber.equal(amount);

  });

  /**
   * let's make a small test to make sure we can burn correctly tokens.
   * 
   */
   it("Bob should burn tokens.", async () => {
     let burnt = 100;




    // perform transfer from Alice to Bob, to make sure Bob has enough tokens to burn
    await this.valor.transfer.sendTransaction(Bob, burnt, {from: Alice}).should.be.fulfilled;

     // we capture Bob balance 
     let initialBalance = await this.valor.balanceOf.call(Bob);

     //now Bob burns tokens.
    await this.valor.burn.sendTransaction(burnt, {from: Bob}).should.be.fulfilled;

     //now lets check balance and total supply
     let newBalance = await this.valor.balanceOf.call(Bob);
     let newSupply = await this.valor.totalSupply.call();

     newBalance.should.be.bignumber.equal(initialBalance.minus(burnt));
     newSupply.should.be.bignumber.equal(this.totalSupply.minus(burnt));
   });

  /**
   * let's make a small test to burn more tokens than your balance
   */
   it("Bob shouldn't burn more tokens than in his balance", async () => {
     
     // we capture account balance and total supply as this will be decreased.
     let balance = await this.valor.balanceOf.call(Bob);
     

     //now lets try to burn the balance + 1000. Should fail!
     await this.valor.burn.sendTransaction(balance + 1000, {from: Bob}).should.be.rejected;

   });

   /**
    * now we will test the burnFrom method that allows another account to burn
    * tokens from another account
    */
    it("Bob allows Alice to burn tokens in his behalf", async () => {
      let burnt = 100;


      // perform transfer from Alice to Bob, to make sure Bob has  tokens to burn
      await this.valor.transfer.sendTransaction(Bob, 1000, {from: Alice}).should.be.fulfilled;

      // Bob authorizes Alice to transfer or burn .
      await this.valor.approve.sendTransaction(Alice, burnt, {from: Bob}).should.be.fulfilled;

      // we capture Bob balance and total supply as this will be decreased.
      let initialBalance = await this.valor.balanceOf.call(Bob);

      //now let Alice burn it.
      await this.valor.burnFrom.sendTransaction(Bob, burnt, {from: Alice}).should.be.fulfilled;

      //now lets check balance and total supply
      let newBalance = await this.valor.balanceOf.call(Bob);
      let newSupply = await this.valor.totalSupply.call();

      newSupply.should.be.bignumber.equal(this.totalSupply.minus(burnt));
      newBalance.should.be.bignumber.equal(initialBalance.minus(burnt));
    });



});
