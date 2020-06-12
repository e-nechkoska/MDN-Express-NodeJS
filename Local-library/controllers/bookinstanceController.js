let BookInstance = require('../models/bookinstance');
let Book = require('../models/book');

// const async = require('async');

const { body, validationResult } = require('express-validator');
const statuses = require('../models/statuses');

let bookinstanceList = function(req, res, next) {
  BookInstance.find()
  .populate('book')
  .exec()
  .then(bookinstanceList => {
    bookinstanceList.sort(function(a, b) {
      let textA = a.book.title.toUpperCase(); 
      let textB = b.book.title.toUpperCase(); 
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
    res.render('bookinstance_list', {
      title: 'Book Instance List', 
      bookinstanceList: bookinstanceList});
  }).catch(error => next(error));
};

let bookinstanceDetail = function(req, res, next) {
  BookInstance.findById(req.params.id)
  .populate('book')
  .exec()
  .then(bookinstance => {
    if(bookinstance === null) {
      let error = new Error('Book copy not found');
      error.status = 404;
      return next(error);
    }
    res.render('bookinstance_detail', {
      title: 'Copy' + bookinstance.book.title, 
      bookinstance: bookinstance
    });
  }).catch(error => next(error));
};

let bookinstanceCreateGet = function(req, res, next) {

  Book.find({}, 'title')
  .exec()
  .then(books => {
    books.sort(function(a, b) {
      let textA = a.title.toUpperCase(); 
      let textB = b.title.toUpperCase(); 
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
    res.render('bookinstance_form', {
      title: 'Create BookInstance', 
      bookList: books,
      statuses: statuses,
      bookinstance: { book: books[0]._id }
    });
  }).catch(error => next(error));
};

let bookinstanceCreatePost = [
  body('book', 'Book must be specified').trim().isLength({min:1}).escape(),
  body('imprint', 'Imprint must be specified').trim().isLength({min:1}).escape(),
  body('due_back', 'Invalid date').optional({checkFalsy: true}).isISO8601().escape(),
  body('status').trim().escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    let bookinstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back
    });
    if(!errors.isEmpty()) {
      Book.find({}, 'title')
      .exec()
      .then(books => {
        res.render('bookinstance_form', {
          title: 'Create BookInstance', 
          bookList: books, 
          bookinstance: bookinstance,
          errors: errors.array()
        });
      }).catch(error => next(error));
    }  else {
      bookinstance.save()
      .then(bookinstance => {
        res.redirect(bookinstance.url);
      }).catch(error => next(error));
    }
  }
 ];

let bookinstanceDeleteGet = function(req, res, next) {

  // 1
  // try {
  //   const bookInstance = await BookInstance.findById(req.params.id).exec();
  //   if(bookInstance == null) {
  //     res.redirect('/catalog/bookinstances');
  //   }
  //   res.render('bookinstance_delete', {
  //     title: 'Delete BookInstance',
  //     bookinstance: bookInstance
  //   });
  // } catch(error) {
  //   next(error)
  // }

  // 2
  BookInstance.findById(req.params.id).exec().then(bookInstance => {
    if(bookInstance == null) {
      res.redirect('/catalog/bookinstances');
    }
    res.render('bookinstance_delete', {
      title: 'Delete BookInstance',
      bookinstance: bookInstance
    });
  }).catch(error => next(error));
  
  // 3
  // Promise.all([
  //   BookInstance.findById(req.params.id).exec()
  // ]).then(results => {
  //   const bookInstance = results[0];
  //   if(bookInstance == null) {
  //     res.redirect('/catalog/bookinstances');
  //   }
  //   res.render('bookinstance_delete', {
  //     title: 'Delete BookInstance',
  //     bookinstance: bookInstance
  //   });
  // }).catch(error => next(error));

  // 4 :(
  // async.parallel({
  //   bookinstance: function(callback) {
  //     return BookInstance.findById(req.params.id).exec(callback);
  //   },
  // }, function(err, results) {
  //   if(err) {
  //     return next(err);
  //   }
  //   if(results.bookinstance == null) {
  //     res.redirect('/catalog/bookinstances');
  //   }
  //   res.render('bookinstance_delete', {
  //     title: 'Delete BookInstance',
  //     bookinstance: results.bookinstance
  //   });
  // });
};

let bookinstanceDeletePost = function(req, res, next) {
  BookInstance.findByIdAndRemove(req.body.bookinstanceid).exec()
  .then(() => {
    res.redirect('/catalog/bookinstances');
  }).catch(error => next(error));
};  

let bookinstanceUpdateGet = function(req, res, next) {
  const bookInstanceFindByIdPromise = BookInstance.findById(req.params.id).exec();
  const bookFindPromise = Book.find().exec();

  Promise.all([bookInstanceFindByIdPromise, bookFindPromise])
  .then((results) => {
    [bookinstance, books] = results;
    if(bookinstance === null) {
      let error = new Error('Bookinstance not found');
      error.status = 404;
      return next(error);
    }
    const selectedStatus = bookinstance.status;
    const bookInstanceStatuses = statuses.map(status => {
      return {
        ...status,
        selected: selectedStatus === status.name
      };
    });

    res.render('bookinstance_form', {
      title: 'Update BookInstance',
      bookinstance: bookinstance,
      bookList: books,
      statuses: bookInstanceStatuses
    })
  }).catch(error => next(error));
};

let bookinstanceUpdatePost = [
  body('book', 'Book must not be empty').trim().isLength({min: 1}).escape(),
  body('imprint', 'Imprint must not be empty').trim().isLength({min: 1}).escape(),
  body('status', 'Status must not be empty').trim().isLength({min: 1}).escape(),
  body('due_back').escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    let bookinstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
      _id: req.params.id
    });

    if(!errors.isEmpty()) {
      Book.find({}, 'title').exec().then(books => {
        res.render('bookinstance_form', {
          title: 'Update Book',
          bookList: books,
          bookinstance: bookinstance,
          statuses: statuses,
          errors: errors.array()
        });
      }).catch(error => next(error));
    } else {
      BookInstance.findByIdAndUpdate(req.params.id, bookinstance).exec()
      .then(updatedBookinstance => {
        res.redirect(updatedBookinstance.url);
      }).catch(ererrorr => next(error));
    }
  }
];

module.exports = {
  bookinstanceList,
  bookinstanceDetail,
  bookinstanceCreateGet,
  bookinstanceCreatePost,
  bookinstanceDeleteGet,
  bookinstanceDeletePost,
  bookinstanceUpdateGet,
  bookinstanceUpdatePost
};