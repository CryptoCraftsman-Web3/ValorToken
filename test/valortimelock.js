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


  beforeEach(async () => {
     //lets build a VALOR token with all funds allocated to companyWallet
     this.token       = await ValorToken.new(companyWallet, companyWallet, companyWallet);

     this.deployTime  = await util.latestTime(); 

     //a timelock of 12 months
     this.timelock    = await ValorTimelock.new(this.token.address, someUser, companyWallet, 365 * day);

     //put some tokens in the timelocked fund
     await this.token.transfer(this.timelock.address,holdings);

     this.releaseTime = await this.timelock.releaseTime.call();



  });

  it("check time lock is built with proper parameters", async () => {
     console.log("releaseTime "+this.releaseTime.toNumber());
     console.log("deployTime " +this.deployTime);
     console.log("hold period is");
     console.log((this.releaseTime.toNumber() - this.deployTime) + " seconds");
     console.log((this.releaseTime.toNumber() - this.deployTime)/86400 + " days");

     
     (await this.token.balanceOf(this.timelock.address)).should.be.bignumber.equal(holdings);
     (await this.timelock.beneficiary.call()).should.be.equal(someUser);
     (await this.timelock.owner.call()).should.be.equal(companyWallet);
  });


  it("anyone fails to release before time", async () => {
    await this.timelock.release.sendTransaction({from: someUser}).should.be.rejected;
    await this.timelock.release.sendTransaction({from: companyWallet}).should.be.rejected;
  });





  it("legit user succeeds to get funds at time", async () => {

    await util.increaseTimeTo(this.releaseTime);
    await this.timelock.release.sendTransaction({from: someUser}).should.be.fulfilled;
    (await this.token.balanceOf(this.timelock.address)).should.be.bignumber.equal(0);
    (await this.token.balanceOf(someUser)).should.be.bignumber.equal(holdings);
  });




  it("only company succeeds to release earlier with emergency pull", async () => {

    await this.timelock.emergencyRelease.sendTransaction({from: anotherUser}).should.be.rejected;
    await this.timelock.emergencyRelease.sendTransaction({from: someUser}).should.be.rejected;
    await this.timelock.emergencyRelease.sendTransaction({from: companyWallet}).should.be.fulfilled;

    (await this.token.balanceOf(this.timelock.address)).should.be.bignumber.equal(0);
    (await this.token.balanceOf(someUser)).should.be.bignumber.equal(holdings);
  });


});