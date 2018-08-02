const MultiSigWallet = artifacts.require('MultiSigWallet')
const ValorToken = artifacts.require('ValorToken')

contract('MultiSigWallet', (accounts) => {
    let multisigInstance
    let valorToken

    beforeEach(async () => {
      multisigInstance = await MultiSigWallet.deployed();
      valorToken = await ValorToken.deployed();
      assert.ok(multisigInstance)
      assert.ok(valorToken);
    })

    it('Transfers SmartValor tokens after 2 confirmations', async () => {
        // Issue tokens to the multisig address
        const issueResult = await valorToken.transfer(multisigInstance.address, 1000000, {from: accounts[0]})

        // Encode transfer call for the multisig
        const transferEncoded = valorToken.contract.transfer.getData(accounts[1], 1000000)

        // we perform an execution in blockchain but don't store the result to get the transactionId
        // then we perform the real execution and submit the transaction
        let transactionId = await multisigInstance.submitTransaction.call(valorToken.address, 0, transferEncoded, {from: accounts[0]});
        await multisigInstance.submitTransaction(valorToken.address, 0, transferEncoded, {from: accounts[0]});

        // let's make sure we already have one confirmation for this transaction
        let confirmationCount = await multisigInstance.getConfirmationCount.call(transactionId);
        assert.equal(confirmationCount.toNumber(), 1);

        // here we still don't have enought confirmations, so balance should be empty
        assert.equal(0, await valorToken.balanceOf.call(accounts[1]))

        // By adding a new confirmation from accountOne, we are performing the execution of the transfer
        await multisigInstance.confirmTransaction(transactionId, {from: accounts[1]});

        // Check that the transfer has actually occured
        assert.equal(1000000, await valorToken.balanceOf.call(accounts[1]))
    })
})
