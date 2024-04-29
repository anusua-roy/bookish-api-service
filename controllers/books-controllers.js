const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const Book = require("../models/book");

const getAllBooks = async (req, res, next) => {
  let books;

  try {
    books = await Book.find();
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not find books.", 500)
    );
  }

  if (!books || books.length === 0) {
    return next(new HttpError("No books available. Create a new book.", 404));
  }
  res.json({
    books: books.map((book) => book.toObject({ getters: true })),
  });
};

const getBookById = async (req, res, next) => {
  const bookId = req.params.bid;

  let book;
  try {
    book = await Book.findById(bookId);
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not find a book.", 500)
    );
  }

  if (!book) {
    return next(
      new HttpError("Could not find a book for the provided book id.", 404)
    );
  }

  res.json({
    book: book.toObject({ getters: true }),
  });
};

const createBook = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title } = req.body;

  const createdBook = new Book({
    title,
  });

  try {
    await createdBook.save();
  } catch (err) {
    return next(new HttpError("Creating book failed, please try again.", 500));
  }

  res.status(201).json({ book: createdBook });
};

const updateBook = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
  }
  const { title } = req.body;
  const bookId = req.params.bid;

  let book;
  try {
    book = await Book.findById(bookId);
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not update book.", 500)
    );
  }

  if (!book) {
    return next(
      new HttpError("Could not find a book for the provided book id.", 404)
    );
  }

  book.title = title;

  try {
    await book.save();
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not update book.", 500)
    );
  }

  res.status(200).json({ book: book.toObject({ getters: true }) });
};

const deleteBook = (req, res, next) => {
  //   const placeId = req.params.pid;
  //   if (!DUMMY_PLACES.find((p) => p.id === placeId)) {
  //     throw new HttpError("Could not find a place for that id.", 404);
  //   }
  //   DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);
  //   res.status(200).json({ message: "Deleted place." });
};

exports.getAllBooks = getAllBooks;
exports.getBookById = getBookById;
exports.createBook = createBook;
exports.updateBook = updateBook;
exports.deleteBook = deleteBook;
