const { HttpServerError, BadRequestError } = require("common");

const { Book } = require("models");

const getBookByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const book = await Book.findOne({
      ...query,
      isActive: true,
    });

    if (!book) return null;

    return book.getData();
  } catch (err) {
    throw new HttpServerError("errMsg_dbErrorWhenRequestingBookByQuery", err);
  }
};

module.exports = getBookByQuery;
