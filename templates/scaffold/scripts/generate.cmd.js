const go = require('go')
const { join, sep } = require('path')

module.exports = {
  name: 'generate',
  options: {
    template: { type: String, alias: 't', default: 'custom' }
  },
  async callback ({ args }) {
    const examples = await go.fs.readdir(join(__dirname, '..', 'templates', 'examples'))

    const isCorrectExampleSet = args.template && examples.includes(args.template)

    const exampleName = isCorrectExampleSet ? args.template : await go.ask({
      message: 'Choose an example to generate:',
      choices: examples
    })

    await go.processTemplates(
      {},
      { cwd: join(__dirname, '..', 'templates', 'examples', exampleName) },
      process.cwd() + sep
    )
  }
}
