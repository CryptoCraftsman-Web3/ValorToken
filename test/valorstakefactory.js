// not nice import, useful to have some helper functions available
// especially .shoud.be.rejected interface
//waiting for open-zeppelin helpers.js to remove babel dependencies


var util = require ("./util.js");
var BigNumber      = util.BigNumber;

const day = 86400; 

const ValorToken = artifacts.require('./ValorToken.sol');
const ValorTimelock = artifacts.require("./ValorTimelock.sol");
const ValorStakeFactory = artifacts.require("./ValorStakeFactory.sol");

const VALOR = 1e18;
const holdings = 10000 * VALOR;


contract('ValorStakeFactory', async ([companyWallet,someUser,anotherUser]) => {


    beforeEach(async () => {
     //lets build a VALOR token with all funds allocated to companyWallet
     this.token       = await ValorToken.new(companyWallet, companyWallet, companyWallet);
     this.factory     = await ValorStakeFactory.new(this.token.address);
    });

    it("check factory is built with proper parameters", async () => {
     //console.log("test");
     (await this.factory.token.call()).should.be.equal(this.token.address);
     (await this.factory.owner.call()).should.be.equal(companyWallet);

    });


    it("check stake is built with proper parameters", async () => {
     //console.log("test");
     await this.factory.createStake.sendTransaction(someUser,1 * day).should.be.fulfilled;
     let stakeAddress = await this.factory.stakes.call(someUser);
     console.log("stake addr "+ stakeAddress);
     let stake = await ValorTimelock.at(stakeAddress);
     (await stake.beneficiary.call()).should.be.equal(someUser);

    });


    it("factory cannot be used by anyone", async () => {
        await this.factory.createStake.sendTransaction(someUser,1 * day, {from:anotherUser}).should.be.rejected;
    });

    it("same user can have multiple different stakes", async () => {
        
    });



});