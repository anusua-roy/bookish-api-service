const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const booksRoutes = require("./routes/books-routes");
// const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error.js");

const app = express();

app.use(bodyParser.json());

app.use("/api/books", booksRoutes); // /api/books/something...
// app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  throw new HttpError("Could not find this route.", 404);
});

app.use((error, req, res, next) => {
  if (res.headerSent) return next(error);
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect(
    "mongodb+srv://Anusua:Ag2PbIWueZHRZD1K@analytics.k6ev1.mongodb.net/bookish?retryWrites=true&w=majority&appName=analytics"
  )
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
