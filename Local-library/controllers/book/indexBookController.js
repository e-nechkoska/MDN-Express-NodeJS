const Book = require('../../models/book');
const Author = require('../../models/author');
const Genre = require('../../models/genre');
const BookInstance = require('../../models/bookinstance');

const index = function(req, res, next) {   
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

module.exports = {
  index
};