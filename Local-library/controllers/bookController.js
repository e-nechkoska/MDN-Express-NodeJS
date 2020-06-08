let Book = require('../models/book');
let Author = require('../models/author');
let Genre = require('../models/genre');
let BookInstance = require('../models/bookinstance');

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
          BookInstance.countDocuments({status:'Available'}, callback);
      },
      author_count: function(callback) {
          Author.countDocuments({}, callback);
      },
      genre_count: function(callback) {
          Genre.countDocuments({}, callback);
      }
  }, function(err, results) {
      res.render('index', { title: 'Local Library Home', error: err, data: results });
  });
};

let book_list = function(req, res, next) {
  Book.find({}, 'title author')
  .populate('author')
  .exec(function (err, list_books) {
    if (err) {
      return next(err)
    }

    list_books.sort(function(a, b) {
      let textA = a.title.toUpperCase();
      let textB = b.title.toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });

    res.render('book_list', {title: 'Book List', book_list: list_books});
  });
};

let book_detail = function(req, res, next) {
  async.parallel({
    book: function(callback) {
      Book.findById(req.params.id)
      .populate('author')
      .populate('genre')
      .exec(callback)
    },
    book_instance: function(callback) {
      BookInstance.find({'book': req.params.id})
      .exec(callback);
    },
  }, function(err, results) {
    if(err) {
      return next(err);
    }
    if(results.book == null) {
      let err = new Error('Book not found');
      err.status = 404;
      return next(err);
    }
    res.render('book_detail', {title: results.book.title, book: results.book, book_instances: results.book_instance});
  })
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