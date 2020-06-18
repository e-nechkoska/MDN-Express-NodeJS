const { body } = require('express-validator');

const validateFirstName = body('firstName')
  .isLength({ min: 1 })
  .trim()
  .withMessage('First name must be specified.')
  .isAlphanumeric()
  .withMessage('First name has non-alphanumeric characters.')
  .escape();

const validateFamilyName = body('familyName')
  .isLength({ min: 1 })
  .trim()
  .withMessage('Family name must be specified.')
  .isAlphanumeric()
  .withMessage('Family name has non-alphanumeric characters.')
  .escape();

const validateDateOfBirth = body('dateOfBirth', 'Invalid date of birth')
  .optional({ checkFalsy: true })
  .isISO8601()
  .escape();

const validateDateOfDeath = body('dateOfDeath', 'Invalid date of death')
  .optional({ checkFalsy: true })
  .isISO8601()
  .escape();

const validateAuthor = [
    validateFirstName,
    validateFamilyName,
    validateDateOfBirth,
    validateDateOfDeath
];

module.exports = validateAuthor;