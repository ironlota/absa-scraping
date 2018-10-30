const getter = require('../../utils/exception-free');

module.exports = {
  reviews: getter(['hydraReviews', 'reviews']),
  selectedLang: getter(['hydraReviews', 'selectedLanguage']),
};