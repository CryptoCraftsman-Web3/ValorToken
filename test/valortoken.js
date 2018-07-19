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

});
