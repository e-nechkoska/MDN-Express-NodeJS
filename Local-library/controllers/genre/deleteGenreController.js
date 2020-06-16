const Genre = require('../../models/genre');
const Book = require('../../models/book');

const genreDeleteGet = function(req, res, next) {
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

const genreDeletePost = function(req, res, next) {
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

module.exports = {
  genreDeleteGet,
  genreDeletePost
};