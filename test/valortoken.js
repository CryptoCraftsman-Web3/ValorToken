
//not nice import, useful to have some helper functions available
//especially .shoud.be.rejected interface
//waiting for open-zeppelin helpers.js to remove babel dependencies  
require ("./util.js");


const ValorToken = artifacts.require('./ValorToken.sol');

contract('ValorToken', async (accounts) => {
  let valor;

  before(async () => {
     valor = await ValorToken.deployed();
  });

  /**
   * Lets validate that intial supply is equal to total supply.
  */
  it("initial supply is total supply.", async () => {
    let initialSupply = await valor.INITIAL_SUPPLY.call();
    let totalSupply = await valor.totalSupply.call();
    assert.equal(initialSupply.toNumber(), totalSupply.toNumber());
  });

  /**
   * We are giving the initial supply to the owner, let's validate that.
  */
  it("should give the owner the total supply of tokens.", async () => {
    let ownerBalance = await valor.balanceOf.call(accounts[0]);
    let totalSupply = await valor.totalSupply.call();
    assert.equal(ownerBalance.toNumber(), totalSupply.toNumber());
  });

  /**
   * let's make a small transfer to another account and make sure send is ok.
  */
  it("should transfer some valor tokens to lucky account.", async () => {
    const amount = 10000000; // the amount of Valor tokens to send.
    const owner = accounts[0];

    // lets get initial balance of owner
    let initialOwnerBalance = await valor.balanceOf.call(owner);

    // perform transfer from owner to new account
    await valor.transfer.sendTransaction(accounts[1], amount, {from: owner});

    let newOwnerBalance = await valor.balanceOf.call(owner);
    // let's make sure owner balance has been updated.
    assert.equal(initialOwnerBalance.toNumber() - amount, newOwnerBalance.toNumber());

    // let's make sure destination account balance has also been updated.
    let luckyAccountBalance = await valor.balanceOf.call(accounts[1]);
    assert.equal(luckyAccountBalance.toNumber(), amount);
  });

  /**
   * let's make a small test to make sure we can burn correctly tokens.
   * at this point, accounts[1] has balance
   */
   it("should burn tokens.", async () => {
     let burnValue = 5000000;
     let account = accounts[1];

     // we capture account balance and total supply as this will be decreased.
     let initialBalance = await valor.balanceOf.call(account);
     let initialTotalSupply = await valor.totalSupply.call();

     //now lets burn it.
     await valor.burn.sendTransaction(burnValue, {from: account});

     //now lets check balance and total supply
     let burnedBalance = await valor.balanceOf.call(account);
     let totalSupply = await valor.totalSupply.call();

     assert.equal(initialBalance.toNumber(), burnedBalance.toNumber() + burnValue);
     assert.equal(initialTotalSupply.toNumber(), totalSupply.toNumber() + burnValue);
   });

  /**
   * let's make a small test to burn more tokens than your balance
   */
   it("shouldn't burn more tokens than his balance", async () => {
     let account = accounts[1];

     // we capture account balance and total supply as this will be decreased.
     let initialBalance = await valor.balanceOf.call(account);
     let initialTotalSupply = await valor.totalSupply.call();

     //now lets burn the balance + 1000.
     await valor.burn.sendTransaction(initialBalance + 10000, {from: account}).should.be.rejected;

   });

   /**
    * now we will test the burnFrom method that allows another account to burn
    * tokens from another account
    */
    it("Should allow owner to burn tokens in behalf of another account.", async () => {
      let burnValue = 5000000;
      let owner = accounts[0];
      let account = accounts[1]; // this account still has positive balance

      // we authorize owner to transfer or burn on behalf of account.
      await valor.approve.sendTransaction(owner, burnValue, {from: account});

      // we capture account balance and total supply as this will be decreased.
      let initialBalance = await valor.balanceOf.call(account);
      let initialTotalSupply = await valor.totalSupply.call();

      //now lets burn it.
      await valor.burnFrom.sendTransaction(account, burnValue, {from: owner});

      //now lets check balance and total supply
      let burnedBalance = await valor.balanceOf.call(account);
      let totalSupply = await valor.totalSupply.call();

      assert.equal(initialBalance.toNumber(), burnedBalance.toNumber() + burnValue);
      assert.equal(initialTotalSupply.toNumber(), totalSupply.toNumber() + burnValue);
    });



});
