const { nanoid } = require('nanoid');
const books = require('./books');

const addBook = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
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
  books.push(newBook);
  const idSuccess = books.filter((book) => book.id === id).length > 0;
  const readPageFail = readPage > pageCount;

  if (!name || name.length < 1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    books.pop();
    response.code(400);
    return response;
  }

  if (readPageFail) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    books.pop();
    response.code(400);
    return response;
  }

  if (year === '' || author === '' || summary === '' || publisher === '' || pageCount === '' || readPage === '' || reading === '') {
    const response = h.response({
      status: 'error',
      message: 'Buku gagal ditambahkan',
    });
    books.pop();
    response.code(500);
    return response;
  }

  if (idSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });

    response.header('Access-Control-Allow-Origin', '*');
    response.code(201);
    return response;
  }
  const response = h.response({});
  return response;
};

const getAllBook = (request, h) => {
  const bookFiltered = books.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));
  const response = h.response({
    status: 'success',
    data: {
      books: bookFiltered,
    },
  });
  response.code(200);
  return response;
};

const getSpecifiedBook = (request, h) => {
  const { id } = request.params;
  const book = books.filter((b) => b.id === id)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBook = (request, h) => {
  const { id } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const finished = pageCount === readPage;
  const updatedAt = new Date().toISOString();

  const readPageFail = readPage > pageCount;

  const index = books.findIndex((book) => book.id === id);

  if (!name || name.length < 1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  }

  if (readPageFail) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);
    return response;
  }

  if (year === '' || author === '' || summary === '' || publisher === '' || pageCount === '' || readPage === '' || reading === '') {
    const response = h.response({
      status: 'error',
      message: 'Buku gagal ditambahkan',
    });

    response.code(500);
    return response;
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
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

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBook = (request, h) => {
  const { id } = request.params;
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};
module.exports = {
  addBook, getAllBook, getSpecifiedBook, editBook, deleteBook,
};
