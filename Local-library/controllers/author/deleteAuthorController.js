const Author = require('../../models/author');
const Book = require('../../models/book');

const authorDeleteGet = function (req, res, next) {
  const authorPromise = Author.findById(req.params.id).exec();
  const authorBooksPromise = Book.find({'author': req.params.id}, 'title summary').exec();

  Promise.all([authorPromise, authorBooksPromise])
  .then(results => {
    const [author, authorBooks] = results;
    if(author == null) {
      res.redirect('/catalog/authors');
    }
    res.render('author_delete', {
      title: 'Delete Author',
      author: author,
      authorBooksList: authorBooks
    });
  }).catch(error => next(error));
};

const authorDeletePost = function (req, res, next) {
  const authorPromise = Author.findById(req.body.authorId).exec();
  const authorBooksPromise = Book.find({'author': req.body.authorId}).exec();

  Promise.all([authorPromise, authorBooksPromise])
  .then(results => {
    const [author, authorBooks] = results;
    if(authorBooks.length > 0) {
      res.render('author_delete', {
        title: 'Delete Author',
        author: author,
        authorBooksList: authorBooks
      });
    } else {
      Author.findByIdAndRemove(req.body.authorId)
      .then(() => {
        res.redirect('/catalog/authors');
      }).catch(error => next(error));
    }
  });
};

module.exports = {
  authorDeleteGet,
  authorDeletePost
}