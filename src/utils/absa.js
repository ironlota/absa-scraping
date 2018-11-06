const Promise = require('bluebird');

const aylien = require('./aylien');

module.exports = (text, domain = 'hotels') =>
  new Promise((resolve, reject) => {
    aylien.aspectBasedSentiment(
      {
        domain,
        text,
      },
      (err, response, rateLimits) => {
        if (err) reject(err);

        resolve({
          response,
          limits: rateLimits,
        });
      }
    );
  });
