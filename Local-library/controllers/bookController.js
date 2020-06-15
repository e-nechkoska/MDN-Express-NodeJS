let Book = require('../models/book');
let Author = require('../models/author');
let Genre = require('../models/genre');
let BookInstance = require('../models/bookinstance');

const { body, validationResult } = require('express-validator');

let index = function(req, res, next) {   
    const bookCountPromise = Book.countDocuments();
    const bookInscanceCountPromise = BookInstance.countDocuments();
    const bookInscanceAvailableCountPromise = BookInstance.countDocuments({status: 'Available'});
    const authorCountPromise = Author.countDocuments();
    const genreCountPromise = Genre.countDocuments();

    Promise.all([bookCountPromise, bookInscanceCountPromise, bookInscanceAvailableCountPromise, authorCountPromise, genreCountPromise])
    .then((results) => {
      [books, bookInstances, availableBookInstances, authors, genres] = results,
      res.render('index', { 
        title: 'Local Library Home', 
        books: books,
        bookInstances: bookInstances,
        availableBookInstances: availableBookInstances,
        authors: authors,
        genres: genres
       });
    }).catch(error => res.render('index', {error: error}));
};

let bookList = function(req, res, next) {
  Book.find({}, 'title author')
  .populate('author')
  .exec()
  .then(listBooks => {
    
    listBooks.sort(function(a, b) {
      let textA = a.title.toUpperCase();
      let textB = b.title.toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
    console.log(listBooks);
    res.render('book_list', {
      title: 'Book List', 
      bookList: listBooks});
  }).catch(error => next(error));
};

let bookDetail = function(req, res, next) {
  const bookFindByIdPromise = Book.findById(req.params.id)
  .populate('author')
  .populate('genre')
  .exec();
  const bookInstanceFindPromise = BookInstance.find({'book': req.params.id})
  .exec();

  Promise.all([bookFindByIdPromise, bookInstanceFindPromise])
  .then((results) => {
    [book, bookInstances] = results;
    if(book === null) {
      let error = new Error('Book not found');
      error.status = 404;
      return next(error);
    }
    res.render('book_detail', {
      title: book.title, 
      book: book, 
      bookInstances: bookInstances
    });
  }).catch(error => next(error));      
};

let bookCreateGet = function(req, res, next) {
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



let bookCreatePost = [
  (req, res, next) => {
    if(!(req.body.genre instanceof Array)) {
      if(typeof req.body.genre === 'undefined')
      req.body.genre = [];
      else 
      req.body.genre = new Array(req.body.genre);
    }
    next();
  },

  body('title', 'Title must not be empty.').trim().isLength({min:1}).escape(),
  body('author', 'Author must not be empty.').trim().isLength({min:1}).escape(),
  body('summary', 'Summary must not be empty.').trim().isLength({min:1}).escape(),
  body('isbn', 'ISBN must not be empty.').trim().isLength({min:1}).escape(),

  (req, res, next) => {
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
  }
];

let bookDeleteGet = function(req, res) {
  const bookFindByIdPromise = Book.findById(req.params.id).exec();
  const bookInstanceFindPromise = BookInstance.find({'book': req.params.id}).exec();

  Promise.all([bookFindByIdPromise, bookInstanceFindPromise])
  .then((results) => {
    [book, bookInstances] = results;
    if(book === null) {
      res.redirect('/catalog/books');
    } else {
      res.render('book_delete', {
      title: 'Delete Book',
      book: book,
      copies: bookInstances
      });
    }
  }).catch(error => next(error));
};

let bookDeletePost = function(req, res, next) {
  
  const bookFindByIdPromise = Book.findById(req.body.bookid).exec();
  const bookInstanceFindPromise = BookInstance.find({'book': req.body.bookid}).exec();

  Promise.all([bookFindByIdPromise, bookInstanceFindPromise])
  .then((results) => {
    [book, bookInstances] = results;
    if(bookInstances.length > 0) {
      res.render('book_delete', {
        title: 'Delete Book',
        book: book,
        copies: bookInstances
      });
    } else {
      Book.findByIdAndRemove(req.body.bookid).exec()
      .then(() => {
        res.redirect('/catalog/books');
      }).catch(error => next(error))
    }
  }).catch(error => next(error));
};

let bookUpdateGet = function(req, res, next) {
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

let bookUpdatePost = [
  (req, res, next) => {
    if(!(req.body.genre instanceof Array)) {
      if(typeof req.body.genre === 'undefined') 
      req.body.genre = [];
      else 
      req.body.genre = new Array(req.body.genre);
    }
    next();
  },

  body('title', 'Title must not be empty').trim().isLength({min: 1}).escape(),
  body('author', 'Author must not be empty').trim().isLength({min: 1}).escape(),
  body('summary', 'Summary must not be empty').trim().isLength({min: 1}).escape(),
  body('isbn', 'ISBN must not be empty').trim().isLength({min: 1}).escape(),
  body('genre.*').escape(),

  (req, res, next) => {
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
  }
];     

module.exports = {
  index,
  bookList,
  bookDetail,
  bookCreateGet,
  bookCreatePost,
  bookDeleteGet,
  bookDeletePost,
  bookUpdateGet,
  bookUpdatePost
};