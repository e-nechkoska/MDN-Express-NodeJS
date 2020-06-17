const Author = require('../../models/author');

const { body, validationResult } = require('express-validator');

const renderAuhtorForm = (res, author = {}, errors = null) => {
  res.render('author_form', {
    title: 'Create Author',
    author: author,
    errors: errors
  });
};

const authorCreateGet = function (req, res) {
  renderAuhtorForm(res);
};

// function validateFirstName(req, res, next) {}
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

const createAuthor = (body) => {
  return new Author({
    firstName: body.firstName,
    familyName: body.familyName,
    dateOfBirth: body.dateOfBirth,
    dateOfDeath: body.dateOfDeath
  });
};

const createAuthorMiddleware = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    renderAuhtorForm(res, req.body, errors.array());
  } else {
    let author = createAuthor(req.body);
    author.save()
      .then(() => res.redirect(author.url))
      .catch(error => next(error));
  }
};

const authorCreatePost = [
  validateFirstName,
  validateFamilyName,
  validateDateOfBirth,
  validateDateOfDeath,
  createAuthorMiddleware
];

module.exports = {
  authorCreateGet,
  authorCreatePost
};