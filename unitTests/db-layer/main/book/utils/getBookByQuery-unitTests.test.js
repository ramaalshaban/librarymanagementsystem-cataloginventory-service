const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getBookByQuery module", () => {
  let sandbox;
  let getBookByQuery;
  let BookStub;

  const fakeId = "uuid-123";
  const fakeRecord = {
    id: fakeId,
    name: "Test Book",
    getData: () => ({ id: fakeId, name: "Test Book" }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    BookStub = {
      findOne: sandbox.stub().resolves(fakeRecord),
    };

    getBookByQuery = proxyquire(
      "../../../../../src/db-layer/main/Book/utils/getBookByQuery",
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
        },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("getBookByQuery", () => {
    it("should return the result of getData if found", async () => {
      const result = await getBookByQuery({ id: fakeId });

      expect(result).to.deep.equal({ id: fakeId, name: "Test Book" });
      sinon.assert.calledOnce(BookStub.findOne);
      sinon.assert.calledWith(BookStub.findOne, {
        where: {
          id: fakeId,
          isActive: true,
        },
      });
    });

    it("should return null if no record is found", async () => {
      BookStub.findOne.resolves(null);

      const result = await getBookByQuery({ id: fakeId });

      expect(result).to.be.null;
      sinon.assert.calledOnce(BookStub.findOne);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getBookByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getBookByQuery("invalid-query");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should wrap findOne errors in HttpServerError", async () => {
      BookStub.findOne.rejects(new Error("findOne failed"));

      try {
        await getBookByQuery({ test: true });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal("errMsg_dbErrorWhenRequestingBookByQuery");
        expect(err.details.message).to.equal("findOne failed");
      }
    });

    it("should return undefined if getData returns undefined", async () => {
      BookStub.findOne.resolves({ getData: () => undefined });

      const result = await getBookByQuery({ id: fakeId });

      expect(result).to.be.undefined;
    });
  });
});
