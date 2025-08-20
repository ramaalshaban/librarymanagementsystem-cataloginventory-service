const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getIdListOfBookByField module", () => {
  let sandbox;
  let getIdListOfBookByField;
  let BookStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    BookStub = {
      findAll: sandbox.stub().resolves([{ id: "1" }, { id: "2" }]),
      title: "example-type",
    };

    getIdListOfBookByField = proxyquire(
      "../../../../../src/db-layer/main/Book/utils/getIdListOfBookByField",
      {
        models: { Book: BookStub },
        common: {
          HttpServerError: class HttpServerError extends Error {
            constructor(msg, details) {
              super(msg);
              this.name = "HttpServerError";
              this.details = details;
            }
          },
          BadRequestError: class BadRequestError extends Error {
            constructor(msg) {
              super(msg);
              this.name = "BadRequestError";
            }
          },
          NotFoundError: class NotFoundError extends Error {
            constructor(msg) {
              super(msg);
              this.name = "NotFoundError";
            }
          },
        },
        sequelize: { Op },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("getIdListOfBookByField", () => {
    it("should return list of IDs when valid field and value is given", async () => {
      BookStub["title"] = "string";
      const result = await getIdListOfBookByField("title", "test-value", false);
      expect(result).to.deep.equal(["1", "2"]);
      sinon.assert.calledOnce(BookStub.findAll);
    });

    it("should return list of IDs using Op.contains if isArray is true", async () => {
      BookStub["title"] = "string";
      const result = await getIdListOfBookByField("title", "val", true);
      const call = BookStub.findAll.getCall(0);
      expect(call.args[0].where["title"][Op.contains]).to.include("val");
    });

    it("should throw BadRequestError if field name is invalid", async () => {
      try {
        await getIdListOfBookByField("nonexistentField", "x", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field name");
      }
    });

    it("should throw BadRequestError if field value has wrong type", async () => {
      BookStub["title"] = 123; // expects number

      try {
        await getIdListOfBookByField("title", "wrong-type", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field value type");
      }
    });

    it("should throw NotFoundError if no records are found", async () => {
      BookStub.findAll.resolves([]);
      BookStub["title"] = "string";

      try {
        await getIdListOfBookByField("title", "nomatch", false);
        throw new Error("Expected NotFoundError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("NotFoundError");
        expect(err.details.message).to.include(
          "Book with the specified criteria not found",
        );
      }
    });

    it("should wrap findAll error in HttpServerError", async () => {
      BookStub.findAll.rejects(new Error("query failed"));
      BookStub["title"] = "string";

      try {
        await getIdListOfBookByField("title", "test", false);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("query failed");
      }
    });
  });
});
