const Promise = require('bluebird');
const signale = require('signale');

const path = require('path');

// const _ = require('lodash');
const absa = require('../../utils/absa');

const fs = require('../../utils/fs-promise');

const outputFolder = 'absa_out';
const inputFolder = 'reduce_out';

module.exports = async (file) => {

  signale.watch('READING Reduced File');
  const combineData = await fs.readFileAsync(path.resolve(`${inputFolder}/${file}`), 'utf8').then((data) => JSON.parse(data));
  signale.success('READING Reduced File SUCCEED!');

  const isDirCreated = await fs.existsAsync(outputFolder);
  if (!isDirCreated) await fs.mkdirAsync(outputFolder);

  try {
    signale.watch('GETTING ABSA Data');
    const combineDataABSA = [];
    await combineData.reduce(
      (promise, chunk) =>
        promise.then(() => Promise.all([
            Promise.delay(1250),
            absa(chunk.review).then(val => {
              signale.debug(`GETTING ABSA Data for Review ${chunk.id}`);
              combineDataABSA.push({
                id: chunk.id,
                ...val,
              });
            }),
          ])),
      Promise.resolve()
    );

    await fs.writeFileAsync(
      path.resolve(`./${outputFolder}/${file}`),
      JSON.stringify(combineDataABSA, null, 4),
      'utf8'
    );

    signale.success('GETTING ABSA Data SUCCEED!');
  } catch(err) {
    signale.fatal(err);
  }
};
