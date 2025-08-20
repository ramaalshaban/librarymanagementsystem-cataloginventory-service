const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getPurchaseOrderById module", () => {
  let sandbox;
  let getPurchaseOrderById;
  let PurchaseOrderStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test PurchaseOrder" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    PurchaseOrderStub = {
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

    getPurchaseOrderById = proxyquire(
      "../../../../../src/db-layer/main/PurchaseOrder/utils/getPurchaseOrderById",
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

  describe("getPurchaseOrderById", () => {
    it("should return getData() for single ID", async () => {
      const result = await getPurchaseOrderById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(PurchaseOrderStub.findOne);
      sinon.assert.calledWith(
        PurchaseOrderStub.findOne,
        sinon.match.has("where", sinon.match.has("id", fakeId)),
      );
    });

    it("should return mapped getData() results for array of IDs", async () => {
      const result = await getPurchaseOrderById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(PurchaseOrderStub.findAll);
      sinon.assert.calledWithMatch(PurchaseOrderStub.findAll, {
        where: { id: { [Op.in]: ["1", "2"] } },
      });
    });

    it("should return null if record not found (single ID)", async () => {
      PurchaseOrderStub.findOne.resolves(null);
      const result = await getPurchaseOrderById(fakeId);
      expect(result).to.be.null;
    });

    it("should return null if empty array returned from findAll", async () => {
      PurchaseOrderStub.findAll.resolves([]);
      const result = await getPurchaseOrderById(["a", "b"]);
      expect(result).to.deep.equal([]);
    });

    it("should wrap unexpected errors with HttpServerError (single ID)", async () => {
      PurchaseOrderStub.findOne.rejects(new Error("DB failure"));
      try {
        await getPurchaseOrderById("test");
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingPurchaseOrderById",
        );
        expect(err.details.message).to.equal("DB failure");
      }
    });

    it("should wrap unexpected errors with HttpServerError (array of IDs)", async () => {
      PurchaseOrderStub.findAll.rejects(new Error("array failure"));
      try {
        await getPurchaseOrderById(["fail"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingPurchaseOrderById",
        );
        expect(err.details.message).to.equal("array failure");
      }
    });

    it("should return undefined if getData() returns undefined", async () => {
      PurchaseOrderStub.findOne.resolves({ getData: () => undefined });
      const result = await getPurchaseOrderById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should return array of undefineds if getData() returns undefined per item", async () => {
      PurchaseOrderStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getPurchaseOrderById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });
  });
});
