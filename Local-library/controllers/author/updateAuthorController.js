const Author = require('../../models/author');
const validateAuthor = require('./authorValidation');

const { validationResult } = require('express-validator');

const renderAuthorUpdate = (res, author, errors = null) => {
  res.render('author_form', {
    title: 'Update Author',
    author: author,
    errors: errors
  });
};

const authorUpdateGet = function (req, res, next) {
  Author.findById(req.params.id).exec().then(author => {
    if(author === null) {
      let error = new Error('Author not found');
      error.status = 404;
      return next(error);
    }
    renderAuthorUpdate(res, author);
  }).catch(error => next(error))
};

const updateAuthorMiddleware = (req, res, next) => {
  const errors = validationResult(req);

  let author = new Author({
    firstName: req.body.firstName,
    familyName: req.body.familyName,
    dateOfBirth: req.body.dateOfBirth,
    dateOfDeath: req.body.dateOfDeath,
    _id: req.params.id
  });

  if(!errors.isEmpty()) {
    Author.find().exec().then(authors => {
      renderAuthorUpdate(res, authors, errors.array());
    }).catch(error => next(error));
  } else {
    Author.findByIdAndUpdate(req.params.id, author).exec()
    .then(updatedAuthor => {
      res.redirect(updatedAuthor.url);
    }).catch(error => next(error));
  }
};

const authorUpdatePost = [
  validateAuthor,
  updateAuthorMiddleware  
];

module.exports = {
  authorUpdateGet,
  authorUpdatePost
};