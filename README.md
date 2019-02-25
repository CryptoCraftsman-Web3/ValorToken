# ValorToken

Detailed specifications of token smart contract are in file

https://github.com/smartvalor/ValorToken/blob/master/VALOR_token_specs.md


# Prerequisites

NodeJS v10.6.0 recommended

Ganache 1.2.1

Truffle v5.0.2


solc compiler is required to be 0.4.25 (strict)


clone the repository locally and then run
```
npm install
```

# Run the testcases

First, launch ganache.

At the moment no live (test or mainnet) deployment is configured and the test must be run against a local Ganache node running on port 9545.

the from a console inside the project directory you should launch the test cases with

```
truffle test
```

If everything is ok, you should see all green ticks.

Cheers
