const BookInstance = require('../../models/bookinstance');
const { compareStrings } = require('../../utils');

const bookinstanceList = function(req, res, next) {
  BookInstance.find()
  .populate('book')
  .exec()
  .then(bookinstanceList => {
    bookinstanceList.sort((first, second) => {
      return compareStrings(first.book.title, second.book.title);
    });
    res.render('bookinstance_list', {
      title: 'Book Instance List', 
      bookinstanceList: bookinstanceList});
  }).catch(error => next(error));
};

const bookinstanceDetail = function(req, res, next) {
  BookInstance.findById(req.params.id)
  .populate('book')
  .exec()
  .then(bookinstance => {
    if(bookinstance === null) {
      let error = new Error('Book copy not found');
      error.status = 404;
      return next(error);
    }
    res.render('bookinstance_detail', {
      title: 'Copy' + bookinstance.book.title, 
      bookinstance: bookinstance
    });
  }).catch(error => next(error));
};

module.exports = {
  bookinstanceList,
  bookinstanceDetail
};