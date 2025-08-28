const utils = require("./utils");
const dbApiScripts = require("./dbApiScripts");

module.exports = {
  dbGetBook: require("./dbGetBook"),
  dbCreateBook: require("./dbCreateBook"),
  dbUpdateBook: require("./dbUpdateBook"),
  dbDeleteBook: require("./dbDeleteBook"),
  dbListBooks: require("./dbListBooks"),
  createBook: utils.createBook,
  getIdListOfBookByField: utils.getIdListOfBookByField,
  getBookById: utils.getBookById,
  getBookAggById: utils.getBookAggById,
  getBookListByQuery: utils.getBookListByQuery,
  getBookStatsByQuery: utils.getBookStatsByQuery,
  getBookByQuery: utils.getBookByQuery,
  updateBookById: utils.updateBookById,
  updateBookByIdList: utils.updateBookByIdList,
  updateBookByQuery: utils.updateBookByQuery,
  deleteBookById: utils.deleteBookById,
  deleteBookByQuery: utils.deleteBookByQuery,
  getBookByIsbn: utils.getBookByIsbn,
};
