const fs = require('fs')
const solc = require('solc')
const { resolve } = require('path')

const compile = contract => {
  const contractPath = resolve(__dirname, '..', 'contracts', `${contract}.sol`)
  const source = fs.readFileSync(contractPath, 'utf8')
  return solc.compile(source, 1).contracts[`:${contract}`]
}


module.exports = compile
