const { bookinstanceList, bookinstanceDetail } = require('./getBookinstanceController');
const { bookinstanceCreateGet, bookinstanceCreatePost } = require('./createBookinstanceController');
const { bookinstanceUpdateGet, bookinstanceUpdatePost } = require('./updateBookinstanceController');
const { bookinstanceDeleteGet, bookinstanceDeletePost } = require('./deleteBookinstanceController');

module.exports = {
  bookinstanceList,
  bookinstanceDetail,
  bookinstanceCreateGet,
  bookinstanceCreatePost,
  bookinstanceUpdateGet,
  bookinstanceUpdatePost,
  bookinstanceDeleteGet,
  bookinstanceDeletePost
}