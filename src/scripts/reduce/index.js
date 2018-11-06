const Promise = require('bluebird');
const signale = require('signale');

const _ = require('lodash');

const fs = require('../../utils/fs-promise');

const { readFile } = require('../../utils/stream');

const outputFolder = 'reduce';

module.exports = (folder = './data') => {
  fs.readdirAsync(folder)
    .then(_filenames => {
      const filenames = _filenames.filter(value => value.includes('.json'));
      return Promise.all(
        filenames.map(value => readFile(`${folder}/${value}`, 'utf8'))
      );
    })
    .then(async files => {
      const combineData = [];
      files.forEach(file => {
        const json = JSON.parse(file);
        json.forEach(value => combineData.push(value));
      });

      const isDirCreated = await fs.existsAsync(outputFolder);
      if (!isDirCreated) await fs.mkdirAsync(outputFolder);

      let iterate = 0;
      const promises = _.chunk(combineData, 1000).map((value, index) => {
        const temp = value.map(val => {
          iterate += 1;
          return {
            id: iterate,
            review: val,
          };
        });

        return fs.writeFileAsync(
          `${outputFolder}/${index}.json`,
          JSON.stringify(temp, null, 4),
          'utf8'
        );
      });

      await Promise.all(promises)
        .then(() => signale.success('File has been written!'))
        .catch(err => signale.fatal(err));
    });
};
