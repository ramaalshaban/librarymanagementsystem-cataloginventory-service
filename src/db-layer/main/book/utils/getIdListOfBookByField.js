const { HttpServerError, NotFoundError, BadRequestError } = require("common");

const { Book } = require("models");
const { Op } = require("sequelize");

const getIdListOfBookByField = async (fieldName, fieldValue, isArray) => {
  try {
    let isValidField = false;

    const bookProperties = [
      "id",
      "title",
      "authors",
      "isbn",
      "synopsis",
      "genres",
      "publicationDate",
      "language",
      "publisher",
      "coverImageUrl",
    ];

    isValidField = bookProperties.includes(fieldName);

    if (!isValidField) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    const expectedType = typeof Book[fieldName];

    if (typeof fieldValue !== expectedType) {
      throw new BadRequestError(
        `Invalid field value type for ${fieldName}. Expected ${expectedType}.`,
      );
    }

    const options = {
      where: isArray
        ? { [fieldName]: { [Op.contains]: [fieldValue] }, isActive: true }
        : { [fieldName]: fieldValue, isActive: true },
      attributes: ["id"],
    };

    let bookIdList = await Book.findAll(options);

    if (!bookIdList || bookIdList.length === 0) {
      throw new NotFoundError(`Book with the specified criteria not found`);
    }

    bookIdList = bookIdList.map((item) => item.id);
    return bookIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingBookIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfBookByField;
