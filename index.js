#!/usr/bin/env node

'use strict'

var program = require('commander')

program
  .version('0.1.0')
  .command('dev', 'start developing')
  .command('update', 'update frontend packages')
  .command('build [location]', 'Gatsby build')
  .command('deploy [action] [location]', 'deploy code')
  .command('db [action] [location]', 'handle database')
  .command('files [action] [location]', 'handle files')
  .command('setup [action] [location]', 'setup server')
  .command('email [action] [location]', 'setup email')
  .parse(process.argv)
