const compile = require('./compile')

const deploy = async (connection, contract, from, gas, arguments) => {
  const { interface, bytecode } = compile(contract)
  return await new connection.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments })
    .send({ gas, from })
}

module.exports = deploy
