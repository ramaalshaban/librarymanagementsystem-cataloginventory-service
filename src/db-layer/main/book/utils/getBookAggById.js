const { HttpServerError } = require("common");

const { Book } = require("models");

const getBookAggById = async (bookId) => {
  try {
    let bookQuery;

    if (Array.isArray(bookId)) {
      bookQuery = Book.find({
        _id: { $in: bookId },
        isActive: true,
      });
    } else {
      bookQuery = Book.findOne({
        _id: bookId,
        isActive: true,
      });
    }

    // Populate associations as needed

    const book = await bookQuery.exec();

    if (!book) {
      return null;
    }
    const bookData =
      Array.isArray(bookId) && bookId.length > 0
        ? book.map((item) => item.getData())
        : book.getData();

    // should i add this here?
    await Book.getCqrsJoins(bookData);

    return bookData;
  } catch (err) {
    console.log(err);
    throw new HttpServerError("errMsg_dbErrorWhenRequestingBookAggById", err);
  }
};

// "__PropertyEnumSettings.doc": "Enum configuration for the data property, applicable when the property type is set to Enum. While enum values are stored as integers in the database, defining the enum options here allows Mindbricks to enrich API responses with human-readable labels, easing interpretation and UI integration. If not defined, only the numeric value will be returned.",
// "PropertyEnumSettings": {
//   "__hasEnumOptions.doc": "Enables support for named enum values when the property type is Enum. Though values are stored as integers, enabling this adds the symbolic name to API responses for clarity.",
//   "__config.doc": "The configuration object for enum options. Leave it null if hasEnumOptions is false.",
//   "__activation": "hasEnumOptions",
//  "__lines": "\
//  a-hasEnumOptions\
//  g-config",
//  "hasEnumOptions": "Boolean",
//  "config": "PropertyEnumSettingsConfig"
//},

module.exports = getBookAggById;
