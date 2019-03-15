#!/usr/bin/env node

const program = require('commander')
const checkArguments = require('./lib/checkArguments')

program.parse(process.argv)

const args = program.args

const defaultArgs = [
  ['push', 'pull'],
  ['prod', 'stag', 'live']
]

checkArguments(args, defaultArgs)

console.log(args)
