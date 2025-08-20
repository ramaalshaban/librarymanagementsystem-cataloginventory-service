const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getIdListOfPurchaseOrderByField module", () => {
  let sandbox;
  let getIdListOfPurchaseOrderByField;
  let PurchaseOrderStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    PurchaseOrderStub = {
      findAll: sandbox.stub().resolves([{ id: "1" }, { id: "2" }]),
      branchId: "example-type",
    };

    getIdListOfPurchaseOrderByField = proxyquire(
      "../../../../../src/db-layer/main/PurchaseOrder/utils/getIdListOfPurchaseOrderByField",
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
          NotFoundError: class NotFoundError extends Error {
            constructor(msg) {
              super(msg);
              this.name = "NotFoundError";
            }
          },
        },
        sequelize: { Op },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("getIdListOfPurchaseOrderByField", () => {
    it("should return list of IDs when valid field and value is given", async () => {
      PurchaseOrderStub["branchId"] = "string";
      const result = await getIdListOfPurchaseOrderByField(
        "branchId",
        "test-value",
        false,
      );
      expect(result).to.deep.equal(["1", "2"]);
      sinon.assert.calledOnce(PurchaseOrderStub.findAll);
    });

    it("should return list of IDs using Op.contains if isArray is true", async () => {
      PurchaseOrderStub["branchId"] = "string";
      const result = await getIdListOfPurchaseOrderByField(
        "branchId",
        "val",
        true,
      );
      const call = PurchaseOrderStub.findAll.getCall(0);
      expect(call.args[0].where["branchId"][Op.contains]).to.include("val");
    });

    it("should throw BadRequestError if field name is invalid", async () => {
      try {
        await getIdListOfPurchaseOrderByField("nonexistentField", "x", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field name");
      }
    });

    it("should throw BadRequestError if field value has wrong type", async () => {
      PurchaseOrderStub["branchId"] = 123; // expects number

      try {
        await getIdListOfPurchaseOrderByField("branchId", "wrong-type", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field value type");
      }
    });

    it("should throw NotFoundError if no records are found", async () => {
      PurchaseOrderStub.findAll.resolves([]);
      PurchaseOrderStub["branchId"] = "string";

      try {
        await getIdListOfPurchaseOrderByField("branchId", "nomatch", false);
        throw new Error("Expected NotFoundError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("NotFoundError");
        expect(err.details.message).to.include(
          "PurchaseOrder with the specified criteria not found",
        );
      }
    });

    it("should wrap findAll error in HttpServerError", async () => {
      PurchaseOrderStub.findAll.rejects(new Error("query failed"));
      PurchaseOrderStub["branchId"] = "string";

      try {
        await getIdListOfPurchaseOrderByField("branchId", "test", false);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("query failed");
      }
    });
  });
});
