const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getIdListOfBranchInventoryByField module", () => {
  let sandbox;
  let getIdListOfBranchInventoryByField;
  let BranchInventoryStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    BranchInventoryStub = {
      findAll: sandbox.stub().resolves([{ id: "1" }, { id: "2" }]),
      bookId: "example-type",
    };

    getIdListOfBranchInventoryByField = proxyquire(
      "../../../../../src/db-layer/main/BranchInventory/utils/getIdListOfBranchInventoryByField",
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

  describe("getIdListOfBranchInventoryByField", () => {
    it("should return list of IDs when valid field and value is given", async () => {
      BranchInventoryStub["bookId"] = "string";
      const result = await getIdListOfBranchInventoryByField(
        "bookId",
        "test-value",
        false,
      );
      expect(result).to.deep.equal(["1", "2"]);
      sinon.assert.calledOnce(BranchInventoryStub.findAll);
    });

    it("should return list of IDs using Op.contains if isArray is true", async () => {
      BranchInventoryStub["bookId"] = "string";
      const result = await getIdListOfBranchInventoryByField(
        "bookId",
        "val",
        true,
      );
      const call = BranchInventoryStub.findAll.getCall(0);
      expect(call.args[0].where["bookId"][Op.contains]).to.include("val");
    });

    it("should throw BadRequestError if field name is invalid", async () => {
      try {
        await getIdListOfBranchInventoryByField("nonexistentField", "x", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field name");
      }
    });

    it("should throw BadRequestError if field value has wrong type", async () => {
      BranchInventoryStub["bookId"] = 123; // expects number

      try {
        await getIdListOfBranchInventoryByField("bookId", "wrong-type", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field value type");
      }
    });

    it("should throw NotFoundError if no records are found", async () => {
      BranchInventoryStub.findAll.resolves([]);
      BranchInventoryStub["bookId"] = "string";

      try {
        await getIdListOfBranchInventoryByField("bookId", "nomatch", false);
        throw new Error("Expected NotFoundError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("NotFoundError");
        expect(err.details.message).to.include(
          "BranchInventory with the specified criteria not found",
        );
      }
    });

    it("should wrap findAll error in HttpServerError", async () => {
      BranchInventoryStub.findAll.rejects(new Error("query failed"));
      BranchInventoryStub["bookId"] = "string";

      try {
        await getIdListOfBranchInventoryByField("bookId", "test", false);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("query failed");
      }
    });
  });
});
