# MultiSig test

This branch won't reach master because it is a test of the multiSig wallet features.

## Test cases

The following test cases are supported:

1) Multisig wallet with three approvers and a requirement of 2 confirmations to execute.

2) Send SmartValor tokens to account and verify execution after 2 confirmations.

3) Verification of failure when a non approver tries to confirm a pending transaction.

4) Transaction not executed if the MultiSig wallet doesn't have enough balance to execute transfer.

_TODO we might need to add a new method to retrieve execution status of transaction._

## Execution

run
```truffle develop```
to start internal development blockchain.

and then
```test```
to start all tests.
