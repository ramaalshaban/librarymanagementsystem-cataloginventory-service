const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { hexaLogger } = require("common");
const { Book } = require("models");
const { Op } = require("sequelize");

const getBookByIsbn = async (isbn) => {
  try {
    const book = await Book.findOne({
      where: {
        isbn: isbn,
        isActive: true,
      },
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
