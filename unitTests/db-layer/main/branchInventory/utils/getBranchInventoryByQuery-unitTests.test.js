const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getBranchInventoryByQuery module", () => {
  let sandbox;
  let getBranchInventoryByQuery;
  let BranchInventoryStub;

  const fakeId = "uuid-123";
  const fakeRecord = {
    id: fakeId,
    name: "Test BranchInventory",
    getData: () => ({ id: fakeId, name: "Test BranchInventory" }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    BranchInventoryStub = {
      findOne: sandbox.stub().resolves(fakeRecord),
    };

    getBranchInventoryByQuery = proxyquire(
      "../../../../../src/db-layer/main/BranchInventory/utils/getBranchInventoryByQuery",
      {
        models: { BranchInventory: BranchInventoryStub },
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

  describe("getBranchInventoryByQuery", () => {
    it("should return the result of getData if found", async () => {
      const result = await getBranchInventoryByQuery({ id: fakeId });

      expect(result).to.deep.equal({
        id: fakeId,
        name: "Test BranchInventory",
      });
      sinon.assert.calledOnce(BranchInventoryStub.findOne);
      sinon.assert.calledWith(BranchInventoryStub.findOne, {
        where: {
          id: fakeId,
          isActive: true,
        },
      });
    });

    it("should return null if no record is found", async () => {
      BranchInventoryStub.findOne.resolves(null);

      const result = await getBranchInventoryByQuery({ id: fakeId });

      expect(result).to.be.null;
      sinon.assert.calledOnce(BranchInventoryStub.findOne);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getBranchInventoryByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getBranchInventoryByQuery("invalid-query");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should wrap findOne errors in HttpServerError", async () => {
      BranchInventoryStub.findOne.rejects(new Error("findOne failed"));

      try {
        await getBranchInventoryByQuery({ test: true });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingBranchInventoryByQuery",
        );
        expect(err.details.message).to.equal("findOne failed");
      }
    });

    it("should return undefined if getData returns undefined", async () => {
      BranchInventoryStub.findOne.resolves({ getData: () => undefined });

      const result = await getBranchInventoryByQuery({ id: fakeId });

      expect(result).to.be.undefined;
    });
  });
});
