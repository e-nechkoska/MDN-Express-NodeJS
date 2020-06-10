let Genre = require('../models/genre');
let Book = require('../models/book');

let async = require('async');
const validator = require('express-validator');

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
  res.render('genre_form', { title: 'Create Genre'});
};

let genre_create_post = [
  validator.body('name', 'Genre name required').trim().isLength({ min:1 }),
  validator.sanitizeBody('name').escape(),
  (req, res, next) => {
    const errors = validator.validationResult(req);
    let genre = new Genre(
      { name: req.body.name }
    );

    if(!errors.isEmpty()) {
      res.render('genre_form', { title: 'Create Genre', genre: genre, errors: errors.array() });
      return;
    } else {
      Genre.findOne( {'name': req.body.name} )
      .exec( function(err, found_genre) {
        if(err) {
          return next(err);
        }
        if(found_genre) {
          res.redirect(found_genre.url);
        }
        else {
          genre.save(function (err) {
            if (err) {
              return next(err);
            }
            res.redirect(genre.url);
          });
        }
      });
    }
  }
];

let genre_delete_get = function(req, res, next) {
  async.parallel({
    genre: function(callback) {
      Genre.findById(req.params.id).exec(callback)
    },
    books: function(callback) {
      Book.find({'genre': req.params.id}).exec(callback)
    },
  }, function(err, results) {
    if(err) {
      return next(err);
    }
    if(results.genre == null) {
      res.redirect('/catalog/genres')
    }
    res.render('genre_delete', {
      title: 'Delete Genre',
      genre: results.genre,
      books: results.books,
    });
  });
};

let genre_delete_post = function(req, res, next) {
  async.parallel({
    genre: function(callback) {
      Genre.findById(req.body.genreid).exec(callback)
    },
    books: function(callback) {
      Book.find({'genre': req.body.genreid}).exec(callback)
    },
  }, function (err, results) {
    if(err) {
      return next(err);
    }
    if(results.books.length > 0) {
      res.render('genre_delete', {
        title: 'Delete Genre',
        genre: results.genre,
        books: results.books
      });
      return;
    }
    else {
      Genre.findByIdAndRemove(req.body.genreid, function deleteGenre(err) {
        if(err) {
          return next(err);
        }
        res.redirect('/catalog/genres');
      });
    }
  });
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