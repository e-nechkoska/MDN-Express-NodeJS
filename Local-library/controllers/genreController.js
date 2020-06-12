let Genre = require('../models/genre');
let Book = require('../models/book');

let async = require('async');
const { body, validationResult } = require('express-validator');

let genreList = function(req, res, next) {
  Genre.find()
  .sort([['name', 'ascending']])
  .exec()
  .then(genreList => {
    res.render('genre_list', {
      title: 'Genre List', 
      genreList: genreList});
  }).catch(error => next(error));
};

let genreDetail = function(req, res, next) {
  const genreFindByIdPromise = Genre.findById(req.params.id).exec();
  const bookFindPromise = Book.find({'genre': req.params.id}).exec();

  Promise.all([genreFindByIdPromise, bookFindPromise])
  .then((results) => {
    [genre, books] = results;
    if (genre === null) {
      let error = new Error('Genre not found');
      error.status = 404;
      return next(error)
    }
    res.render('genre_detail', { 
      title: 'Genre Detail', 
      genre: genre, 
      genreBooks: books 
    });
  });
};

let genreCreateGet = function(req, res) {
  res.render('genre_form', { title: 'Create Genre', genre: {} });
};

let genreCreatePost = [
  body('name', 'Genre name required').trim().isLength({ min: 1 }).escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    let genre = new Genre({ 
      name: req.body.name 
    });

    if(!errors.isEmpty()) {
      res.render('genre_form', { 
        title: 'Create Genre', 
        genre: genre, 
        errors: errors.array() 
      });
    } else {
      Genre.findOne( {'name': req.body.name} )
      .exec()
      .then(foundGenre => {
        if(foundGenre) {
          res.redirect(foundGenre.url);
        }
        else {
          genre.save()
          .then(() => {
            res.redirect(genre.url);
          }).catch(error => next(error));
        }
      }).catch(error => next(error));
    }
  }
];
    
let genreDeleteGet = function(req, res, next) {
  const genreFindByIdPromise = Genre.findById(req.params.id).exec();
  const bookFindPromise = Book.find({'genre': req.params.id}).exec();

  Promise.all([genreFindByIdPromise, bookFindPromise])
  .then((results) => {
    [genre, books] = results;
    if(genre == null) {
      res.redirect('/catalog/genres')
    }
    res.render('genre_delete', {
      title: 'Delete Genre',
      genre: genre,
      books: books,
    });
  }).catch(error => next(error));
};

let genreDeletePost = function(req, res, next) {
  const genreFindByIdPromise = Genre.findById(req.body.genreid).exec();
  const bookFindPromise = Book.find({'genre': req.body.genreid}).exec();

  Promise.all([genreFindByIdPromise, bookFindPromise])
  .then((results) => {
    [genre, books] = results;
    if(books.length > 0) {
      res.render('genre_delete', {
        title: 'Delete Genre',
        genre: genre,
        books: books
      });
    } else {
      Genre.findByIdAndRemove(req.body.genreid).exec()
      .then(() => {
        res.redirect('/catalog/genres');
      }).catch(error => next(error));
    }
  }).catch(error => next(error));
};

let genreUpdateGet = function(req, res, next) {
  Genre.findById(req.params.id).exec().then(genre => {
    if(genre == null) {
      let error = new Error('Genre not found');
      error.status = 404;
      return next(error);
    }

    const templateData = {
      title: 'Update Genre',
      genre: genre
   };

    res.render('genre_form', templateData)
  }).catch(err => next(err));
}

let genreUpdatePost = [
  body('name', 'Genre name must not be empty').trim().isLength({min: 1}).escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    let genre = new Genre({ 
      name: req.body.name,
      _id: req.params.id
    });

    if(!errors.isEmpty()) {
      res.render('genre_form', { 
        title: 'Update Genre', 
        genre: genre, 
        errors: errors.array() });
    } else {
      Genre.findByIdAndUpdate(req.params.id, genre).exec()
      .then(updatedGenre => {
        res.redirect(updatedGenre.url);
      }).catch(error => next(error));
    }
  }
];

module.exports = {
  genreList,
  genreDetail,
  genreCreateGet,
  genreCreatePost,
  genreDeleteGet,
  genreDeletePost,
  genreUpdateGet,
  genreUpdatePost
};