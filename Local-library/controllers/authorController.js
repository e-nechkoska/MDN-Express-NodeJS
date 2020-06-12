let Author = require('../models/author');
let Book = require('../models/book');

const { body, validationResult } = require('express-validator');

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

let authorList = function (req, res, next) {
  Author.find()
  .populate('author')
  .sort([['family_name', 'ascending']])
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

let authorCreateGet = function (req, res) {
  res.render('author_form', { title: 'Create Author', author: {} });
};

let authorCreatePost = [
  body('first_name')
  .isLength({ min: 1 })
  .trim()
  .withMessage('First name must be specified.')
  .isAlphanumeric()
  .withMessage('First name has non-alphanumeric characters.')
  .escape(),

  body('family_name')
  .isLength({ min: 1 })
  .trim()
  .withMessage('Family name must be specified.')
  .isAlphanumeric()
  .withMessage('Family name has non-alphanumeric characters.')
  .escape(),

  body('date_of_birth', 'Invalid date of birth')
  .optional({ checkFalsy: true })
  .isISO8601()
  .escape(),

  body('date_of_death', 'Invalid date of death')
  .optional({ checkFalsy: true })
  .isISO8601()
  .escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
      res.render('author_form', { 
        title: 'Create Author', 
        author: req.body, 
        errors: errors.array() 
      });
    }
    else {
      let author = new Author({
        first_name: req.body.first_name,
        family_name: req.body.family_name,
        date_of_birth: req.body.date_of_birth,
        date_of_death: req.body.date_of_death
      });
      author.save()
      .then(() => {
        res.redirect(author.url);
      }).catch(error => next(error));
    }
  }
];

let authorDeleteGet = function (req, res, next) {
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

let authorDeletePost = function (req, res, next) {
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

let authorUpdateGet = function (req, res, next) {
  Author.findById(req.params.id).exec().then(result => {
    if(result === null) {
      let error = new Error('Author not found');
      error.status = 404;
      return next(error);
    }
    res.render('author_form', {
      title: 'Update Author',
      author: result
    })
  }).catch(error => next(error))
};

let authorUpdatePost = [
  body('first_name', 'First name must not be empty.').trim().isLength({min: 1}).escape(),
  body('family_name', 'Family name must not be empty').trim().isLength({min: 1}).escape(),
  body('date_of_birth').escape(),
  body('date_of_death').escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    let author = new Author({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death,
      _id: req.params.id
    });

    if(!errors.isEmpty()) {
      Author.find().exec().then(result => {
        res.render('author_form', {
          title: 'Update Author',
          author: result,
          errors: errors.array()
        });
      }).catch(error => next(error));
    } else {
      Author.findByIdAndUpdate(req.params.id, author).exec()
      .then(updatedAuthor => {
        res.redirect(updatedAuthor.url);
      }).catch(error => next(error));
    }
  }
];

module.exports = {
  authorList,
  authorDetail,
  authorCreateGet,
  authorCreatePost,
  authorDeleteGet,
  authorDeletePost,
  authorUpdateGet,
  authorUpdatePost
};