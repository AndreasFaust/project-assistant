const chalk = require('chalk')

function getDefaultRequired (defaultArgs) {
  return defaultArgs.filter(arg => !arg.find(a => a[0] === '-'))
}
function getDefaultOptions (defaultArgs) {
  return defaultArgs.filter(arg => arg.find(a => a[0] === '-'))
}

function message (defaultArgs) {
  const defaultRequired = getDefaultRequired(defaultArgs)
  const defaultOptions = getDefaultOptions(defaultArgs)
  const argString = defaultRequired.map(arg => {
    return arg.join(' | ')
  })
  const argText = defaultRequired.length === 1
    ? 'Add 1 Argument: \n'
    : `Add ${defaultRequired.length} Arguments in this order: \n`

  const opionsText = defaultOptions.length && `Options: ${defaultOptions}`
  return argText + argString.join('\n') + '\n' + opionsText
}

function argsAreValid (args, defaultArgs) {
  for (let i = 0, j = defaultArgs.length; i < j; i++) {
    if (!defaultArgs[i].includes(args[i])) {
      return false
    }
  }
  return true
}

function argsLengthIsValid (argsRequired, defaultRequired) {
  if (argsRequired.length === defaultRequired.length) return true
  return false
}

function exitProcess (defaultArgs) {
  console.error(chalk.magenta(message(defaultArgs)))
  process.exit(1)
}

module.exports = function (args, defaultArgs) {
  const argsRequired = args.filter(arg => arg[0] !== '-')
  const defaultRequired = getDefaultRequired(defaultArgs)

  if (!argsLengthIsValid(argsRequired, defaultRequired)) exitProcess(defaultArgs)
  if (!argsAreValid(argsRequired, defaultRequired)) exitProcess(defaultArgs)
}
