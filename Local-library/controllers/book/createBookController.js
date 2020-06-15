const Book = require('../../models/book');
const Author = require('../../models/author');
const Genre = require('../../models/genre');

const { body, validationResult } = require('express-validator');

// const { checkGenre } = require('./checkGenre');

const bookCreateGet = function(req, res, next) {
  const authorFindPromise = Author.find().exec();
  const genreFindPromise = Genre.find().exec();

  Promise.all([authorFindPromise, genreFindPromise])
  .then((results) => {
    [authors, genres] = results;
    res.setHeader('Cache-Control', 'no-cache');
    res.render('book_form', { 
      title: 'Create Book', 
      authors: authors, 
      genres: genres,
      book: {
        author: authors[0]._id
      }
    });
  }).catch(error => next(error));
};

const validateTitle = body('title', 'Title must not be empty.')
  .trim()
  .isLength({min: 1})
  .escape();

const validateAuthor = body('author', 'Author must not be empty.')
  .trim()
  .isLength({min: 1})
  .escape();

const validateSummary = body('summary', 'Summary must not be empty.')
  .trim()
  .isLength({min: 1})
  .escape();

const validateISBN = body('isbn', 'ISBN must not be empty.')
  .trim()
  .isLength({min: 1})
  .escape();

const bookValidation = [
  validateTitle,
  validateAuthor,
  validateSummary,
  validateISBN,
];  

const checkGenre = (req, res, next) => {
  if(!(req.body.genre instanceof Array)) {
    if(typeof req.body.genre === 'undefined')
    req.body.genre = [];
    else 
    req.body.genre = new Array(req.body.genre);
  }
  next();
};

const createBookMiddleware = (req, res, next) => {
  const errors = validationResult(req);

  let book = new Book({
    title: req.body.title,
    author: req.body.author,
    summary: req.body.summary,
    isbn: req.body.isbn,
    genre: req.body.genre
  });

  if(!errors.isEmpty()) {
    const authorFindPromise = Author.find().exec();
    const genreFindPromise = Genre.find().exec();

    Promise.all([authorFindPromise, genreFindPromise])
    .then((results) => {
      [authors, genres] = results;
      for(let i = 0; i < genres.length; i++) {
        if(book.genre.indexOf(genres[i]._id) > -1) {
          genres[i].checked = 'true';
        }
      }
      res.render('book_form', {
        title: 'Create Book', 
        authors: authors, 
        genres: genres, 
        book: book,
        errors: error.array()
      })
    }).catch(error => next(error))
  } else {
    book.save()
    .then(book => {
      res.redirect(book.url);
    }).catch(error => next(error));
  }
};

const bookCreatePost = [
  checkGenre,
  bookValidation,
  createBookMiddleware  
];

module.exports = {
  checkGenre,
  bookValidation,
  bookCreateGet,
  bookCreatePost
};