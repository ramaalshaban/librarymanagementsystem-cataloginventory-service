const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getBranchCountByQuery module", () => {
  let sandbox;
  let getBranchCountByQuery;
  let BranchStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    BranchStub = {
      count: sandbox.stub(),
      sum: sandbox.stub(),
      avg: sandbox.stub(),
      min: sandbox.stub(),
      max: sandbox.stub(),
    };

    getBranchCountByQuery = proxyquire(
      "../../../../../src/db-layer/main/Branch/utils/getBranchStatsByQuery",
      {
        models: { Branch: BranchStub },
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

  describe("getBranchCountByQuery", () => {
    const query = { isActive: true };

    it("should return count if stats is ['count']", async () => {
      BranchStub.count.resolves(10);
      const result = await getBranchCountByQuery(query, ["count"]);
      expect(result).to.equal(10);
    });

    it("should return single sum result if stats is ['sum(price)']", async () => {
      BranchStub.sum.resolves(100);
      const result = await getBranchCountByQuery(query, ["sum(price)"]);
      expect(result).to.equal(100);
    });

    it("should return single avg result if stats is ['avg(score)']", async () => {
      BranchStub.avg.resolves(42);
      const result = await getBranchCountByQuery(query, ["avg(score)"]);
      expect(result).to.equal(42);
    });

    it("should return single min result if stats is ['min(height)']", async () => {
      BranchStub.min.resolves(1);
      const result = await getBranchCountByQuery(query, ["min(height)"]);
      expect(result).to.equal(1);
    });

    it("should return single max result if stats is ['max(weight)']", async () => {
      BranchStub.max.resolves(99);
      const result = await getBranchCountByQuery(query, ["max(weight)"]);
      expect(result).to.equal(99);
    });

    it("should return object for multiple stats", async () => {
      BranchStub.count.resolves(5);
      BranchStub.sum.resolves(150);
      BranchStub.avg.resolves(75);

      const result = await getBranchCountByQuery(query, [
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
      BranchStub.count.resolves(7);
      const result = await getBranchCountByQuery(query, []);
      expect(result).to.equal(7);
    });

    it("should fallback to count if stats has no valid entry", async () => {
      BranchStub.count.resolves(99);
      const result = await getBranchCountByQuery(query, ["unknown()"]);
      expect(result).to.equal(99);
    });

    it("should wrap error in HttpServerError if count fails", async () => {
      BranchStub.count.rejects(new Error("count failed"));
      try {
        await getBranchCountByQuery(query, ["count"]);
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingBranchStatsByQuery",
        );
        expect(err.details.message).to.equal("count failed");
      }
    });

    it("should wrap error in HttpServerError if sum fails", async () => {
      BranchStub.sum.rejects(new Error("sum failed"));
      try {
        await getBranchCountByQuery(query, ["sum(price)"]);
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("sum failed");
      }
    });
  });
});
