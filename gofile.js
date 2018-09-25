const go = require('go')
const { sep } = require('path')

go.fs.readdirSync('scripts')
  .filter(name => name.toLowerCase().endsWith('.cmd.js'))
  .map(name => require(`.${sep}scripts${sep}${name}`))
  .forEach(command => go.registerCommand(command))
