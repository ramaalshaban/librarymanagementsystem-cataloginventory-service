const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getIdListOfInventoryAuditLogByField module", () => {
  let sandbox;
  let getIdListOfInventoryAuditLogByField;
  let InventoryAuditLogStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    InventoryAuditLogStub = {
      findAll: sandbox.stub().resolves([{ id: "1" }, { id: "2" }]),
      branchId: "example-type",
    };

    getIdListOfInventoryAuditLogByField = proxyquire(
      "../../../../../src/db-layer/main/InventoryAuditLog/utils/getIdListOfInventoryAuditLogByField",
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

  describe("getIdListOfInventoryAuditLogByField", () => {
    it("should return list of IDs when valid field and value is given", async () => {
      InventoryAuditLogStub["branchId"] = "string";
      const result = await getIdListOfInventoryAuditLogByField(
        "branchId",
        "test-value",
        false,
      );
      expect(result).to.deep.equal(["1", "2"]);
      sinon.assert.calledOnce(InventoryAuditLogStub.findAll);
    });

    it("should return list of IDs using Op.contains if isArray is true", async () => {
      InventoryAuditLogStub["branchId"] = "string";
      const result = await getIdListOfInventoryAuditLogByField(
        "branchId",
        "val",
        true,
      );
      const call = InventoryAuditLogStub.findAll.getCall(0);
      expect(call.args[0].where["branchId"][Op.contains]).to.include("val");
    });

    it("should throw BadRequestError if field name is invalid", async () => {
      try {
        await getIdListOfInventoryAuditLogByField(
          "nonexistentField",
          "x",
          false,
        );
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field name");
      }
    });

    it("should throw BadRequestError if field value has wrong type", async () => {
      InventoryAuditLogStub["branchId"] = 123; // expects number

      try {
        await getIdListOfInventoryAuditLogByField(
          "branchId",
          "wrong-type",
          false,
        );
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field value type");
      }
    });

    it("should throw NotFoundError if no records are found", async () => {
      InventoryAuditLogStub.findAll.resolves([]);
      InventoryAuditLogStub["branchId"] = "string";

      try {
        await getIdListOfInventoryAuditLogByField("branchId", "nomatch", false);
        throw new Error("Expected NotFoundError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("NotFoundError");
        expect(err.details.message).to.include(
          "InventoryAuditLog with the specified criteria not found",
        );
      }
    });

    it("should wrap findAll error in HttpServerError", async () => {
      InventoryAuditLogStub.findAll.rejects(new Error("query failed"));
      InventoryAuditLogStub["branchId"] = "string";

      try {
        await getIdListOfInventoryAuditLogByField("branchId", "test", false);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("query failed");
      }
    });
  });
});
