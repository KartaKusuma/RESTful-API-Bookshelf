const {
  saveBookData, getAllBooks, getBookById, updateBookData, deleteBookData,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: saveBookData,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooks,
  },
  {
    method: 'GET',
    path: '/books/{id}',
    handler: getBookById,
  },
  {
    method: 'PUT',
    path: '/books/{id}',
    handler: updateBookData,
  },
  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: deleteBookData,
  },
];

module.exports = routes;
