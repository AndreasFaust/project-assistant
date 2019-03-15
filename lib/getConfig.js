const files = require('./files')
const chalk = require('chalk')
const fs = require('fs')

module.exports = () => {
  const pwd = files.getCurrentDirectoryBase()
  if (!files.fileExists(pwd + '/pa-config.json')) {
    console.error(
      chalk.magenta(
        'No pa-config.json!'
      )
    )
    process.exit(1)
  }
  // return fs.readFileSync(pwd + '/pa-config.json', 'utf8')
  return require(pwd + '/pa-config.json')
}
