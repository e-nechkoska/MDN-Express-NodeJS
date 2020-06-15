const Book = require('../../models/book');
const Author = require('../../models/author');
const Genre = require('../../models/genre');

const { body, validationResult } = require('express-validator');
const { checkGenre, bookValidation } = require('../book/createBookController');

const bookUpdateGet = function(req, res, next) {
  const bookFindByIdPromise = Book.findById(req.params.id)
  .populate('author')
  .populate('genre')
  .exec();
  const authorFindPromise = Author.find().exec();
  const genreFindPromise = Genre.find().exec();

  Promise.all([bookFindByIdPromise, authorFindPromise, genreFindPromise])
  .then((results) => {
    [book, authors, genres] = results;
    if(book === null) {
      let error = new Error('Book not found');
      error.status = 404;
      return next(error);
    }
    
    for(let i = 0; i < genres.length; i++) {
      for(let j = 0; j < book.genre.length; j++) {
        if(genres[i]._id.toString() === book.genre[j]._id.toString()) {
          genres[i].checked = 'true';
        }
      }
    }
    res.render('book_form',{
      title: 'Update Book',
      authors: authors,
      genres: genres,
      book: book
    });
  }).catch(error => next(error));
};

const validateGenre = body('genre.*')
  .escape();

const updateBookMiddleware =  (req, res, next) => {
  const errors = validationResult(req);
  let book = new Book({
    title: req.body.title,
    author: req.body.author,
    summary: req.body.summary,
    isbn: req.body.isbn,
    genre: (typeof req.body.genre === 'undefined') ? [] : req.body.genre,
    _id: req.params.id
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
        title: 'Update Book',
        authors: authors,
        genres: genres,
        book: book,
        errors: errors.array()
      });
    }).catch(error => next(error));
  } else {
    Book.findByIdAndUpdate(req.params.id, book, {}).exec()
    .then(book => {
      res.redirect(book.url);
    }).catch(error => next(error));
  }
};

const bookUpdatePost = [
  checkGenre,
  bookValidation,
  validateGenre,
  updateBookMiddleware  
];     

module.exports = {
  bookUpdateGet,
  bookUpdatePost
};