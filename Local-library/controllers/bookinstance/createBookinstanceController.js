const BookInstance = require('../../models/bookinstance');
const Book = require('../../models/book');

const { body, validationResult } = require('express-validator');
const statuses = require('../../models/statuses');

const compareStrings = require('../../utils/compare-strings');

// const renderBookinstanceForm = (res, bookinstance = { book: books[0]._id }, errors = null) => {
//   res.render('bookinstance_form', {
//     title: 'Create BookInstance', 
//     bookList: books,
//     statuses: statuses,
//     bookinstance: bookinstance,
//     errors: errors
//   });
// };

const bookinstanceCreateGet = function(req, res, next) {
  Book.find({}, 'title')
  .exec()
  .then(books => {
    books.sort(function(a, b) {
      return compareStrings(a.title, b.title);
    });
    // renderBookinstanceForm(res);
    res.render('bookinstance_form', {
      title: 'Create BookInstance', 
      bookList: books,
      statuses: statuses,
      bookinstance: { book: books[0]._id }
    });
  }).catch(error => next(error));
};

const validateBookinstance = [
  body('book', 'Book must be specified').trim().isLength({min:1}).escape(),
  body('imprint', 'Imprint must be specified').trim().isLength({min:1}).escape(),
  body('dueBack', 'Invalid date').optional({checkFalsy: true}).isISO8601().escape(),
  body('status').trim().escape()
];

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
      // renderBookinstanceForm(res, req.body, errors.array());
      res.render('bookinstance_form', {
        title: 'Create BookInstance', 
        bookList: books, 
        bookinstance: bookinstance,
        errors: errors.array()
      });
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