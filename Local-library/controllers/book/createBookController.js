const Book = require('../../models/book');
const Author = require('../../models/author');
const Genre = require('../../models/genre');
const checkGenre = require('./checkGenre');
const bookValidation = require('./bookValidation');

const { validationResult } = require('express-validator');

const renderBookForm = (res, authors, genres, book, errors = null) => { 
  res.render('book_form', {
    title: 'Create Book', 
    authors: authors, 
    genres: genres,
    book: book,
    errors: errors
  });
};

const bookCreateGet = function(req, res, next) {
  const authorFindPromise = Author.find().sort([['familyName', 'ascending']]).exec();
  const genreFindPromise = Genre.find().exec();

  Promise.all([authorFindPromise, genreFindPromise])
  .then((results) => {
    const [authors, genres] = results;
    res.setHeader('Cache-Control', 'no-cache');
     renderBookForm(res, authors, genres, {author: authors[0].id});
  }).catch(error => next(error));
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
      const [authors, genres] = results;
      for(let i = 0; i < genres.length; i++) {
        if(book.genre.indexOf(genres[i]._id) > -1) {
          genres[i].checked = 'true';
        }
      }
      renderBookForm(res, authors, genres, book, errors.array());
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
  bookCreateGet,
  bookCreatePost
};