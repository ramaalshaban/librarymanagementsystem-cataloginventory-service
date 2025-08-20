const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("createInterBranchTransfer module", () => {
  let sandbox;
  let createInterBranchTransfer;
  let InterBranchTransferStub, ElasticIndexerStub, newUUIDStub;

  const fakeId = "uuid-123";
  const baseValidInput = {
    bookId: "bookId_val",
    sourceBranchId: "sourceBranchId_val",
    destBranchId: "destBranchId_val",
    quantity: "quantity_val",
    requestedByUserId: "requestedByUserId_val",
    status: "status_val",
  };
  const mockCreatedInterBranchTransfer = {
    getData: () => ({ id: fakeId, ...baseValidInput }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    InterBranchTransferStub = {
      create: sandbox.stub().resolves(mockCreatedInterBranchTransfer),
    };

    ElasticIndexerStub = sandbox.stub().returns({
      indexData: sandbox.stub().resolves(),
    });

    newUUIDStub = sandbox.stub().returns(fakeId);

    createInterBranchTransfer = proxyquire(
      "../../../../../src/db-layer/main/InterBranchTransfer/utils/createInterBranchTransfer",
      {
        models: { InterBranchTransfer: InterBranchTransferStub },
        serviceCommon: { ElasticIndexer: ElasticIndexerStub },
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
          newUUID: newUUIDStub,
        },
      },
    );
  });

  afterEach(() => sandbox.restore());

  const getValidInput = (overrides = {}) => ({
    ...baseValidInput,
    ...overrides,
  });

  describe("createInterBranchTransfer", () => {
    it("should create InterBranchTransfer and index to elastic if valid data", async () => {
      const input = getValidInput();
      const result = await createInterBranchTransfer(input);

      expect(result).to.deep.equal({ id: fakeId, ...baseValidInput });
      sinon.assert.calledOnce(InterBranchTransferStub.create);
      sinon.assert.calledOnce(ElasticIndexerStub);
    });

    it("should throw HttpServerError if InterBranchTransfer.create fails", async () => {
      InterBranchTransferStub.create.rejects(new Error("DB error"));
      const input = getValidInput();

      try {
        await createInterBranchTransfer(input);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenCreatingInterBranchTransfer",
        );
        expect(err.details.message).to.equal("DB error");
      }
    });
  });

  describe("validateData", () => {
    it("should generate new UUID if id is not provided", async () => {
      const input = getValidInput();
      delete input.id;
      await createInterBranchTransfer(input);
      sinon.assert.calledOnce(newUUIDStub);
    });

    it("should use provided id if present", async () => {
      const input = getValidInput({ id: "existing-id" });
      await createInterBranchTransfer(input);
      sinon.assert.notCalled(newUUIDStub);
      sinon.assert.calledWith(
        InterBranchTransferStub.create,
        sinon.match({ id: "existing-id" }),
      );
    });

    it("should not throw if requiredFields is satisfied", async () => {
      const input = getValidInput();
      await createInterBranchTransfer(input);
    });

    it("should not overwrite id if already present", async () => {
      const input = getValidInput({ id: "custom-id" });
      await createInterBranchTransfer(input);
      sinon.assert.notCalled(newUUIDStub);
      sinon.assert.calledWith(
        InterBranchTransferStub.create,
        sinon.match({ id: "custom-id" }),
      );
    });

    it("should throw BadRequestError if required field is missing", async () => {
      const input = getValidInput();
      delete input["bookId"];
      try {
        await createInterBranchTransfer(input);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include('Field "bookId" is required');
      }
    });
  });

  describe("indexDataToElastic", () => {
    it("should call ElasticIndexer with interBranchTransfer data", async () => {
      const input = getValidInput();
      await createInterBranchTransfer(input);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledOnce(ElasticIndexerStub().indexData);
    });

    it("should throw HttpServerError if ElasticIndexer.indexData fails", async () => {
      ElasticIndexerStub().indexData.rejects(new Error("Elastic error"));
      const input = getValidInput();

      try {
        await createInterBranchTransfer(input);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenCreatingInterBranchTransfer",
        );
        expect(err.details.message).to.equal("Elastic error");
      }
    });
  });
});
