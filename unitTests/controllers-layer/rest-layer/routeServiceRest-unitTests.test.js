const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//For these tests to work we need to export GetBookRestController also from file getbook.js
describe("GetBookRestController", () => {
  let GetBookRestController, getBook;
  let GetBookManagerStub, processRequestStub;
  let req, res, next;

  beforeEach(() => {
    req = { requestId: "req-456" };
    res = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
    };
    next = sinon.stub();

    // Stub for GetBookManager constructor
    GetBookManagerStub = sinon.stub();

    // Stub for processRequest inherited from RestController
    processRequestStub = sinon.stub();

    // Proxyquire module under test with mocks
    ({ GetBookRestController, getBook } = proxyquire(
      "../../../src/controllers-layer/rest-layer/main/book/get-book.js",
      {
        serviceCommon: {
          HexaLogTypes: {},
          hexaLogger: { insertInfo: sinon.stub(), insertError: sinon.stub() },
        },
        managers: {
          GetBookManager: GetBookManagerStub,
        },
        "../../CatalogInventoryServiceRestController": class {
          constructor(name, routeName, _req, _res, _next) {
            this.name = name;
            this.routeName = routeName;
            this._req = _req;
            this._res = _res;
            this._next = _next;
            this.processRequest = processRequestStub;
          }
        },
      },
    ));
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("GetBookRestController class", () => {
    it("should extend RestController with correct values", () => {
      const controller = new GetBookRestController(req, res, next);

      expect(controller.name).to.equal("getBook");
      expect(controller.routeName).to.equal("getbook");
      expect(controller.dataName).to.equal("book");
      expect(controller.crudType).to.equal("get");
      expect(controller.status).to.equal(200);
      expect(controller.httpMethod).to.equal("GET");
    });

    it("should create GetBookManager in createApiManager()", () => {
      const controller = new GetBookRestController(req, res, next);
      controller._req = req;

      controller.createApiManager();

      expect(GetBookManagerStub.calledOnceWithExactly(req, "rest")).to.be.true;
    });
  });

  describe("getBook function", () => {
    it("should create instance and call processRequest", async () => {
      await getBook(req, res, next);

      expect(processRequestStub.calledOnce).to.be.true;
    });
  });
});
