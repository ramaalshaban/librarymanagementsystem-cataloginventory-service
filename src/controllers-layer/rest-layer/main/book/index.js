const express = require("express");

// Book Db Object Rest Api Router
const bookRouter = express.Router();

// add Book controllers

// getBook controller
bookRouter.get("/books/:bookId", require("./get-book"));
// createBook controller
bookRouter.post("/books", require("./create-book"));
// updateBook controller
bookRouter.patch("/books/:bookId", require("./update-book"));
// deleteBook controller
bookRouter.delete("/books/:bookId", require("./delete-book"));
// listBooks controller
bookRouter.get("/books", require("./list-books"));

module.exports = bookRouter;
