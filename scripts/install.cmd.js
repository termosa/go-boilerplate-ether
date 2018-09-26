const go = require('go')
const spawn = require('cross-spawn')
const { Spinner } = require('clui')
const { join, sep } = require('path')

const NONE = 'none'

const removeBunch = entries => Promise.all(entries.map(e => go.remove(e)))

const listExamples = () => go.fs.readdirSync(join('templates', 'examples'))

const installDeps = () => new Promise((resolve, reject) => {
  const spinner = new Spinner('Installing dependencies', ['⣾','⣽','⣻','⢿','⡿','⣟','⣯','⣷']);
  spinner.start()
  spawn('npm', ['install'])
    .on('exit', code => {
      spinner.stop()
      if (code < 2) resolve()
      else reject()
    })
})

const collectData = () => go.ask([
  { name: 'deploy',
    type: 'confirm',
    message: 'Do you have credentials to deploy your application?',
    default: false },
  { name: 'link',
    message: 'Enter node link (optional):',
    when: ({ deploy }) => deploy },
  { name: 'mnemonic',
    message: 'Enter mnemonic:',
    when: ({ deploy }) => deploy },
  { name: 'account',
    message: 'Enter account address (optional):',
    when: ({ deploy }) => deploy },
  { name: 'gas',
    message: 'Enter gas limit:',
    default: 1000000 },
  { name: 'example',
    message: 'Choose example project to start with (optional):',
    choices: [NONE, ...listExamples()],
    default: NONE }
])

module.exports = {
  name: 'install',
  async callback () {
    const options = await collectData()

    // prepare
    await removeBunch(['package.json', 'package-lock.json', 'node_modules', 'scripts', '.gitignore', '.git'])

    const destination = process.cwd() + sep
    await go.processTemplates(options, { cwd: join('templates', 'scaffold') }, destination)
    if (options.example !== NONE) {
      await go.processTemplates({}, { cwd: join('templates', 'examples', options.example) }, destination)
    }

    await installDeps()

    // cleanup
    await removeBunch([join('templates', 'scaffold')])

    console.log('Generation is complete!')
  }
}
