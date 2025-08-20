const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getBookById module", () => {
  let sandbox;
  let getBookById;
  let BookStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test Book" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    BookStub = {
      findOne: sandbox.stub().resolves({
        getData: () => fakeData,
      }),
      findAll: sandbox
        .stub()
        .resolves([
          { getData: () => ({ id: "1", name: "Item 1" }) },
          { getData: () => ({ id: "2", name: "Item 2" }) },
        ]),
    };

    getBookById = proxyquire(
      "../../../../../src/db-layer/main/Book/utils/getBookById",
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
        sequelize: { Op },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("getBookById", () => {
    it("should return getData() for single ID", async () => {
      const result = await getBookById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(BookStub.findOne);
      sinon.assert.calledWith(
        BookStub.findOne,
        sinon.match.has("where", sinon.match.has("id", fakeId)),
      );
    });

    it("should return mapped getData() results for array of IDs", async () => {
      const result = await getBookById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(BookStub.findAll);
      sinon.assert.calledWithMatch(BookStub.findAll, {
        where: { id: { [Op.in]: ["1", "2"] } },
      });
    });

    it("should return null if record not found (single ID)", async () => {
      BookStub.findOne.resolves(null);
      const result = await getBookById(fakeId);
      expect(result).to.be.null;
    });

    it("should return null if empty array returned from findAll", async () => {
      BookStub.findAll.resolves([]);
      const result = await getBookById(["a", "b"]);
      expect(result).to.deep.equal([]);
    });

    it("should wrap unexpected errors with HttpServerError (single ID)", async () => {
      BookStub.findOne.rejects(new Error("DB failure"));
      try {
        await getBookById("test");
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal("errMsg_dbErrorWhenRequestingBookById");
        expect(err.details.message).to.equal("DB failure");
      }
    });

    it("should wrap unexpected errors with HttpServerError (array of IDs)", async () => {
      BookStub.findAll.rejects(new Error("array failure"));
      try {
        await getBookById(["fail"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal("errMsg_dbErrorWhenRequestingBookById");
        expect(err.details.message).to.equal("array failure");
      }
    });

    it("should return undefined if getData() returns undefined", async () => {
      BookStub.findOne.resolves({ getData: () => undefined });
      const result = await getBookById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should return array of undefineds if getData() returns undefined per item", async () => {
      BookStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getBookById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });
  });
});
