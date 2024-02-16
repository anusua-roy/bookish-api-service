const express = require("express");
const { check } = require("express-validator");

const booksControllers = require("../controllers/books-controllers");

const router = express.Router();

router.get("/", booksControllers.getAllBooks);

router.get("/:bid", booksControllers.getBookById);

router.post("/", check("title").not().isEmpty(), booksControllers.createBook);

router.patch(
  "/:bid",
  check("title").not().isEmpty(),
  booksControllers.updateBook
);

router.delete("/:pid", booksControllers.deleteBook);

module.exports = router;
