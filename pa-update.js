#!/usr/bin/env node

const getConfig = require('./lib/getConfig')
const shell = require('shelljs')

const config = getConfig()

const { frontend } = config.local.location
shell.exec(`cd ${frontend} && npm-check-updates -u --packageFile package.json && npm update`, (code, stdout, stderr) => {
  console.log(code)
  console.log(stdout)
  console.log(stderr)
})
