let Book = require('../models/book');
let Author = require('../models/author');
let Genre = require('../models/genre');
let BookInstance = require('../model/bookinstance');

let async = require('async');

let index = function(req, res) {
  async.parallel({
    book_count: function(callback) {
      Book.countDocuments({}, callback);
    },
    book_instance_count: function(callback) {
      BookInstance.countDocuments({}, callback);
    },
    book_instance_available_count: function(callback) {
      BookInstance.countDocuments({status: 'Available'}, callback);
    },
    author_count: function(callback) {
      Author.countDocuments({}, callback);
    },
    genre_count: function(callback) {
      Genre.countDocuments({}, callback);
    }
  }, function(err, results) {
    res.render('index', {title: 'Local Library Home', error: err, data: results});
  }
  );
};

let book_list = function(req, res) {
  res.send('NOT IMPLEMENTED: Book list');
};

let book_detail = function(req, res) {
  res.send('NOT IMPLEMENTED: Book detail: ' + req.params.id);
};

let book_create_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Book create GET');
};

let book_create_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Book create POST');
};

let book_delete_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Book delete GET');
};

let book_delete_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Book delete POST');
};

let book_update_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Book update GET');
};

let book_update_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Book update POST');
};

module.exports = {
  index,
  book_list,
  book_detail,
  book_create_get,
  book_create_post,
  book_delete_get,
  book_delete_post,
  book_update_get,
  book_update_post
};