const AYLIENTextAPI = require('aylien_textapi');
const config = require('config');

module.exports = new AYLIENTextAPI({
  application_id: config.get('aylien').application_id,
  application_key: config.get('aylien').application_key,
});
