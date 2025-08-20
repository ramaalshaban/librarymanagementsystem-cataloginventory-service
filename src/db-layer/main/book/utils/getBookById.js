const { HttpServerError } = require("common");

let { Book } = require("models");
const { hexaLogger } = require("common");
const { Op } = require("sequelize");

const getBookById = async (bookId) => {
  try {
    const book = Array.isArray(bookId)
      ? await Book.findAll({
          where: {
            id: { [Op.in]: bookId },
            isActive: true,
          },
        })
      : await Book.findOne({
          where: {
            id: bookId,
            isActive: true,
          },
        });

    if (!book) {
      return null;
    }
    return Array.isArray(bookId)
      ? book.map((item) => item.getData())
      : book.getData();
  } catch (err) {
    console.log(err);
    throw new HttpServerError("errMsg_dbErrorWhenRequestingBookById", err);
  }
};

module.exports = getBookById;
