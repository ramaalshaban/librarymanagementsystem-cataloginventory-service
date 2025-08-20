const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getPurchaseOrderCountByQuery module", () => {
  let sandbox;
  let getPurchaseOrderCountByQuery;
  let PurchaseOrderStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    PurchaseOrderStub = {
      count: sandbox.stub(),
      sum: sandbox.stub(),
      avg: sandbox.stub(),
      min: sandbox.stub(),
      max: sandbox.stub(),
    };

    getPurchaseOrderCountByQuery = proxyquire(
      "../../../../../src/db-layer/main/PurchaseOrder/utils/getPurchaseOrderStatsByQuery",
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
          hexaLogger: { insertError: sandbox.stub() },
        },
        sequelize: { Op: require("sequelize").Op },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("getPurchaseOrderCountByQuery", () => {
    const query = { isActive: true };

    it("should return count if stats is ['count']", async () => {
      PurchaseOrderStub.count.resolves(10);
      const result = await getPurchaseOrderCountByQuery(query, ["count"]);
      expect(result).to.equal(10);
    });

    it("should return single sum result if stats is ['sum(price)']", async () => {
      PurchaseOrderStub.sum.resolves(100);
      const result = await getPurchaseOrderCountByQuery(query, ["sum(price)"]);
      expect(result).to.equal(100);
    });

    it("should return single avg result if stats is ['avg(score)']", async () => {
      PurchaseOrderStub.avg.resolves(42);
      const result = await getPurchaseOrderCountByQuery(query, ["avg(score)"]);
      expect(result).to.equal(42);
    });

    it("should return single min result if stats is ['min(height)']", async () => {
      PurchaseOrderStub.min.resolves(1);
      const result = await getPurchaseOrderCountByQuery(query, ["min(height)"]);
      expect(result).to.equal(1);
    });

    it("should return single max result if stats is ['max(weight)']", async () => {
      PurchaseOrderStub.max.resolves(99);
      const result = await getPurchaseOrderCountByQuery(query, ["max(weight)"]);
      expect(result).to.equal(99);
    });

    it("should return object for multiple stats", async () => {
      PurchaseOrderStub.count.resolves(5);
      PurchaseOrderStub.sum.resolves(150);
      PurchaseOrderStub.avg.resolves(75);

      const result = await getPurchaseOrderCountByQuery(query, [
        "count",
        "sum(price)",
        "avg(score)",
      ]);

      expect(result).to.deep.equal({
        count: 5,
        "sum-price": 150,
        "avg-score": 75,
      });
    });

    it("should fallback to count if stats is empty", async () => {
      PurchaseOrderStub.count.resolves(7);
      const result = await getPurchaseOrderCountByQuery(query, []);
      expect(result).to.equal(7);
    });

    it("should fallback to count if stats has no valid entry", async () => {
      PurchaseOrderStub.count.resolves(99);
      const result = await getPurchaseOrderCountByQuery(query, ["unknown()"]);
      expect(result).to.equal(99);
    });

    it("should wrap error in HttpServerError if count fails", async () => {
      PurchaseOrderStub.count.rejects(new Error("count failed"));
      try {
        await getPurchaseOrderCountByQuery(query, ["count"]);
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingPurchaseOrderStatsByQuery",
        );
        expect(err.details.message).to.equal("count failed");
      }
    });

    it("should wrap error in HttpServerError if sum fails", async () => {
      PurchaseOrderStub.sum.rejects(new Error("sum failed"));
      try {
        await getPurchaseOrderCountByQuery(query, ["sum(price)"]);
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("sum failed");
      }
    });
  });
});
