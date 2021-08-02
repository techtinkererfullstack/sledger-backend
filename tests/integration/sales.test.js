const request = require("supertest");
const { Sale } = require("../../model/sales");
const mongoose = require("mongoose");
const {Customer} = require('../../model/customers');
let server;

describe("api/sales", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    server.close();
    await Sale.deleteMany({});
    await Customer.deleteMany({})
  });

  describe("GET /", () => {
    it("should return all sales", async () => {
      await Sale.collection.insertMany([
        { name: "sales1" },
        { name: "sales2" },
      ]);

      const res = await request(server).get("/api/sales");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((s) => s.name === "sales1")).toBeTruthy();
      expect(res.body.some((s) => s.name === "sales2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return a sale if valid id is passed", async () => {
          const mkCustomer = new Customer({
            name: "aaaaa",
            phoneNumber: 12345678999,
            address:"a",
            location: "a"
          });

          await mkCustomer.save();

        const sale = new Sale({
        product: ["mango", "banana", "orange"],
        customer: mkCustomer._id,
        quantity: 200,
        amount: 1000,
        transactionType: "cash",
      });
      await sale.save();
      const res = await request(server).get("/api/sales/" + sale._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("transactionType", sale.transactionType);
    });
  });

  describe("GET /:id", () => {
    it("should return 404 if invalid id is passed", async () => {
      const res = await request(server).get("/api/sales/1");

      expect(res.status).toBe(404);
    });
  });
});
