const request = require("supertest");
const { Sale } = require("../../model/sales");
const mongoose = require("mongoose");
const { Customer } = require("../../model/customers");
const { User } = require("../../model/users");
let server;

describe("api/sales", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    server.close();
    await Sale.deleteMany({});
    await Customer.deleteMany({});
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

  describe("GET /:id", () => {
    it("should return a sale if valid id is passed", async () => {
      const mkCustomer = new Customer({
        name: "aaaaa",
        phoneNumber: 12345678999,
        address: "a",
        location: "a",
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

  describe("POST /", () => {
    it("should return 401 if client is not logged in", async () => {
      const res = await request(server).post("/api/sales").send();

      expect(res.status).toBe(401);
    });
  });

  describe("POST /", () => {
    it("should return 400 if transaction type is not defined/ if client is logged in", async () => {
      const token = new User().generateAuthToken();

      const res = await request(server).post("/api/sales").set("x-auth-token", token).send({
        transactionType: "",
      });

      expect(res.status).toBe(400);
    });
  });

  describe("POST /", () => {
    it("should save the sale if it is valid", async () => {
      const token = new User().generateAuthToken();

      const mkCustomer = new Customer({
        name: "aaaaa",
        phoneNumber: 12345678999,
        address: "a",
        location: "a",
      });

      await mkCustomer.save();

      const res = await request(server)
        .post("/api/sales")
        .set("x-auth-token", token)
        .send({
          product: ["mango", "banana", "orange"],
          customer: mkCustomer._id,
          quantity: 200,
          amount: 1000,
          transactionType: "cash",
        });

      const sale = await Sale.find({
        product: ["mango", "banana", "orange"],
        customer: mkCustomer._id,
        quantity: 200,
        amount: 1000,
        transactionType: "cash",
      });
      expect(sale).not.toBeNull();
    });
  });

  describe("POST /", () => {
    it("should return the sale if it is valid", async () => {
      const token = new User().generateAuthToken();
      
          const mkCustomer = new Customer({
        name: "aaaaa",
        phoneNumber: 12345678999,
        address: "a",
        location: "a",
      });

      await mkCustomer.save();

      const res = await request(server)
        .post("/api/sales")
        .set("x-auth-token", token)
        .send({
          product: ["mango", "banana", "orange"],
          customer: mkCustomer._id,
          quantity: 200,
          amount: 1000,
          transactionType: "cash",
        });

     
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("customer", mkCustomer._id);
    });
  });
});
