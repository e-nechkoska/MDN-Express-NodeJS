let Genre = require('../models/genre');

let genre_list = function(req, res) {
  res.send('NOT IMPLEMENTED: Genre list');
};

let genre_detail = function(req, res) {
  res.send('NOT IMPLEMENTED: Genre detail: ' + req.params.id);
};

let genre_create_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Genre create GET');
};

let genre_create_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Genre create POST');
};

let genre_delete_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Genre delete GET');
};

let genre_delete_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Genre delete POST');
};

let genre_update_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Genre update GET');
};

let genre_update_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Genre update POST');
};

module.exports = {
  genre_list,
  genre_detail,
  genre_create_get,
  genre_create_post,
  genre_delete_get,
  genre_delete_post,
  genre_update_get,
  genre_update_post
};