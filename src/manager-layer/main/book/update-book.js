const BookManager = require("./BookManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { dbUpdateBook } = require("dbLayer");

class UpdateBookManager extends BookManager {
  constructor(request, controllerType) {
    super(request, {
      name: "updateBook",
      controllerType: controllerType,
      pagination: false,
      crudType: "update",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "book";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.bookId = this.bookId;
    jsonObj.title = this.title;
    jsonObj.authors = this.authors;
    jsonObj.isbn = this.isbn;
    jsonObj.synopsis = this.synopsis;
    jsonObj.genres = this.genres;
    jsonObj.publicationDate = this.publicationDate;
    jsonObj.language = this.language;
    jsonObj.publisher = this.publisher;
    jsonObj.coverImageUrl = this.coverImageUrl;
  }

  readRestParameters(request) {
    this.bookId = request.params?.bookId;
    this.title = request.body?.title;
    this.authors = request.body?.authors;
    this.isbn = request.body?.isbn;
    this.synopsis = request.body?.synopsis;
    this.genres = request.body?.genres;
    this.publicationDate = request.body?.publicationDate;
    this.language = request.body?.language;
    this.publisher = request.body?.publisher;
    this.coverImageUrl = request.body?.coverImageUrl;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.bookId = request.mcpParams.bookId;
    this.title = request.mcpParams.title;
    this.authors = request.mcpParams.authors;
    this.isbn = request.mcpParams.isbn;
    this.synopsis = request.mcpParams.synopsis;
    this.genres = request.mcpParams.genres;
    this.publicationDate = request.mcpParams.publicationDate;
    this.language = request.mcpParams.language;
    this.publisher = request.mcpParams.publisher;
    this.coverImageUrl = request.mcpParams.coverImageUrl;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  async fetchInstance() {
    const { getBookById } = require("dbLayer");
    this.book = await getBookById(this.bookId);
    if (!this.book) {
      throw new NotFoundError("errMsg_RecordNotFound");
    }
  }

  checkParameters() {
    if (this.bookId == null) {
      throw new BadRequestError("errMsg_bookIdisRequired");
    }

    // ID
    if (
      this.bookId &&
      !isValidObjectId(this.bookId) &&
      !isValidUUID(this.bookId)
    ) {
      throw new BadRequestError("errMsg_bookIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.book?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbUpdateBook function to update the book and return the result to the controller
    const book = await dbUpdateBook(this);

    return book;
  }

  async getRouteQuery() {
    return { $and: [{ id: this.bookId }, { isActive: true }] };

    // handle permission filter later
  }

  async getWhereClause() {
    const { convertUserQueryToMongoDbQuery } = require("common");

    const routeQuery = await this.getRouteQuery();
    return convertUserQueryToMongoDbQuery(routeQuery);
  }

  async getDataClause() {
    const { hashString } = require("common");

    const dataClause = {
      title: this.title,
      authors: this.authors,
      isbn: this.isbn,
      synopsis: this.synopsis,
      genres: this.genres,
      publicationDate: this.publicationDate,
      language: this.language,
      publisher: this.publisher,
      coverImageUrl: this.coverImageUrl,
    };

    return dataClause;
  }
}

module.exports = UpdateBookManager;
