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

        let transactionId = await multisigInstance.submitTransaction(valorToken.address, 0, transferEncoded, {from: accounts[0]});
        console.log(transactionId)

        // todo fix this call
        const executedTransactionId = await multisigInstance.confirmTransaction(0, {from: accounts[1]});


        // Check that transaction has been executed
        assert.ok(transactionId.equals(executedTransactionId))

          // Check that the transfer has actually occured
        assert.equal(1000000, await valorToken.balanceOf.call(accounts[1]))
    })
})
