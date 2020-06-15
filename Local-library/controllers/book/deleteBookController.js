const Book = require('../../models/book');
const BookInstance = require('../../models/bookinstance');

const bookDeleteGet = function(req, res) {
  const bookFindByIdPromise = Book.findById(req.params.id).exec();
  const bookInstanceFindPromise = BookInstance.find({'book': req.params.id}).exec();

  Promise.all([bookFindByIdPromise, bookInstanceFindPromise])
  .then((results) => {
    [book, bookInstances] = results;
    if(book === null) {
      res.redirect('/catalog/books');
    } else {
      res.render('book_delete', {
      title: 'Delete Book',
      book: book,
      copies: bookInstances
      });
    }
  }).catch(error => next(error));
};

const bookDeletePost = function(req, res, next) {
  
  const bookFindByIdPromise = Book.findById(req.body.bookid).exec();
  const bookInstanceFindPromise = BookInstance.find({'book': req.body.bookid}).exec();

  Promise.all([bookFindByIdPromise, bookInstanceFindPromise])
  .then((results) => {
    [book, bookInstances] = results;
    if(bookInstances.length > 0) {
      res.render('book_delete', {
        title: 'Delete Book',
        book: book,
        copies: bookInstances
      });
    } else {
      Book.findByIdAndRemove(req.body.bookid).exec()
      .then(() => {
        res.redirect('/catalog/books');
      }).catch(error => next(error))
    }
  }).catch(error => next(error));
};

module.exports = {
  bookDeleteGet,
  bookDeletePost
};