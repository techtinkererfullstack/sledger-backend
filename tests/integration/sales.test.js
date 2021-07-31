const request = require("supertest");
const { Sale } = require("../../model/sales");
let server;

describe("api/sales", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    server.close();
    await Sale.deleteMany({});
  });

  describe("GET /", () => {
    it("should return all sales", async () => {
      await Sale.collection.insertMany([{ name: "sales1" }, { name: "sales2" }]);

      const res = await request(server).get("/api/sales");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((s) => s.name === "sales1")).toBeTruthy();
      expect(res.body.some((s) => s.name === "sales2")).toBeTruthy();
    });
  });
});
