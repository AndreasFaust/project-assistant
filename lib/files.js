const fs = require('fs')
const path = require('path')
const Rsync = require('rsync')
const shell = require('shelljs')

module.exports = {
  ssh: ({
    ssh: { host, user },
    commands
  }) => {
    return new Promise((resolve, reject) => {
      try {
        shell.exec(`ssh ${user}@${host} "${commands}"`, (code, stdout, stderr) => {
          // console.log(code)
          // console.log(stdout)
          resolve()
        })
      } catch (err) {
        console.log(err)
        reject()
      }
    })
  },
  rsync: ({ ssh: { host, user }, source, dest, excludeFile }) => {
    var rsync = new Rsync()
      .shell('ssh')
      // flags:
      // https://www.digitalocean.com/community/tutorials/how-to-use-rsync-to-sync-local-and-remote-directories-on-a-vps
      // a: archive
      // v: verbose
      // P: progressbar
      // z: compression
      .flags('avz')
      .delete()
      .source(source)
      .destination(`${user}@${host}:${dest}`)

    if (excludeFile) {
      rsync.set('exclude-from', excludeFile)
    }
    return new Promise((resolve, reject) => {
      rsync.execute(
        function (error) {
          if (error) console.log(error)
          console.log('File transfer finished!')
          resolve() // we're done
        }, function (data) {
          // console.log(data.toString('utf-8')) // do things like parse progress
        }, function (data) {
          reject(data.toString('utf-8')) // do things like parse error output
        }
      )
    })
  },
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
