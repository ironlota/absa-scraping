const Promise = require('bluebird');

const aylien = require('./aylien');

module.exports = (text, domain = 'hotels') =>
  new Promise((resolve, reject) => {
    aylien.aspectBasedSentiment(
      {
        domain,
        text,
      },
      async (err, response, rateLimits) => {
        if (err) reject(err);

        await Promise.delay(500);

        resolve({
          response,
          limits: rateLimits,
        });
      }
    );
  });
