const fs = require('fs');
const Promise = require('bluebird');

const es = require('event-stream');

const readFile = file =>
  new Promise((resolve, reject) => {
    const jsonRead = fs.createReadStream(file, {
      encoding: 'utf8',
    });

    const array = [];

    jsonRead
      .pipe(
        es.mapSync(data => {
          array.push(data);
        })
      )
      .on('error', err => {
        reject(err);
      })
      .on('end', () => {
        resolve(array);
      });
  });

module.exports = {
  readFile,
};
