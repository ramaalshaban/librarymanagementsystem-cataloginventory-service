module.exports = (headers) => {
  // Book Db Object Rest Api Router
  const bookMcpRouter = [];
  // getBook controller
  bookMcpRouter.push(require("./get-book")(headers));
  // createBook controller
  bookMcpRouter.push(require("./create-book")(headers));
  // updateBook controller
  bookMcpRouter.push(require("./update-book")(headers));
  // deleteBook controller
  bookMcpRouter.push(require("./delete-book")(headers));
  // listBooks controller
  bookMcpRouter.push(require("./list-books")(headers));
  return bookMcpRouter;
};
