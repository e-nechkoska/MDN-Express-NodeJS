const Author = require('../../models/author');
const validateAuthor = require('./authorValidation');

const { validationResult } = require('express-validator');

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
  validateAuthor,
  createAuthorMiddleware
];

module.exports = {
  authorCreateGet,
  authorCreatePost
};