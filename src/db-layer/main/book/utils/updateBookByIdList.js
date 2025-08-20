const { HttpServerError } = require("common");

const { Book } = require("models");

const updateBookByIdList = async (idList, dataClause) => {
  try {
    await Book.updateMany({ _id: { $in: idList }, isActive: true }, dataClause);

    const updatedDocs = await Book.find(
      { _id: { $in: idList }, isActive: true },
      { _id: 1 },
    );

    const bookIdList = updatedDocs.map((doc) => doc._id);

    return bookIdList;
  } catch (err) {
    throw new HttpServerError("errMsg_dbErrorWhenUpdatingBookByIdList", err);
  }
};

module.exports = updateBookByIdList;
