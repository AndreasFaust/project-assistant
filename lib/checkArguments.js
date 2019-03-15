const chalk = require('chalk')

function message (args) {
  const argString = args.map(arg => {
    return arg.join(' | ')
  })
  const argText = args.length === 1
    ? 'Add 1 Argument \n:'
    : `Add ${args.length} Arguments in this order: \n`

  return argText + argString.join('\n')
}

function argsAreValid (args, defaultArgs) {
  for (let i = 0, j = defaultArgs.length; i < j; i++) {
    if (!defaultArgs[i].includes(args[i])) {
      return false
    }
  }
  return true
}

module.exports = function (args, defaultArgs) {
  if (args.length !== defaultArgs.length || !argsAreValid(args, defaultArgs)) {
    console.error(chalk.magenta(message(defaultArgs)))
    process.exit(1)
  }
}
