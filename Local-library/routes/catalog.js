let express = require('express');
let router = express.Router();

let book_controller = require('../controllers/bookController');
let author_controller = require('../controllers/authorController');
let genre_controller = require('../controllers/genreController');
let book_instance_controller = require('../controllers/bookinstanceController');

// BOOK ROUTES
router.get('/', book_controller.index);
router.get('/book/create', book_controller.bookCreateGet);
router.post('/book/create', book_controller.bookCreatePost);
router.get('/book/:id/delete', book_controller.bookDeleteGet);
router.post('/book/:id/delete', book_controller.bookDeletePost);
router.get('/book/:id/update', book_controller.bookUpdateGet);
router.post('/book/:id/update', book_controller.bookUpdatePost);
router.get('/book/:id', book_controller.bookDetail);
router.get('/books', book_controller.bookList);

// AUTHOR ROUTES
router.get('/author/create', author_controller.authorCreateGet);
router.post('/author/create', author_controller.authorCreatePost);
router.get('/author/:id/delete', author_controller.authorDeleteGet);
router.post('/author/:id/delete', author_controller.authorDeletePost);
router.get('/author/:id/update', author_controller.authorUpdateGet);
router.post('/author/:id/update', author_controller.authorUpdatePost);
router.get('/author/:id', author_controller.authorDetail);
router.get('/authors', author_controller.authorList);

// GENRE ROUTES
router.get('/genre/create', genre_controller.genreCreateGet);
router.post('/genre/create', genre_controller.genreCreatePost);
router.get('/genre/:id/delete', genre_controller.genreDeleteGet);
router.post('/genre/:id/delete', genre_controller.genreDeletePost);
router.get('/genre/:id/update', genre_controller.genreUpdateGet);
router.post('/genre/:id/update', genre_controller.genreUpdatePost);
router.get('/genre/:id', genre_controller.genreDetail);
router.get('/genres', genre_controller.genreList);

// BOOKINSTANCE ROUTES
router.get('/bookinstance/create', book_instance_controller.bookinstanceCreateGet);
router.post('/bookinstance/create', book_instance_controller.bookinstanceCreatePost);
router.get('/bookinstance/:id/delete', book_instance_controller.bookinstanceDeleteGet);
router.post('/bookinstance/:id/delete', book_instance_controller.bookinstanceDeletePost);
router.get('/bookinstance/:id/update', book_instance_controller.bookinstanceUpdateGet);
router.post('/bookinstance/:id/update', book_instance_controller.bookinstanceUpdatePost);
router.get('/bookinstance/:id', book_instance_controller.bookinstanceDetail);
router.get('/bookinstances', book_instance_controller.bookinstanceList);

module.exports = router;