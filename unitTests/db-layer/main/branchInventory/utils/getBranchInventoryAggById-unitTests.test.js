const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getBranchInventoryAggById module", () => {
  let sandbox;
  let getBranchInventoryAggById;
  let BranchInventoryStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test BranchInventory" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    BranchInventoryStub = {
      findOne: sandbox.stub().resolves({ getData: () => fakeData }),
      findAll: sandbox
        .stub()
        .resolves([
          { getData: () => ({ id: "1", name: "Item 1" }) },
          { getData: () => ({ id: "2", name: "Item 2" }) },
        ]),
      getCqrsJoins: sandbox.stub().resolves(),
    };

    getBranchInventoryAggById = proxyquire(
      "../../../../../src/db-layer/main/BranchInventory/utils/getBranchInventoryAggById",
      {
        models: { BranchInventory: BranchInventoryStub },
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

  describe("getBranchInventoryAggById", () => {
    it("should return getData() with includes for single ID", async () => {
      const result = await getBranchInventoryAggById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(BranchInventoryStub.findOne);
      sinon.assert.calledOnce(BranchInventoryStub.getCqrsJoins);
    });

    it("should return mapped getData() for array of IDs", async () => {
      const result = await getBranchInventoryAggById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(BranchInventoryStub.findAll);
      sinon.assert.calledOnce(BranchInventoryStub.getCqrsJoins);
    });

    it("should return null if not found for single ID", async () => {
      BranchInventoryStub.findOne.resolves(null);
      const result = await getBranchInventoryAggById(fakeId);
      expect(result).to.equal(null);
    });

    it("should return empty array if input is array but no results", async () => {
      BranchInventoryStub.findAll.resolves([]);
      const result = await getBranchInventoryAggById(["nope"]);
      expect(result).to.deep.equal([]);
    });

    it("should return undefined if getData returns undefined in array items", async () => {
      BranchInventoryStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getBranchInventoryAggById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should return undefined if getData returns undefined in single ID", async () => {
      BranchInventoryStub.findOne.resolves({ getData: () => undefined });
      const result = await getBranchInventoryAggById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should throw HttpServerError on unexpected error (findOne)", async () => {
      BranchInventoryStub.findOne.rejects(new Error("fail"));
      try {
        await getBranchInventoryAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingBranchInventoryAggById",
        );
        expect(err.details.message).to.equal("fail");
      }
    });

    it("should throw HttpServerError on unexpected error (findAll)", async () => {
      BranchInventoryStub.findAll.rejects(new Error("all fail"));
      try {
        await getBranchInventoryAggById(["1"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingBranchInventoryAggById",
        );
        expect(err.details.message).to.equal("all fail");
      }
    });

    it("should throw HttpServerError if getCqrsJoins fails", async () => {
      BranchInventoryStub.getCqrsJoins.rejects(new Error("joins fail"));
      try {
        await getBranchInventoryAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingBranchInventoryAggById",
        );
        expect(err.details.message).to.equal("joins fail");
      }
    });
  });
});
