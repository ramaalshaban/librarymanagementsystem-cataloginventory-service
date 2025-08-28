const { HttpServerError } = require("common");

const { Book } = require("models");

const getBookById = async (bookId) => {
  try {
    let book;

    if (Array.isArray(bookId)) {
      book = await Book.find({
        _id: { $in: bookId },
        isActive: true,
      });
    } else {
      book = await Book.findOne({
        _id: bookId,
        isActive: true,
      });
    }

    if (!book) {
      return null;
    }

    return Array.isArray(bookId)
      ? book.map((item) => item.getData())
      : book.getData();
  } catch (err) {
    throw new HttpServerError("errMsg_dbErrorWhenRequestingBookById", err);
  }
};

module.exports = getBookById;
