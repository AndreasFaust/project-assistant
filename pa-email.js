#!/usr/bin/env node

const program = require('commander')
const checkArguments = require('./lib/checkArguments')
const getConfig = require('./lib/getConfig')
const forward = require('./components/emails/forward')

program.parse(process.argv)

const args = program.args
const defaultArgs = [
  ['forward'],
  ['prod', 'stag', 'live']
]

checkArguments(args, defaultArgs)
const config = getConfig()

switch (args[0]) {
  case 'forward': forward(args[1], config)
}
