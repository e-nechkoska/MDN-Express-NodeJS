const Genre = require('../../models/genre');

const { body, validationResult } = require('express-validator');

const genreCreateGet = function(req, res) {
  res.render('genre_form', { title: 'Create Genre', genre: {} });
};

const genreCreatePost = [
  body('name', 'Genre name required').trim().isLength({ min: 1 }).escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    let genre = new Genre({ 
      name: req.body.name 
    });

    if(!errors.isEmpty()) {
      res.render('genre_form', { 
        title: 'Create Genre', 
        genre: genre, 
        errors: errors.array() 
      });
    } else {
      Genre.findOne({'name': req.body.name})
      .exec()
      .then(foundGenre => {
        if(foundGenre) {
          res.redirect(foundGenre.url);
        }
        else {
          genre.save()
          .then(() => {
            res.redirect(genre.url);
          }).catch(error => next(error));
        }
      }).catch(error => next(error));
    }
  }
];

module.exports = {
  genreCreateGet,
  genreCreatePost
};