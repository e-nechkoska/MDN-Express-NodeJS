const BookInstance = require('../../models/bookinstance');

const bookinstanceDeleteGet = function(req, res, next) {

  BookInstance.findById(req.params.id)
  .exec()
  .then(bookInstance => {
    if(bookInstance == null) {
      res.redirect('/catalog/bookinstances');
    }
    res.render('bookinstance_delete', {
      title: 'Delete BookInstance',
      bookinstance: bookInstance
    });
  }).catch(error => next(error));
};

const bookinstanceDeletePost = function(req, res, next) {
  BookInstance.findByIdAndRemove(req.body.bookinstanceid)
  .exec()
  .then(() => {
    res.redirect('/catalog/bookinstances');
  }).catch(error => next(error));
};  

module.exports = {
  bookinstanceDeleteGet,
  bookinstanceDeletePost
};