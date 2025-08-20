const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getPurchaseOrderAggById module", () => {
  let sandbox;
  let getPurchaseOrderAggById;
  let PurchaseOrderStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test PurchaseOrder" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    PurchaseOrderStub = {
      findOne: sandbox.stub().resolves({ getData: () => fakeData }),
      findAll: sandbox
        .stub()
        .resolves([
          { getData: () => ({ id: "1", name: "Item 1" }) },
          { getData: () => ({ id: "2", name: "Item 2" }) },
        ]),
      getCqrsJoins: sandbox.stub().resolves(),
    };

    getPurchaseOrderAggById = proxyquire(
      "../../../../../src/db-layer/main/PurchaseOrder/utils/getPurchaseOrderAggById",
      {
        models: { PurchaseOrder: PurchaseOrderStub },
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

  describe("getPurchaseOrderAggById", () => {
    it("should return getData() with includes for single ID", async () => {
      const result = await getPurchaseOrderAggById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(PurchaseOrderStub.findOne);
      sinon.assert.calledOnce(PurchaseOrderStub.getCqrsJoins);
    });

    it("should return mapped getData() for array of IDs", async () => {
      const result = await getPurchaseOrderAggById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(PurchaseOrderStub.findAll);
      sinon.assert.calledOnce(PurchaseOrderStub.getCqrsJoins);
    });

    it("should return null if not found for single ID", async () => {
      PurchaseOrderStub.findOne.resolves(null);
      const result = await getPurchaseOrderAggById(fakeId);
      expect(result).to.equal(null);
    });

    it("should return empty array if input is array but no results", async () => {
      PurchaseOrderStub.findAll.resolves([]);
      const result = await getPurchaseOrderAggById(["nope"]);
      expect(result).to.deep.equal([]);
    });

    it("should return undefined if getData returns undefined in array items", async () => {
      PurchaseOrderStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getPurchaseOrderAggById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should return undefined if getData returns undefined in single ID", async () => {
      PurchaseOrderStub.findOne.resolves({ getData: () => undefined });
      const result = await getPurchaseOrderAggById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should throw HttpServerError on unexpected error (findOne)", async () => {
      PurchaseOrderStub.findOne.rejects(new Error("fail"));
      try {
        await getPurchaseOrderAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingPurchaseOrderAggById",
        );
        expect(err.details.message).to.equal("fail");
      }
    });

    it("should throw HttpServerError on unexpected error (findAll)", async () => {
      PurchaseOrderStub.findAll.rejects(new Error("all fail"));
      try {
        await getPurchaseOrderAggById(["1"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingPurchaseOrderAggById",
        );
        expect(err.details.message).to.equal("all fail");
      }
    });

    it("should throw HttpServerError if getCqrsJoins fails", async () => {
      PurchaseOrderStub.getCqrsJoins.rejects(new Error("joins fail"));
      try {
        await getPurchaseOrderAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingPurchaseOrderAggById",
        );
        expect(err.details.message).to.equal("joins fail");
      }
    });
  });
});
