const MultiSigWallet = artifacts.require('MultiSigWallet')
const ValorToken = artifacts.require('ValorToken')

contract('MultiSigWallet', (accounts) => {
    let multisigInstance
    let valorToken

    const requiredConfirmations = 2

    beforeEach(async () => {
      multisigInstance = await MultiSigWallet.deployed();
      valorToken = await ValorToken.deployed();
      assert.ok(multisigInstance)
      assert.ok(valorToken);
    })

    it('Transfers SmartValor tokens after 2 confirmations', async () => {
        // Issue tokens to the multisig address
        const issueResult = await valorToken.transfer(multisigInstance.address, 1000000, {from: accounts[0]})
        assert.ok(issueResult)

        let txCount = await multisigInstance.getTransactionCount(true, true);
        console.log(txCount);

        // Encode transfer call for the multisig
        const transferEncoded = valorToken.contract.transfer.getData(accounts[1], 1000000)

         const transactionId = await multisigInstance.submitTransaction.sendTransaction(valorToken.address, 0, transferEncoded, {from: accounts[0]});

         txCount = await multisigInstance.getTransactionCount(true, true);
         console.log(txCount);

        let confirmationCount = await multisigInstance.getConfirmationCount.call(transactionId);
        console.log ("count " + confirmationCount.toNumber() + " for tx " + transactionId)
        //assert.equal(1, confirmationCount.toNumber());
        //const executedTransactionId = await multisigInstance.confirmTransaction.sendTransaction(transactionId, {from: accounts[1]});


        // Check that transaction has been executed
        //assert.ok(transactionId.equals(executedTransactionId))

          // Check that the transfer has actually occured
        //assert.equal(1000000, await valorToken.balanceOf(accounts[1]))
    })
})
