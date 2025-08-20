const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getBookAggById module", () => {
  let sandbox;
  let getBookAggById;
  let BookStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test Book" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    BookStub = {
      findOne: sandbox.stub().resolves({ getData: () => fakeData }),
      findAll: sandbox
        .stub()
        .resolves([
          { getData: () => ({ id: "1", name: "Item 1" }) },
          { getData: () => ({ id: "2", name: "Item 2" }) },
        ]),
      getCqrsJoins: sandbox.stub().resolves(),
    };

    getBookAggById = proxyquire(
      "../../../../../src/db-layer/main/Book/utils/getBookAggById",
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

  describe("getBookAggById", () => {
    it("should return getData() with includes for single ID", async () => {
      const result = await getBookAggById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(BookStub.findOne);
      sinon.assert.calledOnce(BookStub.getCqrsJoins);
    });

    it("should return mapped getData() for array of IDs", async () => {
      const result = await getBookAggById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(BookStub.findAll);
      sinon.assert.calledOnce(BookStub.getCqrsJoins);
    });

    it("should return null if not found for single ID", async () => {
      BookStub.findOne.resolves(null);
      const result = await getBookAggById(fakeId);
      expect(result).to.equal(null);
    });

    it("should return empty array if input is array but no results", async () => {
      BookStub.findAll.resolves([]);
      const result = await getBookAggById(["nope"]);
      expect(result).to.deep.equal([]);
    });

    it("should return undefined if getData returns undefined in array items", async () => {
      BookStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getBookAggById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should return undefined if getData returns undefined in single ID", async () => {
      BookStub.findOne.resolves({ getData: () => undefined });
      const result = await getBookAggById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should throw HttpServerError on unexpected error (findOne)", async () => {
      BookStub.findOne.rejects(new Error("fail"));
      try {
        await getBookAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal("errMsg_dbErrorWhenRequestingBookAggById");
        expect(err.details.message).to.equal("fail");
      }
    });

    it("should throw HttpServerError on unexpected error (findAll)", async () => {
      BookStub.findAll.rejects(new Error("all fail"));
      try {
        await getBookAggById(["1"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal("errMsg_dbErrorWhenRequestingBookAggById");
        expect(err.details.message).to.equal("all fail");
      }
    });

    it("should throw HttpServerError if getCqrsJoins fails", async () => {
      BookStub.getCqrsJoins.rejects(new Error("joins fail"));
      try {
        await getBookAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal("errMsg_dbErrorWhenRequestingBookAggById");
        expect(err.details.message).to.equal("joins fail");
      }
    });
  });
});
