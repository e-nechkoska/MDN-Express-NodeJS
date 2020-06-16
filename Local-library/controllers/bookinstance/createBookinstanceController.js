const BookInstance = require('../../models/bookinstance');
const Book = require('../../models/book');

const { body, validationResult } = require('express-validator');
const statuses = require('../../models/statuses');

const  validateBookinstance = require('./bookinstanceValidation');
const compareStrings = require('../../utils/compare-strings');

const renderBookinstanceForm = (res, books, bookinstance, errors = null) => {
  res.render('bookinstance_form', {
    title: 'Create BookInstance', 
    bookList: books,
    statuses: statuses,
    bookinstance: bookinstance,
    errors: errors
  });
};

const bookinstanceCreateGet = function(req, res, next) {
  Book.find({}, 'title')
  .exec()
  .then(books => {
    books.sort(function(a, b) {
      return compareStrings(a.title, b.title);
    });

    const bookinstance = { book: books[0]._id };
    renderBookinstanceForm(res, books, bookinstance);
  }).catch(error => next(error));
};

const bookinstanceCreateMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  let bookinstance = new BookInstance({
    book: req.body.book,
    imprint: req.body.imprint,
    status: req.body.status,
    dueBack: req.body.dueBack
  });
  if(!errors.isEmpty()) {
    Book.find({}, 'title')
    .exec()
    .then(books => {
      renderBookinstanceForm(res, books, bookinstance, errors.array());
    }).catch(error => next(error));
  }  else {
    bookinstance.save()
    .then(bookinstance => {
      res.redirect(bookinstance.url);
    }).catch(error => next(error));
  }
};

const bookinstanceCreatePost = [
  validateBookinstance,
  bookinstanceCreateMiddleware
 ];

module.exports = {
  bookinstanceCreateGet,
  bookinstanceCreatePost
};