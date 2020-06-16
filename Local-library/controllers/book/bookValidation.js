const { body } = require('express-validator');

const validateTitle = body('title', 'Title must not be empty.')
  .trim()
  .isLength({min: 1})
  .escape();

const validateAuthor = body('author', 'Author must not be empty.')
  .trim()
  .isLength({min: 1})
  .escape();

const validateSummary = body('summary', 'Summary must not be empty.')
  .trim()
  .isLength({min: 1})
  .escape();

const validateISBN = body('isbn', 'ISBN must not be empty.')
  .trim()
  .isLength({min: 1})
  .escape();

const bookValidation = [
  validateTitle,
  validateAuthor,
  validateSummary,
  validateISBN,
];  

module.exports = bookValidation;