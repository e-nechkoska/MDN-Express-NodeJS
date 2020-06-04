let BookInstance = require('../models/bookinstance');

let bookinstance_list = function(req, res, next) {
  BookInstance.find()
  .populate('book')
  .exec(function (err, list_bookinstances) {
    if(err) {
      return next(err);
    }
    res.render('bookinstance_list', {title: 'Book Instance List', bookinstance_list: list_bookinstances});
  });
};

let bookinstance_detail = function(req, res, next) {
  BookInstance.findById(req.params.id)
  .populate('book')
  .exec(function (err, bookinstance) {
    if(err) {
      return next(err);
    }
    if(bookinstance==null) {
      let err = new Error('Book copy not found');
      err.status = 404;
      return next(err);
    }
    res.render('bookinstance_detail', {title: 'Copy' + bookinstance.book.title, bookinstance: bookinstance});
  });
};

let bookinstance_create_get = function(req, res) {
  res.send('NOT IMPLEMENTED: BookInstance create GET');
};

let bookinstance_create_post = function(req, res) {
  res.send('NOT IMPLEMENTED: BookInstance create POST');
};

let bookinstance_delete_get = function(req, res) {
  res.send('NOT IMPLEMENTED: BookInstance delete GET');
};

let bookinstance_delete_post = function(req, res) {
  res.send('NOT IMPLEMENTED: BookInstance delete POST');
};

let bookinstance_update_get = function(req, res) {
  res.send('NOT IMPLEMENTED: BookInstance update GET');
};

let bookinstance_update_post = function(req, res) {
  res.send('NOT IMPLEMENTED: BookInstance update POST');
};

module.exports = {
  bookinstance_list,
  bookinstance_detail,
  bookinstance_create_get,
  bookinstance_create_post,
  bookinstance_delete_get,
  bookinstance_delete_post,
  bookinstance_update_get,
  bookinstance_update_post
};