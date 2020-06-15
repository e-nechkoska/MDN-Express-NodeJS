const { genreList, genreDetail } = require('./getGenreController');
const { genreCreateGet, genreCreatePost } = require('./createGenreController');
const { genreUpdateGet, genreUpdatePost } = require('./updateGenreController');
const { genreDeleteGet, genreDeletePost } = require('./deleteGenreController');

module.exports = {
  genreList,
  genreDetail,
  genreCreateGet,
  genreCreatePost,
  genreUpdateGet,
  genreUpdatePost,
  genreDeleteGet,
  genreDeletePost
};