#!/usr/bin/env node

const { exec, spawn, fork } = require('child_process')
const getConfig = require('./lib/getConfig')
var shell = require('shelljs')

const config = getConfig()

const { frontend } = config.local.location

shell.exec(`cd ${frontend} && gatsby develop`)
