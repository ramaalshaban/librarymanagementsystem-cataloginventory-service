const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("updateBranchInventoryByIdList module", () => {
  let sandbox;
  let updateBranchInventoryByIdList;
  let BranchInventoryStub;

  const fakeIdList = ["id1", "id2"];
  const fakeUpdatedRows = [
    { id: "id1", name: "Updated 1" },
    { id: "id2", name: "Updated 2" },
  ];

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    BranchInventoryStub = {
      update: sandbox.stub().resolves([2, fakeUpdatedRows]),
    };

    updateBranchInventoryByIdList = proxyquire(
      "../../../../../src/db-layer/main/BranchInventory/utils/updateBranchInventoryByIdList",
      {
        models: { BranchInventory: BranchInventoryStub },
        common: {
          HttpServerError: class HttpServerError extends Error {
            constructor(message, details) {
              super(message);
              this.name = "HttpServerError";
              this.details = details;
            }
          },
          hexaLogger: { insertError: sandbox.stub() },
        },
        sequelize: { Op },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("updateBranchInventoryByIdList", () => {
    it("should return list of updated IDs if update is successful", async () => {
      const result = await updateBranchInventoryByIdList(fakeIdList, {
        name: "Updated",
      });

      expect(result).to.deep.equal(["id1", "id2"]);
      sinon.assert.calledOnce(BranchInventoryStub.update);
      const args = BranchInventoryStub.update.getCall(0).args;
      expect(args[0]).to.deep.equal({ name: "Updated" });
      expect(args[1]).to.deep.equal({
        where: { id: { [Op.in]: fakeIdList }, isActive: true },
        returning: true,
      });
    });

    it("should return empty list if update returns no rows", async () => {
      BranchInventoryStub.update.resolves([0, []]);

      const result = await updateBranchInventoryByIdList(["id99"], {
        status: "inactive",
      });

      expect(result).to.deep.equal([]);
    });

    it("should return list with one id if only one record updated", async () => {
      BranchInventoryStub.update.resolves([1, [{ id: "id1" }]]);

      const result = await updateBranchInventoryByIdList(["id1"], {
        active: false,
      });

      expect(result).to.deep.equal(["id1"]);
    });

    it("should throw HttpServerError if model update fails", async () => {
      BranchInventoryStub.update.rejects(new Error("update failed"));

      try {
        await updateBranchInventoryByIdList(["id1"], { name: "err" });
        throw new Error("Expected error");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenUpdatingBranchInventoryByIdList",
        );
        expect(err.details.message).to.equal("update failed");
      }
    });

    it("should call update with empty dataClause", async () => {
      await updateBranchInventoryByIdList(["id1"], {});
      sinon.assert.calledOnce(BranchInventoryStub.update);
    });
  });
});
