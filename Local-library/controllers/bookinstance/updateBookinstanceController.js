const BookInstance = require('../../models/bookinstance');
const Book = require('../../models/book');


const { body, validationResult } = require('express-validator');
const statuses = require('../../models/statuses');

const bookinstanceUpdateGet = function(req, res, next) {
  const bookInstanceFindByIdPromise = BookInstance.findById(req.params.id).exec();
  const bookFindPromise = Book.find().exec();

  Promise.all([bookInstanceFindByIdPromise, bookFindPromise])
  .then((results) => {
    [bookinstance, books] = results;
    if(bookinstance === null) {
      let error = new Error('Bookinstance not found');
      error.status = 404;
      return next(error);
    }
    const selectedStatus = bookinstance.status;
    const bookInstanceStatuses = statuses.map(status => {
      return {
        ...status,
        selected: selectedStatus === status.name
      };
    });

    res.render('bookinstance_form', {
      title: 'Update BookInstance',
      bookinstance: bookinstance,
      bookList: books,
      statuses: bookInstanceStatuses
    })
  }).catch(error => next(error));
};

const bookinstanceUpdatePost = [
  body('book', 'Book must not be empty').trim().isLength({min: 1}).escape(),
  body('imprint', 'Imprint must not be empty').trim().isLength({min: 1}).escape(),
  body('status', 'Status must not be empty').trim().isLength({min: 1}).escape(),
  body('dueBack').escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    let bookinstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      dueBack: req.body.dueBack,
      _id: req.params.id
    });

    if(!errors.isEmpty()) {
      Book.find({}, 'title').exec().then(books => {
        res.render('bookinstance_form', {
          title: 'Update Book',
          bookList: books,
          bookinstance: bookinstance,
          statuses: statuses,
          errors: errors.array()
        });
      }).catch(error => next(error));
    } else {
      BookInstance.findByIdAndUpdate(req.params.id, bookinstance).exec()
      .then(updatedBookinstance => {
        res.redirect(updatedBookinstance.url);
      }).catch(ererrorr => next(error));
    }
  }
];

module.exports = {
  bookinstanceUpdateGet,
  bookinstanceUpdatePost
};