const BookInstance = require('../../models/bookinstance');
const Book = require('../../models/book');

const { body, validationResult } = require('express-validator');
const statuses = require('../../models/statuses');

const bookinstanceCreateGet = function(req, res, next) {

  Book.find({}, 'title')
  .exec()
  .then(books => {
    books.sort(function(a, b) {
      let textA = a.title.toUpperCase(); 
      let textB = b.title.toUpperCase(); 
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
    res.render('bookinstance_form', {
      title: 'Create BookInstance', 
      bookList: books,
      statuses: statuses,
      bookinstance: { book: books[0]._id }
    });
  }).catch(error => next(error));
};

const bookinstanceCreatePost = [
  body('book', 'Book must be specified').trim().isLength({min:1}).escape(),
  body('imprint', 'Imprint must be specified').trim().isLength({min:1}).escape(),
  body('dueBack', 'Invalid date').optional({checkFalsy: true}).isISO8601().escape(),
  body('status').trim().escape(),

  (req, res, next) => {
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
  }
 ];

module.exports = {
  bookinstanceCreateGet,
  bookinstanceCreatePost
};