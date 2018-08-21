//not nice import, useful to have some helper functions available
//especially .shoud.be.rejected interface
//waiting for open-zeppelin helpers.js to remove babel dependencies
var util = require ("./util.js");
var BigNumber      = util.BigNumber;

const day = 86400; 

const ValorToken = artifacts.require('./ValorToken.sol');
const ValorTimelock = artifacts.require("./ValorTimelock.sol");

const VALOR = 1e18;
const holdings = 10000 * VALOR;


contract('ValorTimelock', async ([companyWallet,someUser,anotherUser]) => {


  before(async () => {
     //lets build a VALOR token with all funds allocated to companyWallet
     this.token       = await ValorToken.new(companyWallet, companyWallet, companyWallet);

     //a timelock of 12 months
     this.timelock    = await ValorTimelock.new(this.token.address, someUser, companyWallet, 365 * day);

     //put some tokens in the timelocked fund
     await this.token.transfer(this.timelock.address,holdings);
     await this.token.balanceOf(this.timelock).should.be.bignumber.equal(holdings);

  });


  it("anyone fails to release before time", async () => {
    await this.timelock.release.sendTransaction({sender: someUser}).should.be.rejected;
    await this.timelock.release.sendTransaction({sender: companyWallet}).should.be.rejected;
  });


  it("only legit user succeeds to release at time", async () => {
    let releaseTime = util.latestTime + 365 * day;
    util.increaseTimeTo(releaseTime);
    await this.timelock.release.sendTransaction({sender: anotherUser}).should.be.rejected;
    await this.timelock.release.sendTransaction({sender: companyWallet}).should.be.rejected;
    await this.timelock.release.sendTransaction({sender: someUser}).should.be.fulfilled;

    await this.token.balanceOf(this.timelock).should.be.bignumber.equal(0);
    await this.token.balanceOf(someUser).should.be.bignumber.equal(holdings);
  });


  it("only company succeeds to release earlier with emergency pull", async () => {

    await this.timelock.emergencyRelease.sendTransaction({sender: anotherUser}).should.be.rejected;
    await this.timelock.emergencyRelease.sendTransaction({sender: someUser}).should.be.rejected;
    await this.timelock.emergencyRelease.sendTransaction({sender: companyWallet}).should.be.fulfilled;

    await this.token.balanceOf(this.timelock).should.be.bignumber.equal(0);
    await this.token.balanceOf(someUser).should.be.bignumber.equal(holdings);
  });


});