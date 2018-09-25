const go = require('go')
const { join } = require('path')

const NONE = 'none'

const removeBunch = entries => Promise.all(entries.map(e => go.remove(e)))

const collectData = () => go.ask([
  { name: 'link',
    message: 'Enter node link (optional):' },
  { name: 'mnemonic',
    message: 'Enter mnemonic:',
    when: ({ link }) => link },
  { name: 'account',
    message: 'Enter account address (optional):',
    when: ({ link }) => link },
  { name: 'gas',
    message: 'Enter gas limit:',
    default: 1000000 },
  { name: 'example',
    message: 'Choose example project to start with (optional):',
    choices: [NONE],
    default: NONE }
])

module.exports = {
  name: 'install',
  async callback () {
    const options = await collectData()
    //
    // prepare
    await removeBunch(['package.json', 'package-lock.json', 'node_modules', 'scripts', '.gitignore'])

    await go.processTemplates(options, { cwd: join('templates', 'scaffold') }, process.cwd())

    // cleanup
    await removeBunch([join('templates', 'scaffold')])
  }
}
