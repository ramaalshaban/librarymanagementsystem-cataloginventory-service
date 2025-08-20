const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("createPurchaseOrder module", () => {
  let sandbox;
  let createPurchaseOrder;
  let PurchaseOrderStub, ElasticIndexerStub, newUUIDStub;

  const fakeId = "uuid-123";
  const baseValidInput = {
    branchId: "branchId_val",
    requestedByUserId: "requestedByUserId_val",
    itemRequests: "itemRequests_val",
    status: "status_val",
  };
  const mockCreatedPurchaseOrder = {
    getData: () => ({ id: fakeId, ...baseValidInput }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    PurchaseOrderStub = {
      create: sandbox.stub().resolves(mockCreatedPurchaseOrder),
    };

    ElasticIndexerStub = sandbox.stub().returns({
      indexData: sandbox.stub().resolves(),
    });

    newUUIDStub = sandbox.stub().returns(fakeId);

    createPurchaseOrder = proxyquire(
      "../../../../../src/db-layer/main/PurchaseOrder/utils/createPurchaseOrder",
      {
        models: { PurchaseOrder: PurchaseOrderStub },
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

  describe("createPurchaseOrder", () => {
    it("should create PurchaseOrder and index to elastic if valid data", async () => {
      const input = getValidInput();
      const result = await createPurchaseOrder(input);

      expect(result).to.deep.equal({ id: fakeId, ...baseValidInput });
      sinon.assert.calledOnce(PurchaseOrderStub.create);
      sinon.assert.calledOnce(ElasticIndexerStub);
    });

    it("should throw HttpServerError if PurchaseOrder.create fails", async () => {
      PurchaseOrderStub.create.rejects(new Error("DB error"));
      const input = getValidInput();

      try {
        await createPurchaseOrder(input);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal("errMsg_dbErrorWhenCreatingPurchaseOrder");
        expect(err.details.message).to.equal("DB error");
      }
    });
  });

  describe("validateData", () => {
    it("should generate new UUID if id is not provided", async () => {
      const input = getValidInput();
      delete input.id;
      await createPurchaseOrder(input);
      sinon.assert.calledOnce(newUUIDStub);
    });

    it("should use provided id if present", async () => {
      const input = getValidInput({ id: "existing-id" });
      await createPurchaseOrder(input);
      sinon.assert.notCalled(newUUIDStub);
      sinon.assert.calledWith(
        PurchaseOrderStub.create,
        sinon.match({ id: "existing-id" }),
      );
    });

    it("should not throw if requiredFields is satisfied", async () => {
      const input = getValidInput();
      await createPurchaseOrder(input);
    });

    it("should not overwrite id if already present", async () => {
      const input = getValidInput({ id: "custom-id" });
      await createPurchaseOrder(input);
      sinon.assert.notCalled(newUUIDStub);
      sinon.assert.calledWith(
        PurchaseOrderStub.create,
        sinon.match({ id: "custom-id" }),
      );
    });

    it("should throw BadRequestError if required field is missing", async () => {
      const input = getValidInput();
      delete input["branchId"];
      try {
        await createPurchaseOrder(input);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include('Field "branchId" is required');
      }
    });
  });

  describe("indexDataToElastic", () => {
    it("should call ElasticIndexer with purchaseOrder data", async () => {
      const input = getValidInput();
      await createPurchaseOrder(input);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledOnce(ElasticIndexerStub().indexData);
    });

    it("should throw HttpServerError if ElasticIndexer.indexData fails", async () => {
      ElasticIndexerStub().indexData.rejects(new Error("Elastic error"));
      const input = getValidInput();

      try {
        await createPurchaseOrder(input);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal("errMsg_dbErrorWhenCreatingPurchaseOrder");
        expect(err.details.message).to.equal("Elastic error");
      }
    });
  });
});
