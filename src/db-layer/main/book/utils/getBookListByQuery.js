const { HttpServerError, BadRequestError, NotFoundError } = require("common");
const { Book } = require("models");

const getBookListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const book = await Book.find(query);

    if (!book || book.length === 0) return [];

    //should i add not found error or only return empty array?
    //      if (!book || book.length === 0) {
    //      throw new NotFoundError(
    //      `Book with the specified criteria not found`
    //  );
    //}

    return book.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingBookListByQuery",
      err,
    );
  }
};

module.exports = getBookListByQuery;
