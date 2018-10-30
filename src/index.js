
const program = require('commander');
// const chalk = require('chalk');
const _ = require('lodash');

const pkg = require('../package.json');

const scrape = require('./scripts/raw');

const range = (val) => val.split('..').map(Number);

program
  .version(pkg.version)
  .option('-s, --scrape <a>..<b>', 'Scrape Data', range)
  // .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
  .parse(process.argv);

program.scrape = program.scrape || [];

if (!_.isEmpty(program.scrape)) {
  Promise.resolve(scrape('./data', program.scrape[0], program.scrape[1]));
}
// console.log('  - %s cheese', program.cheese);