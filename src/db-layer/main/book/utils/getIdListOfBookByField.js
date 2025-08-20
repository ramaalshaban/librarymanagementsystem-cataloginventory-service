const { HttpServerError, BadRequestError, NotFoundError } = require("common");

const { Book } = require("models");

const getIdListOfBookByField = async (fieldName, fieldValue, isArray) => {
  try {
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

    if (!bookProperties.includes(fieldName)) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    // type validation different from sequelize for mongodb
    const schemaPath = Book.schema.paths[fieldName];
    if (schemaPath && fieldValue !== undefined && fieldValue !== null) {
      const expectedType = schemaPath.instance.toLowerCase();
      const actualType = typeof fieldValue;

      const typeMapping = {
        string: "string",
        number: "number",
        boolean: "boolean",
        objectid: "string", // ObjectIds are typically passed as strings
      };

      const expectedJSType = typeMapping[expectedType];
      if (expectedJSType && actualType !== expectedJSType) {
        throw new BadRequestError(
          `Invalid field value type for ${fieldName}. Expected ${expectedJSType}, got ${actualType}.`,
        );
      }
    }

    let query = isArray
      ? {
          [fieldName]: {
            $in: Array.isArray(fieldValue) ? fieldValue : [fieldValue],
          },
        }
      : { [fieldName]: fieldValue };

    query.isActive = true;

    let bookIdList = await Book.find(query, { _id: 1 }).lean().exec();

    if (!bookIdList || bookIdList.length === 0) {
      throw new NotFoundError(`Book with the specified criteria not found`);
    }

    bookIdList = bookIdList.map((item) => item._id.toString());

    return bookIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingBookIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfBookByField;
