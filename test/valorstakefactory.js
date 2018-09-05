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


    it.only("stake created by company wallet on behalf of someUser", async () => {

     //someUser approves 5000 VALOR allowance to factory
     await this.token.approve(this.factory.address, 5000 * VALOR, {from:someUser});
     
     //company creates stake (eg. from platform) on behalf of someUser
    let tx = await this.factory.createStake.sendTransaction(someUser,
                                                    1 * day, 
                                                    5000 * VALOR, 
                                                    {from: companyWallet});


    let res = await web3.eth.getTransactionReceipt(tx);
    

    });


    it("do not create a stake without tokens staked", async () => {
        await this.factory.createStake.sendTransaction(someUser,1 * day, {from:anotherUser}).should.be.rejected;
    });

    it("same user can have multiple different stakes", async () => {
        
    });







});