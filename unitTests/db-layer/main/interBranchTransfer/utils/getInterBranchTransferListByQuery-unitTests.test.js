const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getInterBranchTransferListByQuery module", () => {
  let sandbox;
  let getInterBranchTransferListByQuery;
  let InterBranchTransferStub;

  const fakeList = [
    { getData: () => ({ id: "1", name: "Item 1" }) },
    { getData: () => ({ id: "2", name: "Item 2" }) },
  ];

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    InterBranchTransferStub = {
      findAll: sandbox.stub().resolves(fakeList),
    };

    getInterBranchTransferListByQuery = proxyquire(
      "../../../../../src/db-layer/main/InterBranchTransfer/utils/getInterBranchTransferListByQuery",
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

  describe("getInterBranchTransferListByQuery", () => {
    it("should return list of getData() results if query is valid", async () => {
      const result = await getInterBranchTransferListByQuery({
        isActive: true,
      });

      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);

      sinon.assert.calledOnce(InterBranchTransferStub.findAll);
      sinon.assert.calledWithMatch(InterBranchTransferStub.findAll, {
        where: { isActive: true },
      });
    });

    it("should return [] if findAll returns null", async () => {
      InterBranchTransferStub.findAll.resolves(null);

      const result = await getInterBranchTransferListByQuery({ active: false });
      expect(result).to.deep.equal([]);
    });

    it("should return [] if findAll returns empty array", async () => {
      InterBranchTransferStub.findAll.resolves([]);

      const result = await getInterBranchTransferListByQuery({
        clientId: "xyz",
      });
      expect(result).to.deep.equal([]);
    });

    it("should return list of undefineds if getData() returns undefined", async () => {
      InterBranchTransferStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);

      const result = await getInterBranchTransferListByQuery({ active: true });
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getInterBranchTransferListByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getInterBranchTransferListByQuery("not-an-object");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw HttpServerError if findAll fails", async () => {
      InterBranchTransferStub.findAll.rejects(new Error("findAll failed"));

      try {
        await getInterBranchTransferListByQuery({ some: "query" });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingInterBranchTransferListByQuery",
        );
        expect(err.details.message).to.equal("findAll failed");
      }
    });
  });
});
