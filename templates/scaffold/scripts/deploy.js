const compile = require('./compile')

const deploy = async (connection, contract, fromAccount, maxGas) => {
  const { interface, bytecode } = compile(contract)
  return await new connection.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: [] })
    .send({ gas: maxGas, from: fromAccount })
}

module.exports = deploy
