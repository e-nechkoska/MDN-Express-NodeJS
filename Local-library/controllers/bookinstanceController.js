let BookInstance = require('../models/bookinstance');
let Book = require('../models/book');

let async = require('async');

const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

const statuses = require('../models/statuses');

let bookinstance_list = function(req, res, next) {
  BookInstance.find()
  .populate('book')
  .exec(function (err, list_bookinstances) {
    if(err) {
      return next(err);
    }
    res.render('bookinstance_list', {title: 'Book Instance List', bookinstance_list: list_bookinstances});
  });
};

let bookinstance_detail = function(req, res, next) {
  BookInstance.findById(req.params.id)
  .populate('book')
  .exec(function (err, bookinstance) {
    if(err) {
      return next(err);
    }
    if(bookinstance==null) {
      let err = new Error('Book copy not found');
      err.status = 404;
      return next(err);
    }
    res.render('bookinstance_detail', {title: 'Copy' + bookinstance.book.title, bookinstance: bookinstance});
  });
};

let bookinstance_create_get = function(req, res, next) {
  

  Book.find({}, 'title')
  .exec(function (err, books) {
    if(err) {
      return next(err);
    }
    res.render('bookinstance_form', {
      title: 'Create BookInstance', 
      book_list: books,
      statuses: statuses
    });
  });
};

let bookinstance_create_post = [
  body('book', 'Book must be specified').trim().isLength({min:1}),
  body('imprint', 'Imprint must be specified').trim().isLength({min:1}),
  body('due_back', 'Invalid date').optional({checkFalsy: true}).isISO8601(),

  sanitizeBody('book').escape(),
  sanitizeBody('imprint').escape(),
  sanitizeBody('status').trim().escape(),
  sanitizeBody('due_back').toDate(),

  (req, res, next) => {
    const errors = validationResult(req);
    let bookinstance = new BookInstance({
      book: req.body.body,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back
    });
    if(!errors.isEmpty()) {
      Book.find({}, 'title')
      .exec(function (err, books) {
        if(err) {
          return next(err);
        }
        res.render('bookinstance_form', {
          title: 'Create BookInstance', 
          book_list: books, 
          selected_book: bookinstance.book._id, 
          errors: errors.array(), 
          bookinstance: bookinstance
        });
      });
      return;
    }
    else {
      bookinstance.save(function (err) {
        if(err) {
          return next(err);
        }
        res.redirect(bookinstance.url);
      });
    }
  }
];

let bookinstance_delete_get = function(req, res, next) {

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

let bookinstance_delete_post = function(req, res, next) {
  
  BookInstance.findByIdAndRemove(req.body.bookinstanceid, function deleteBookinstance(err) {
    if(err) {
      return next(err);
    }
    res.redirect('/catalog/bookinstances');
  });
};  

let bookinstance_update_get = function(req, res, next) {
  async.parallel({
    bookinstance: function(callback) {
      BookInstance.findById(req.params.id).exec(callback);
    },
    book: function(callback) {
      Book.find(callback);
    },
  }, function (err, results) {
    if(err) {
      return next(err);
    }
    if(results.bookinstance === null) {
      let error = new Error('Bookinstance not found');
      error.status = 404;
      return next(error);
    }

    const selectedStatus = results.bookinstance.status;
    const bookInstanceStatuses = statuses.map(status => {
      return {
        ...status,
        selected: selectedStatus === status.name
      };
    });

    res.render('bookinstance_form', {
      title: 'Update BookInstance',
      bookinstance: results.bookinstance,
      book_list: results.book,
      statuses: bookInstanceStatuses
    })
  })
};

let bookinstance_update_post = [
  body('book', 'Book must not be empty').trim().isLength({min: 1}),
  body('imprint', 'Imprint must not be empty').trim().isLength({min: 1}),
  body('status', 'Status must not be empty').trim().isLength({min: 1}),

  sanitizeBody('book').escape(),
  sanitizeBody('imprint').escape(),
  sanitizeBody('status').escape(),
  sanitizeBody('due_back').escape(),

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
          book_list: books,
          selected_book: bookinstance.book._id, 
          errors: errors.array(), 
          bookinstance: bookinstance,
          statuses: statuses
        });
      }).catch(err => next(err));
      return;
    } else {
      BookInstance.findByIdAndUpdate(req.params.id, bookinstance).exec()
      .then(updatedBookinstance => {
        res.redirect(updatedBookinstance.url);
      }).catch(err => next(err));
    }
  }
];

module.exports = {
  bookinstance_list,
  bookinstance_detail,
  bookinstance_create_get,
  bookinstance_create_post,
  bookinstance_delete_get,
  bookinstance_delete_post,
  bookinstance_update_get,
  bookinstance_update_post
};