/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() {
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>')
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */



module.exports = {
  compilers: {
      solc: {
        version: "0.4.25", // A version or constraint - Ex. "^0.5.0"                           // Can also be set to "native" to use a native solc
        settings: {
          optimizer: {
            enabled: true,
            runs: 200   // Optimize for how many times you intend to run the code
          }          
        }
      }
    },

  networks: {
    development: {
      host: "localhost",
      port: 9545,
      network_id: "*" // Match any network id
    },

    test: {
      host: "localhost",
      port: 9545,
      network_id: "*",
    },
    ropsten: {
      provider: function() {
        const HDWalletProvider=require('truffle-hdwallet-provider');
        const INFURA_KEY="5d7200d2eedb4357b73f2cc14d7891fd";
        const mnemonic  = "to be or not to be that is the question whether tis";
        return new HDWalletProvider(mnemonic, 'https://ropsten.infura.io/v3/'+INFURA_KEY);
      },
      network_id: '3',
      gas: 4500000,
      gasPrice: 100e9,
    },
    rinkeby: {
      provider: function() {
        const HDWalletProvider=require('truffle-hdwallet-provider');
        const INFURA_KEY="5d7200d2eedb4357b73f2cc14d7891fd";
        const mnemonic  = "to be or not to be that is the question whether tis";
        return new HDWalletProvider(mnemonic, 'https://rinkeby.infura.io/v3/'+INFURA_KEY);
      },
      network_id: '4',
      gas: 4500000,
      gasPrice: 100e9,
    }
  }

};
