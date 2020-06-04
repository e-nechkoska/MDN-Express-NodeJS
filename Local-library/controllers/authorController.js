let Author = require('../models/author');
let Book = require('../models/book');
let async = require('async')

let author_list = function (req, res, next) {
  Author.find()
  .populate('author')
  .sort([['family_name', 'ascending']])
  .exec(function (err, list_authors) {
    if(err) {
      return next(err);
    }
    res.render('author_list', {title: 'Author List', author_list: list_authors});
  });
};

let author_detail = function (req, res, next) {
  async.parallel({
    author: function(callback) {
      Author.findById(req.params.id)
      .exec(callback);
    },
    author_books: function(callback) {
      Book.find({'author': req.params.id}, 'title summary')
      .exec(callback);
    },
  }, function(err, results) {
    if(err) {
      return next(err);
    }
    if(results.author==null) {
      let err = new Error('Author not found');
      err.status = 404;
      return next(err);
    }
    res.render('author_detail', {title: 'Author Detail', author: results.author, author_books: results.author_books});
  });
};

let author_create_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Author create GET');
};

let author_create_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Author create POST');
};

let author_delete_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Author delete GET');
};

let author_delete_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Author delete POST');
};

let author_update_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Author update GET');
};

let author_update_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Author update POSt');
};

module.exports = {
  author_list,
  author_detail,
  author_create_get,
  author_create_post,
  author_delete_get,
  author_delete_post,
  author_update_get,
  author_update_post
};