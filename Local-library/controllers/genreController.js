let Genre = require('../models/genre');
let Book = require('../models/book');
let async = require('async');

let genre_list = function(req, res, next) {
  Genre.find()
  .sort([['name', 'ascending']])
  .exec(function (err, list_genres) {
    if(err) {
      return next(err);
    }
    res.render('genre_list', {title: 'Genre List', genre_list: list_genres});
  });
};

let genre_detail = function(req, res, next) {
  async.parallel({
    genre: function(callback) {
      Genre.findById(req.params.id)
      .exec(callback);
    },
    genre_books: function(callback) {
      Book.find({'genre': req.params.id})
      .exec(callback);
    }
  }, function(err, results) {
    if (err) {
      return next(err);
    }
    if (results.genre == null) {
      let err = new Error('Genre not found');
      err.status = 404;
      return next(err)
    }
    res.render('genre_detail', { title: 'Genre Detail', genre: results.genre, genre_books: results.genre_books });
  });
};

let genre_create_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Genre create GET');
};

let genre_create_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Genre create POST');
};

let genre_delete_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Genre delete GET');
};

let genre_delete_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Genre delete POST');
};

let genre_update_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Genre update GET');
};

let genre_update_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Genre update POST');
};

module.exports = {
  genre_list,
  genre_detail,
  genre_create_get,
  genre_create_post,
  genre_delete_get,
  genre_delete_post,
  genre_update_get,
  genre_update_post
};