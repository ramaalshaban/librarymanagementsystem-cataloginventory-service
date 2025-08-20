const { HttpServerError } = require("common");

const { Book } = require("models");
const { Op } = require("sequelize");

const updateBookByIdList = async (idList, dataClause) => {
  try {
    let rowsCount = null;
    let rows = null;

    const options = {
      where: { id: { [Op.in]: idList }, isActive: true },
      returning: true,
    };

    [rowsCount, rows] = await Book.update(dataClause, options);
    const bookIdList = rows.map((item) => item.id);
    return bookIdList;
  } catch (err) {
    throw new HttpServerError("errMsg_dbErrorWhenUpdatingBookByIdList", err);
  }
};

module.exports = updateBookByIdList;
