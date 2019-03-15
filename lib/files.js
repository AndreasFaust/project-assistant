const fs = require('fs')
const path = require('path')

module.exports = {
  getCurrentDirectoryBase: () => {
    return path.resolve(process.cwd())
  },
  fileExists: (filePath) => {
    try {
      return fs.statSync(filePath).isFile()
    } catch (err) {
      return false
    }
  },
  directoryExists: (filePath) => {
    try {
      return fs.statSync(filePath).isDirectory()
    } catch (err) {
      return false
    }
  }
}
