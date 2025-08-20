const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getInventoryAuditLogCountByQuery module", () => {
  let sandbox;
  let getInventoryAuditLogCountByQuery;
  let InventoryAuditLogStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    InventoryAuditLogStub = {
      count: sandbox.stub(),
      sum: sandbox.stub(),
      avg: sandbox.stub(),
      min: sandbox.stub(),
      max: sandbox.stub(),
    };

    getInventoryAuditLogCountByQuery = proxyquire(
      "../../../../../src/db-layer/main/InventoryAuditLog/utils/getInventoryAuditLogStatsByQuery",
      {
        models: { InventoryAuditLog: InventoryAuditLogStub },
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

  describe("getInventoryAuditLogCountByQuery", () => {
    const query = { isActive: true };

    it("should return count if stats is ['count']", async () => {
      InventoryAuditLogStub.count.resolves(10);
      const result = await getInventoryAuditLogCountByQuery(query, ["count"]);
      expect(result).to.equal(10);
    });

    it("should return single sum result if stats is ['sum(price)']", async () => {
      InventoryAuditLogStub.sum.resolves(100);
      const result = await getInventoryAuditLogCountByQuery(query, [
        "sum(price)",
      ]);
      expect(result).to.equal(100);
    });

    it("should return single avg result if stats is ['avg(score)']", async () => {
      InventoryAuditLogStub.avg.resolves(42);
      const result = await getInventoryAuditLogCountByQuery(query, [
        "avg(score)",
      ]);
      expect(result).to.equal(42);
    });

    it("should return single min result if stats is ['min(height)']", async () => {
      InventoryAuditLogStub.min.resolves(1);
      const result = await getInventoryAuditLogCountByQuery(query, [
        "min(height)",
      ]);
      expect(result).to.equal(1);
    });

    it("should return single max result if stats is ['max(weight)']", async () => {
      InventoryAuditLogStub.max.resolves(99);
      const result = await getInventoryAuditLogCountByQuery(query, [
        "max(weight)",
      ]);
      expect(result).to.equal(99);
    });

    it("should return object for multiple stats", async () => {
      InventoryAuditLogStub.count.resolves(5);
      InventoryAuditLogStub.sum.resolves(150);
      InventoryAuditLogStub.avg.resolves(75);

      const result = await getInventoryAuditLogCountByQuery(query, [
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
      InventoryAuditLogStub.count.resolves(7);
      const result = await getInventoryAuditLogCountByQuery(query, []);
      expect(result).to.equal(7);
    });

    it("should fallback to count if stats has no valid entry", async () => {
      InventoryAuditLogStub.count.resolves(99);
      const result = await getInventoryAuditLogCountByQuery(query, [
        "unknown()",
      ]);
      expect(result).to.equal(99);
    });

    it("should wrap error in HttpServerError if count fails", async () => {
      InventoryAuditLogStub.count.rejects(new Error("count failed"));
      try {
        await getInventoryAuditLogCountByQuery(query, ["count"]);
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingInventoryAuditLogStatsByQuery",
        );
        expect(err.details.message).to.equal("count failed");
      }
    });

    it("should wrap error in HttpServerError if sum fails", async () => {
      InventoryAuditLogStub.sum.rejects(new Error("sum failed"));
      try {
        await getInventoryAuditLogCountByQuery(query, ["sum(price)"]);
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("sum failed");
      }
    });
  });
});
