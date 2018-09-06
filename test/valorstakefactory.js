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

     //lets give some tokens to someUser
     await this.token.transfer.sendTransaction(someUser, 10000 *VALOR);
    });

    it("check factory is built with proper parameters", async () => {
     //console.log("test");
     (await this.factory.token.call()).should.be.equal(this.token.address);
     (await this.factory.owner.call()).should.be.equal(companyWallet);

    });


    it("company wallet creates stakes on behalf of someUser", async () => {

     //someUser approves 5000 VALOR allowance to factory
     await this.token.approve(this.factory.address, 5000 * VALOR, {from:someUser});
         
     //company creates stake (eg. from platform) on behalf of someUser
     let tx = await this.factory.createStake.sendTransaction(someUser,
                                                        1 * day, 
                                                        5000 * VALOR, 
                                                        {from: companyWallet});


     let deployTime  = await util.latestTime(); 

     let event = this.factory.StakeCreated();
     
     var stakeAddr;
     var atStake;


    function watchEvent(evt){
        return new Promise(function(resolve,reject){
            evt.watch(function(err,res){
                resolve({stake: res.args["stake"], 
                         atStake: res.args["atStake"]});
                evt.stopWatching();
            });
        });
    }

    var args = await watchEvent(event);

    

    let stake = await ValorTimelock.at(args['stake']);

    let beneficiary = await stake.beneficiary.call();
    beneficiary.should.be.equal(someUser);

    let amountStaked = await this.token.balanceOf(stake.address);
    amountStaked.should.be.bignumber.equal(5000*VALOR);

    let releaseTime = await stake.releaseTime.call();
    releaseTime.should.be.bignumber.equal(deployTime + 1*day);

    let owner = await stake.owner.call();
    owner.should.be.equal(companyWallet);


console.log(beneficiary);

    });


    it("nobody can create a stake without tokens at stake", async () => {
        await this.factory.createStake.sendTransaction(someUser,
                                                        1 * day, 
                                                        5000 * VALOR, 
                                                        {from: companyWallet})
        .should.be.rejected;
    });


    it("everyone (eg. anotherUser) can create a stake on behalf of someUser", async () => {
        //someUser approves 5000 VALOR allowance to factory
        await this.token.approve(this.factory.address, 5000 * VALOR, {from:someUser});
        await this.factory.createStake.sendTransaction(someUser,
                                                        1 * day, 
                                                        5000 * VALOR, 
                                                        {from: anotherUser})
        .should.be.fulfilled;
    });



    it("if tokens are insufficient the stake is not created", async () => {
        //someUser approves 5000 VALOR allowance to factory
        await this.token.approve(this.factory.address, 4999 * VALOR, {from:someUser});
        await this.factory.createStake.sendTransaction(someUser,
                                                        1 * day, 
                                                        5000 * VALOR, 
                                                        {from: anotherUser})
        .should.be.rejected;
    });    

    it("an account someUser can have multiple different stakes", async () => {
        //someUser approves 5000 VALOR allowance to factory
        await this.token.approve(this.factory.address, 5000 * VALOR, {from:someUser});

        await this.factory.createStake.sendTransaction(someUser,
                                                        1 * day, 
                                                        2000 * VALOR, 
                                                        {from: companyWallet})
        .should.be.fulfilled;

        await this.factory.createStake.sendTransaction(someUser,
                                                        10 * day, 
                                                        3000 * VALOR, 
                                                        {from: companyWallet})
        .should.be.fulfilled;

    });







});