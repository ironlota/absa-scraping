const Promise = require('bluebird');
const signale = require('signale');

const _ = require('lodash');

const fs = require('../../utils/fs-promise');

const outputFolder = 'reduce_out';

module.exports = (folder = './data') => {
  fs.readdirAsync(folder)
    .then(_filenames => {
      const filenames = _filenames.filter(value => value.includes('.json'));
      // return filenames.map(value => fs.readFileAsync(`${folder}/${value}`, 'utf8'));
      return filenames.map(value => `${folder}/${value}`);
    })
    .then(async files => {
      const combineData = [];

      signale.watch('REDUCING Data');
      await files.reduce(
        (promise, file) =>
          promise.then(() => fs.readFileAsync(file, 'utf8').then((data) => {
                const json = JSON.parse(data);
                json.forEach(value => combineData.push(value.replace(/[&|;|\\|$|%|@|<|>|(|)|+|,]/gi, '').replace(/\r?\n|\r/gi, ' ').replace(/"/gi, '\'')));
              }))
        , Promise.resolve()
      );
      signale.success('REDUCING Data SUCCEED!');

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
