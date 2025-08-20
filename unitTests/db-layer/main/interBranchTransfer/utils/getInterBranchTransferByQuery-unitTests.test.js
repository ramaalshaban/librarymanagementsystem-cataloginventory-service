const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getInterBranchTransferByQuery module", () => {
  let sandbox;
  let getInterBranchTransferByQuery;
  let InterBranchTransferStub;

  const fakeId = "uuid-123";
  const fakeRecord = {
    id: fakeId,
    name: "Test InterBranchTransfer",
    getData: () => ({ id: fakeId, name: "Test InterBranchTransfer" }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    InterBranchTransferStub = {
      findOne: sandbox.stub().resolves(fakeRecord),
    };

    getInterBranchTransferByQuery = proxyquire(
      "../../../../../src/db-layer/main/InterBranchTransfer/utils/getInterBranchTransferByQuery",
      {
        models: { InterBranchTransfer: InterBranchTransferStub },
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

  describe("getInterBranchTransferByQuery", () => {
    it("should return the result of getData if found", async () => {
      const result = await getInterBranchTransferByQuery({ id: fakeId });

      expect(result).to.deep.equal({
        id: fakeId,
        name: "Test InterBranchTransfer",
      });
      sinon.assert.calledOnce(InterBranchTransferStub.findOne);
      sinon.assert.calledWith(InterBranchTransferStub.findOne, {
        where: {
          id: fakeId,
          isActive: true,
        },
      });
    });

    it("should return null if no record is found", async () => {
      InterBranchTransferStub.findOne.resolves(null);

      const result = await getInterBranchTransferByQuery({ id: fakeId });

      expect(result).to.be.null;
      sinon.assert.calledOnce(InterBranchTransferStub.findOne);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getInterBranchTransferByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getInterBranchTransferByQuery("invalid-query");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should wrap findOne errors in HttpServerError", async () => {
      InterBranchTransferStub.findOne.rejects(new Error("findOne failed"));

      try {
        await getInterBranchTransferByQuery({ test: true });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingInterBranchTransferByQuery",
        );
        expect(err.details.message).to.equal("findOne failed");
      }
    });

    it("should return undefined if getData returns undefined", async () => {
      InterBranchTransferStub.findOne.resolves({ getData: () => undefined });

      const result = await getInterBranchTransferByQuery({ id: fakeId });

      expect(result).to.be.undefined;
    });
  });
});
