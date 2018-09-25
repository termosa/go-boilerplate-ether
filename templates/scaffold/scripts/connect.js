const HDWalletProvider = require('truffle-hdwallet-provider')
const Web3 = require('web3')

const connect = (link, mnemonic) => {
  const provider = new HDWalletProvider(mnemonic, link)
  return new Web3(provider)
}

module.exports = connect
