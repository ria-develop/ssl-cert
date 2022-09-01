#!/usr/bin/env node

require('dotenv').config();
const chalk = require('chalk');

let argv = require('yargs/yargs')(process.argv.slice(2))
  .commandDir('../lib')
  .demandCommand(1, chalk.red('Please chose a command'))
  .argv;
