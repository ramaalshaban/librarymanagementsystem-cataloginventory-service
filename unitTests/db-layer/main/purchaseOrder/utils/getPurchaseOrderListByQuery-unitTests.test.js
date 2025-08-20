const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getPurchaseOrderListByQuery module", () => {
  let sandbox;
  let getPurchaseOrderListByQuery;
  let PurchaseOrderStub;

  const fakeList = [
    { getData: () => ({ id: "1", name: "Item 1" }) },
    { getData: () => ({ id: "2", name: "Item 2" }) },
  ];

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    PurchaseOrderStub = {
      findAll: sandbox.stub().resolves(fakeList),
    };

    getPurchaseOrderListByQuery = proxyquire(
      "../../../../../src/db-layer/main/PurchaseOrder/utils/getPurchaseOrderListByQuery",
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

  describe("getPurchaseOrderListByQuery", () => {
    it("should return list of getData() results if query is valid", async () => {
      const result = await getPurchaseOrderListByQuery({ isActive: true });

      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);

      sinon.assert.calledOnce(PurchaseOrderStub.findAll);
      sinon.assert.calledWithMatch(PurchaseOrderStub.findAll, {
        where: { isActive: true },
      });
    });

    it("should return [] if findAll returns null", async () => {
      PurchaseOrderStub.findAll.resolves(null);

      const result = await getPurchaseOrderListByQuery({ active: false });
      expect(result).to.deep.equal([]);
    });

    it("should return [] if findAll returns empty array", async () => {
      PurchaseOrderStub.findAll.resolves([]);

      const result = await getPurchaseOrderListByQuery({ clientId: "xyz" });
      expect(result).to.deep.equal([]);
    });

    it("should return list of undefineds if getData() returns undefined", async () => {
      PurchaseOrderStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);

      const result = await getPurchaseOrderListByQuery({ active: true });
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getPurchaseOrderListByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getPurchaseOrderListByQuery("not-an-object");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw HttpServerError if findAll fails", async () => {
      PurchaseOrderStub.findAll.rejects(new Error("findAll failed"));

      try {
        await getPurchaseOrderListByQuery({ some: "query" });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingPurchaseOrderListByQuery",
        );
        expect(err.details.message).to.equal("findAll failed");
      }
    });
  });
});
