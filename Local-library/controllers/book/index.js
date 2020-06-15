const { index } = require('./indexBookController');
const { bookList, bookDetail } = require('./getBookController');
const { bookCreateGet, bookCreatePost } = require('./createBookController');
const { bookUpdateGet, bookUpdatePost } = require('./updateBookController');
const { bookDeleteGet, bookDeletePost } = require('./deleteBookController');

module.exports = {
  index,
  bookList,
  bookDetail,
  bookCreateGet,
  bookCreatePost,
  bookUpdateGet,
  bookUpdatePost,
  bookDeleteGet,
  bookDeletePost
};
