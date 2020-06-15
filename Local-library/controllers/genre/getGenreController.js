const Genre = require('../../models/genre');
const Book = require('../../models/book');

const genreList = function(req, res, next) {
  Genre.find()
  .sort([['name', 'ascending']])
  .exec()
  .then(genreList => {
    res.render('genre_list', {
      title: 'Genre List', 
      genreList: genreList});
  }).catch(error => next(error));
};

const genreDetail = function(req, res, next) {
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

module.exports = {
  genreList,
  genreDetail
};