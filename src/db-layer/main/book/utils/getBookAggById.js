const { HttpServerError, NotFoundError } = require("common");
const { hexaLogger } = require("common");

const {
  Book,
  Branch,
  BranchInventory,
  InventoryAuditLog,
  InterBranchTransfer,
  PurchaseOrder,
  CatalogInventoryShareToken,
} = require("models");
const { Op } = require("sequelize");

const getBookAggById = async (bookId) => {
  try {
    const forWhereClause = false;
    const includes = [];

    const book = Array.isArray(bookId)
      ? await Book.findAll({
          where: {
            id: { [Op.in]: bookId },
            isActive: true,
          },
          include: includes,
        })
      : await Book.findOne({
          where: {
            id: bookId,
            isActive: true,
          },
          include: includes,
        });

    if (!book) {
      return null;
    }

    const bookData =
      Array.isArray(bookId) && bookId.length > 0
        ? book.map((item) => item.getData())
        : book.getData();
    await Book.getCqrsJoins(bookData);
    return bookData;
  } catch (err) {
    throw new HttpServerError("errMsg_dbErrorWhenRequestingBookAggById", err);
  }
};

module.exports = getBookAggById;
