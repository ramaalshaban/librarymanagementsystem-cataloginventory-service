const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getInventoryAuditLogById module", () => {
  let sandbox;
  let getInventoryAuditLogById;
  let InventoryAuditLogStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test InventoryAuditLog" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    InventoryAuditLogStub = {
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

    getInventoryAuditLogById = proxyquire(
      "../../../../../src/db-layer/main/InventoryAuditLog/utils/getInventoryAuditLogById",
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
        },
        sequelize: { Op },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("getInventoryAuditLogById", () => {
    it("should return getData() for single ID", async () => {
      const result = await getInventoryAuditLogById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(InventoryAuditLogStub.findOne);
      sinon.assert.calledWith(
        InventoryAuditLogStub.findOne,
        sinon.match.has("where", sinon.match.has("id", fakeId)),
      );
    });

    it("should return mapped getData() results for array of IDs", async () => {
      const result = await getInventoryAuditLogById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(InventoryAuditLogStub.findAll);
      sinon.assert.calledWithMatch(InventoryAuditLogStub.findAll, {
        where: { id: { [Op.in]: ["1", "2"] } },
      });
    });

    it("should return null if record not found (single ID)", async () => {
      InventoryAuditLogStub.findOne.resolves(null);
      const result = await getInventoryAuditLogById(fakeId);
      expect(result).to.be.null;
    });

    it("should return null if empty array returned from findAll", async () => {
      InventoryAuditLogStub.findAll.resolves([]);
      const result = await getInventoryAuditLogById(["a", "b"]);
      expect(result).to.deep.equal([]);
    });

    it("should wrap unexpected errors with HttpServerError (single ID)", async () => {
      InventoryAuditLogStub.findOne.rejects(new Error("DB failure"));
      try {
        await getInventoryAuditLogById("test");
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingInventoryAuditLogById",
        );
        expect(err.details.message).to.equal("DB failure");
      }
    });

    it("should wrap unexpected errors with HttpServerError (array of IDs)", async () => {
      InventoryAuditLogStub.findAll.rejects(new Error("array failure"));
      try {
        await getInventoryAuditLogById(["fail"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingInventoryAuditLogById",
        );
        expect(err.details.message).to.equal("array failure");
      }
    });

    it("should return undefined if getData() returns undefined", async () => {
      InventoryAuditLogStub.findOne.resolves({ getData: () => undefined });
      const result = await getInventoryAuditLogById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should return array of undefineds if getData() returns undefined per item", async () => {
      InventoryAuditLogStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getInventoryAuditLogById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });
  });
});
