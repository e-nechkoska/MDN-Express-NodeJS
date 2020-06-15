const { authorList, authorDetail } = require('./getAuthorController');
const { authorCreateGet, authorCreatePost } = require('./createAuthorController');
const { authorUpdateGet, authorUpdatePost } = require('./updateAuthorController');
const { authorDeleteGet, authorDeletePost } = require('./deleteAuthorController');

module.exports = {
  authorList,
  authorDetail,
  authorCreateGet,
  authorCreatePost,
  authorUpdateGet,
  authorUpdatePost,
  authorDeleteGet,
  authorDeletePost
};
