const Author = require('../../models/author');

const { body, validationResult } = require('express-validator');

const authorUpdateGet = function (req, res, next) {
  Author.findById(req.params.id).exec().then(result => {
    if(result === null) {
      let error = new Error('Author not found');
      error.status = 404;
      return next(error);
    }
    res.render('author_form', {
      title: 'Update Author',
      author: result
    })
  }).catch(error => next(error))
};

const validateFirstName =  body('firstName', 'First name must not be empty.')
  .trim()
  .isLength({min: 1})
  .escape();

const validateFamilyName = body('familyName', 'Family name must not be empty')
  .trim()
  .isLength({min: 1})
  .escape();

const validateDateOfBirth = body('dateOfBirth')
  .escape();

const validateDateOfDeath = body('dateOfDeath')
  .escape();

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
    Author.find().exec().then(result => {
      res.render('author_form', {
        title: 'Update Author',
        author: result,
        errors: errors.array()
      });
    }).catch(error => next(error));
  } else {
    Author.findByIdAndUpdate(req.params.id, author).exec()
    .then(updatedAuthor => {
      res.redirect(updatedAuthor.url);
    }).catch(error => next(error));
  }
};

const authorUpdatePost = [
  validateFirstName,
  validateFamilyName,
  validateDateOfBirth,
  validateDateOfDeath,
  updateAuthorMiddleware  
];

module.exports = {
  authorUpdateGet,
  authorUpdatePost
};