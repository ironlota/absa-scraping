require('dotenv').config();

const program = require('commander');

// const path = require('path');

// const chalk = require('chalk');
const signale = require('signale');

const _ = require('lodash');

const pkg = require('../package.json');

const scrape = require('./scripts/raw');
const asba = require('./scripts/absa');
const reduce = require('./scripts/reduce');

const range = val => val.split('..').map(Number);

program
  .version(pkg.version)
  .option('-s, --scrape <a>..<b>', 'Scrape Data', range)
  .option('-a, --absa <a>', 'Analysis Data')
  .option('-r, --reduce', 'Reducing List of File into one file')
  // .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
  .parse(process.argv);

program.scrape = program.scrape || [];

if (program.absa) {
  asba(program.absa);
}

if (!_.isEmpty(program.scrape)) {
  Promise.resolve(scrape('./data', program.scrape[0], program.scrape[1]));
}

if (program.reduce) {
  reduce('./data');
}
