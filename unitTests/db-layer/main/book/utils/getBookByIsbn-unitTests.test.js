const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getBookByIsbn module", () => {
  let sandbox;
  let getBookByIsbn;
  let BookStub;

  const mockData = { id: "123", name: "Test Book" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    BookStub = {
      findOne: sandbox.stub().resolves({
        getData: () => mockData,
      }),
    };

    getBookByIsbn = proxyquire(
      "../../../../../src/db-layer/main/Book/utils/getBookByIsbn",
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
        },
        sequelize: { Op: require("sequelize").Op },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("getBookByIsbn", () => {
    it("should return getData() if book is found", async () => {
      const result = await getBookByIsbn("some-key");
      expect(result).to.deep.equal(mockData);
      sinon.assert.calledOnce(BookStub.findOne);
      sinon.assert.calledWithMatch(BookStub.findOne, {
        where: { isbn: "some-key" },
      });
    });

    it("should return null if book is not found", async () => {
      BookStub.findOne.resolves(null);
      const result = await getBookByIsbn("missing-key");
      expect(result).to.equal(null);
    });

    it("should return undefined if getData returns undefined", async () => {
      BookStub.findOne.resolves({ getData: () => undefined });
      const result = await getBookByIsbn("key");
      expect(result).to.be.undefined;
    });

    it("should throw HttpServerError if findOne throws", async () => {
      BookStub.findOne.rejects(new Error("db failure"));

      try {
        await getBookByIsbn("key");
        throw new Error("Expected to throw");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal("errMsg_dbErrorWhenRequestingBookByIsbn");
        expect(err.details.message).to.equal("db failure");
      }
    });
  });
});
