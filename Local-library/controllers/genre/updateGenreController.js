const Genre = require('../../models/genre');

const { body, validationResult } = require('express-validator');

const genreUpdateGet = function(req, res, next) {
  Genre.findById(req.params.id).exec().then(genre => {
    if(genre == null) {
      let error = new Error('Genre not found');
      error.status = 404;
      return next(error);
    }

    const templateData = {
      title: 'Update Genre',
      genre: genre
   };

    res.render('genre_form', templateData)
  }).catch(err => next(err));
}

const genreUpdatePost = [
  body('name', 'Genre name must not be empty').trim().isLength({min: 1}).escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    let genre = new Genre({ 
      name: req.body.name,
      _id: req.params.id
    });

    if(!errors.isEmpty()) {
      res.render('genre_form', { 
        title: 'Update Genre', 
        genre: genre, 
        errors: errors.array() });
    } else {
      Genre.findByIdAndUpdate(req.params.id, genre).exec()
      .then(updatedGenre => {
        res.redirect(updatedGenre.url);
      }).catch(error => next(error));
    }
  }
];

module.exports = {
  genreUpdateGet,
  genreUpdatePost
};