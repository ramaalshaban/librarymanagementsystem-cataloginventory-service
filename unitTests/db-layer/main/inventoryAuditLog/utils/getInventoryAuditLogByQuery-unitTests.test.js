const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getInventoryAuditLogByQuery module", () => {
  let sandbox;
  let getInventoryAuditLogByQuery;
  let InventoryAuditLogStub;

  const fakeId = "uuid-123";
  const fakeRecord = {
    id: fakeId,
    name: "Test InventoryAuditLog",
    getData: () => ({ id: fakeId, name: "Test InventoryAuditLog" }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    InventoryAuditLogStub = {
      findOne: sandbox.stub().resolves(fakeRecord),
    };

    getInventoryAuditLogByQuery = proxyquire(
      "../../../../../src/db-layer/main/InventoryAuditLog/utils/getInventoryAuditLogByQuery",
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
        },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("getInventoryAuditLogByQuery", () => {
    it("should return the result of getData if found", async () => {
      const result = await getInventoryAuditLogByQuery({ id: fakeId });

      expect(result).to.deep.equal({
        id: fakeId,
        name: "Test InventoryAuditLog",
      });
      sinon.assert.calledOnce(InventoryAuditLogStub.findOne);
      sinon.assert.calledWith(InventoryAuditLogStub.findOne, {
        where: {
          id: fakeId,
          isActive: true,
        },
      });
    });

    it("should return null if no record is found", async () => {
      InventoryAuditLogStub.findOne.resolves(null);

      const result = await getInventoryAuditLogByQuery({ id: fakeId });

      expect(result).to.be.null;
      sinon.assert.calledOnce(InventoryAuditLogStub.findOne);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getInventoryAuditLogByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getInventoryAuditLogByQuery("invalid-query");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should wrap findOne errors in HttpServerError", async () => {
      InventoryAuditLogStub.findOne.rejects(new Error("findOne failed"));

      try {
        await getInventoryAuditLogByQuery({ test: true });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingInventoryAuditLogByQuery",
        );
        expect(err.details.message).to.equal("findOne failed");
      }
    });

    it("should return undefined if getData returns undefined", async () => {
      InventoryAuditLogStub.findOne.resolves({ getData: () => undefined });

      const result = await getInventoryAuditLogByQuery({ id: fakeId });

      expect(result).to.be.undefined;
    });
  });
});
