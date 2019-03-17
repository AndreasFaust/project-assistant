#!/usr/bin/env node

const getConfig = require('./lib/getConfig')
const shell = require('shelljs')
const program = require('commander')
const checkArguments = require('./lib/checkArguments')
const { ssh, rsync } = require('./lib/files')
const fs = require('fs-extra')
// const NodeSSH = require('node-ssh')
// const SSH = new NodeSSH()

program
  .version('0.0.1')
  .option('-d, --delete', 'delete existing .cache- und build-folder')
  .parse(process.argv)

const args = program.args
const defaultArgs = [
  ['local', 'prod', 'stag', 'live'],
  ['-d']
]

checkArguments(args, defaultArgs)

const config = getConfig()
const { location } = config.local

if (program.delete) {
  fs.remove(location.public)
  fs.remove(location.cache)
}

async function delpoyBuild (remote, locLocal) {
  // copy remote public, for faster rsync upload!
  await ssh({
    ssh: remote.ssh,
    commands: `cp -ar ${remote.location.public} ${remote.location.public}-temp`
  })
  // upload public as public-temp
  const temp = `${locLocal.public}-temp`
  shell.cp('-R', locLocal.public, temp)
  await rsync({
    ssh: remote.ssh,
    source: temp,
    dest: remote.location.frontend
  })
  // upload new cache
  await rsync({
    ssh: remote.ssh,
    source: locLocal.cache,
    dest: remote.location.frontend
  })
  // name public to public-old
  await ssh({
    ssh: remote.ssh,
    commands: `mv ${remote.location.public} ${remote.location.public}-old`
  })
  // name public-temp to public
  await ssh({
    ssh: remote.ssh,
    commands: `mv ${remote.location.public}-temp ${remote.location.public}`
  })
  // delete public-old
  await ssh({
    ssh: remote.ssh,
    commands: `rm -rf ${remote.location.public}-old`
  })
  // delete local public-temp
  shell.rm('-rf', temp)
}

// delpoyBuild(config[args[0]], location)

shell.exec(`cd ${location.frontend} && gatsby build`, function (code, stdout, stderr) {
  console.log('Exit code:', code)
  console.log('Program output:', stdout)
  if (stderr) {
    console.log('Program stderr:', stderr)
    return
  }
  if (args[1] !== 'local') delpoyBuild(config[args[0]], location)
})
