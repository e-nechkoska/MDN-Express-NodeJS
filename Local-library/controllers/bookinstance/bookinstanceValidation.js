const { body } = require('express-validator');

const validateBody = body('book', 'Book must be specified')
  .trim()
  .isLength({min: 1})
  .escape();

const validateImprint = body('imprint', 'Imprint must be specified')
  .trim()
  .isLength({min: 1})
  .escape();

const validateDueBack = body('dueBack', 'Invalid date')
  .optional({checkFalsy: true})
  .isISO8601()
  .escape();

const validateStatus = body('status')
  .trim()
  .isLength({min: 1})
  .escape();

const validateBookinstance = [
  validateBody,
  validateImprint,
  validateDueBack,
  validateStatus
];

module.exports = validateBookinstance;