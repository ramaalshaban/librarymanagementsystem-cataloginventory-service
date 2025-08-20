const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { Book } = require("models");

const getBookByIsbn = async (isbn) => {
  try {
    const book = await Book.findOne({
      isbn: isbn,
      isActive: true,
    });

    if (!book) {
      return null;
    }

    return book.getData();
  } catch (err) {
    throw new HttpServerError("errMsg_dbErrorWhenRequestingBookByIsbn", err);
  }
};

module.exports = getBookByIsbn;
