/**
 * TODOs
 * 
 * 1. Use promises instead of callbacks
 * 2. Create separate controllers for get, create, update, delete actions
 * 3. Rename variables to cammelCase
 * 4. Create "services": Move the null check there and reject the promise if needed.
 * 5. Improve error handling. Create Error classes. Ex. NotFound
 * 
 * Read: https://developer.mozilla.org/en-US/docs/Learn/Forms/Sending_and_retrieving_form_data
*/

let Author = require('../../models/author');
let Book = require('../../models/book');

let authorList = function (req, res, next) {
  Author.find()
  .populate('author')
  .sort([['familyName', 'ascending']])
  .exec()
  .then(authors => {
    res.render('author_list', {
      title: 'Author List', 
      authorList: authors
    });
  }).catch(error => next(error));
};

let authorDetail = function (req, res, next) {
  const authorPromise = Author.findById(req.params.id).exec();
  const authorBooksPromise = Book.find({'author': req.params.id}, 'title summary').exec();
  Promise.all([authorPromise, authorBooksPromise])
  .then((results) => {
    /**
     * Results is a list of two objects: author and book.
     * 
     * Same as:
     * const author = results[0];
     * const book = results[1];
    */
    const [author, authorBooks] = results;
    
    if(author === null) {
      let err = new Error('Author not found');
      err.status = 404;
      return next(err);
    }
    res.render('author_detail', {
      title: 'Author Detail', 
      author: author, 
      authorBooksList: authorBooks});
  }).catch(error => next(error)); 
};

module.exports = {
  authorList,
  authorDetail
}