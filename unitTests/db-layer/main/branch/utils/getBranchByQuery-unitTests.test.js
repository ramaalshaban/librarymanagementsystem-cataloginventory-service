const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getBranchByQuery module", () => {
  let sandbox;
  let getBranchByQuery;
  let BranchStub;

  const fakeId = "uuid-123";
  const fakeRecord = {
    id: fakeId,
    name: "Test Branch",
    getData: () => ({ id: fakeId, name: "Test Branch" }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    BranchStub = {
      findOne: sandbox.stub().resolves(fakeRecord),
    };

    getBranchByQuery = proxyquire(
      "../../../../../src/db-layer/main/Branch/utils/getBranchByQuery",
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
        },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("getBranchByQuery", () => {
    it("should return the result of getData if found", async () => {
      const result = await getBranchByQuery({ id: fakeId });

      expect(result).to.deep.equal({ id: fakeId, name: "Test Branch" });
      sinon.assert.calledOnce(BranchStub.findOne);
      sinon.assert.calledWith(BranchStub.findOne, {
        where: {
          id: fakeId,
          isActive: true,
        },
      });
    });

    it("should return null if no record is found", async () => {
      BranchStub.findOne.resolves(null);

      const result = await getBranchByQuery({ id: fakeId });

      expect(result).to.be.null;
      sinon.assert.calledOnce(BranchStub.findOne);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getBranchByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getBranchByQuery("invalid-query");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should wrap findOne errors in HttpServerError", async () => {
      BranchStub.findOne.rejects(new Error("findOne failed"));

      try {
        await getBranchByQuery({ test: true });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingBranchByQuery",
        );
        expect(err.details.message).to.equal("findOne failed");
      }
    });

    it("should return undefined if getData returns undefined", async () => {
      BranchStub.findOne.resolves({ getData: () => undefined });

      const result = await getBranchByQuery({ id: fakeId });

      expect(result).to.be.undefined;
    });
  });
});
