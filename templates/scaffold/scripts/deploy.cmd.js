const { join } = require('path')

module.exports = {
  name: 'deploy',
  async callback ({ args }) {
    const config = require('../config.json')
    if (!config.account || !config.link || !config.mnemonic) {
      throw 'Make sure you have set `account`, `link` and `mnemonic` in config.json'
    }

    const contracts = go.fs.readdir(join('..', 'contracts'))
      .filter(name => name.endsWith('.sol'))
      .map(name => name.slice(0, -4))

    const isCorrectContractSet = args._[1] && contracts.includes(args._[1])

    const contractName = isCorrectContractSet ? args._[1] : await go.ask({
      message: 'Choose contract to deploy:',
      choices: contracts
    })

    //const accounts = await web3.eth.getAccounts()
    console.log('Attempting to deploy', config.account)

    const connect = require('./connect')
    const deploy = require('./deploy')

    const conn = connect(config.link, config.mnemonic)
    const contract = deploy(conn, contractName, config.account, config.gas)

    console.log('Contract is deployed to', contract.options.address)
  }
}
