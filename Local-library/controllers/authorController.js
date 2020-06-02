let Author = require('../models/author');

let author_list = function (req, res) {
  res.send('NOT IMPLEMENTED: Author list');
};

let author_detail = function (req, res) {
  res.send('NOT IMPLEMENTED: Author detail: ' + req.params.id);
};

let authro_create_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Author create GET');
};

let author_create_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Author create POST');
};

let author_delete_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Author delete GET');
};

let author_delete_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Author delete POST');
};

let author_update_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Author update GET');
};

let author_update_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Author update POSt');
};

module.exports = {
  author_list,
  author_detail,
  authro_create_get,
  author_create_post,
  author_delete_get,
  author_delete_post,
  author_update_get,
  author_update_post
};