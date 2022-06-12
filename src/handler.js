const { nanoid } = require('nanoid');
const books = require('./book');

const SUCCESS = 'success';
const FAIL = 'fail';

const saveBookData = (req, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;

  if (name === undefined) {
    const res = h.response({
      status: FAIL,
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    res.code(400);

    return res;
  }

  if (readPage > pageCount) {
    const res = h.response({
      status: FAIL,
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    res.code(400);

    return res;
  }

  const id = nanoid(16);
  const finished = (readPage === pageCount);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBookData = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBookData);

  const isBookDataAdded = books.filter((b) => b.id === id).length > 0;

  if (isBookDataAdded) {
    const res = h.response({
      status: SUCCESS,
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    res.code(201);

    return res;
  }

  const res = h.response({
    status: FAIL,
    message: 'Buku gagal ditambahkan',
  });
  res.code(500);

  return res;
};

const getAllBooks = (req, h) => {
  const { name, reading, finished } = req.query;
  let bookData = books;

  if (name !== undefined) {
    bookData = bookData.filter((b) => b.name.toLowerCase().includes(name.toLowerCase()));
  }

  if (finished !== undefined) {
    bookData = bookData.filter((b) => b.finished === !!Number(finished));
  }

  if (reading !== undefined) {
    bookData = bookData.filter((b) => b.reading === !!Number(reading));
  }

  const res = h.response({
    status: SUCCESS,
    data: {
      books: bookData.map((b) => ({
        id: b.id,
        name: b.name,
        publisher: b.publisher,
      })),
    },
  });
  res.code(200);

  return res;
};

const getBookById = (req, h) => {
  const { id } = req.params;
  const book = books.filter((b) => b.id === id)[0];

  if (book !== undefined) {
    return {
      status: SUCCESS,
      data: {
        book,
      },
    };
  }

  const res = h.response({
    status: FAIL,
    message: 'Buku tidak ditemukan',
  });
  res.code(404);

  return res;
};

const updateBookData = (req, h) => {
  const { id } = req.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;

  if (name === undefined) {
    const res = h.response({
      status: FAIL,
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    res.code(400);

    return res;
  }

  if (readPage > pageCount) {
    const res = h.response({
      status: FAIL,
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    res.code(400);

    return res;
  }

  const bookIndex = books.findIndex((b) => b.id === id);

  if (bookIndex !== -1) {
    const finished = (readPage === pageCount);
    const updatedAt = new Date().toISOString();

    books[bookIndex] = {
      ...books[bookIndex],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };

    const res = h.response({
      status: SUCCESS,
      message: 'Buku berhasil diperbarui',
    });
    res.code(200);

    return res;
  }

  const res = h.response({
    status: FAIL,
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  res.code(404);

  return res;
};

const deleteBookData = (req, h) => {
  const { id } = req.params;

  const bookIndex = books.findIndex((b) => b.id === id);

  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);

    const res = h.response({
      status: SUCCESS,
      message: 'Buku berhasil dihapus',
    });
    res.code(200);

    return res;
  }

  const res = h.response({
    status: FAIL,
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  res.code(404);

  return res;
};

module.exports = {
  saveBookData,
  getAllBooks,
  getBookById,
  updateBookData,
  deleteBookData,
};
