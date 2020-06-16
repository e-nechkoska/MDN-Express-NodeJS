const Book = require('../../models/book');
const BookInstance = require('../../models/bookinstance');
const { compareStrings } = require('../../utils');

const bookList = function(req, res, next) {
  Book.find({}, 'title author')
  .populate('author')
  .exec()
  .then(listBooks => {
    listBooks.sort(function (first, second) {
      return compareStrings(first.title, second.title);
    });
    res.render('book_list', {
      title: 'Book List', 
      bookList: listBooks
    });
  }).catch(error => next(error));
};

const bookDetail = function(req, res, next) {
  const bookFindByIdPromise = Book.findById(req.params.id)
  .populate('author')
  .populate('genre')
  .exec();
  const bookInstanceFindPromise = BookInstance.find({'book': req.params.id})
  .exec();

  Promise.all([bookFindByIdPromise, bookInstanceFindPromise])
  .then((results) => {
    [book, bookInstances] = results;
    if(book === null) {
      let error = new Error('Book not found');
      error.status = 404;
      return next(error);
    }
    res.render('book_detail', {
      title: book.title, 
      book: book, 
      bookInstances: bookInstances
    });
  }).catch(error => next(error));      
};

module.exports = {
  bookList,
  bookDetail
};