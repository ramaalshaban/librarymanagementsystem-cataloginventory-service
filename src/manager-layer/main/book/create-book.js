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
const { dbCreateBook } = require("dbLayer");

class CreateBookManager extends BookManager {
  constructor(request, controllerType) {
    super(request, {
      name: "createBook",
      controllerType: controllerType,
      pagination: false,
      crudType: "create",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "book";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
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
    this.title = request.body?.title;
    this.authors = request.body?.authors;
    this.isbn = request.body?.isbn;
    this.synopsis = request.body?.synopsis;
    this.genres = request.body?.genres;
    this.publicationDate = request.body?.publicationDate;
    this.language = request.body?.language;
    this.publisher = request.body?.publisher;
    this.coverImageUrl = request.body?.coverImageUrl;
    this.id = request.body?.id ?? request.query?.id ?? request.id;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.title = request.mcpParams.title;
    this.authors = request.mcpParams.authors;
    this.isbn = request.mcpParams.isbn;
    this.synopsis = request.mcpParams.synopsis;
    this.genres = request.mcpParams.genres;
    this.publicationDate = request.mcpParams.publicationDate;
    this.language = request.mcpParams.language;
    this.publisher = request.mcpParams.publisher;
    this.coverImageUrl = request.mcpParams.coverImageUrl;
    this.id = request.mcpParams?.id;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.title == null) {
      throw new BadRequestError("errMsg_titleisRequired");
    }

    if (this.authors == null) {
      throw new BadRequestError("errMsg_authorsisRequired");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.book?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbCreateBook function to create the book and return the result to the controller
    const book = await dbCreateBook(this);

    return book;
  }

  async getDataClause() {
    const { newObjectId } = require("common");

    const { hashString } = require("common");

    if (this.id) this.bookId = this.id;
    if (!this.bookId) this.bookId = newObjectId();

    const dataClause = {
      _id: this.bookId,
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

module.exports = CreateBookManager;
