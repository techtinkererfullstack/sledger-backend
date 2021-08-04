const request = require("supertest");
const { Sale } = require("../../model/sales");
const mongoose = require("mongoose");
const { User } = require("../../model/users");
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
      await Sale.collection.insertMany([
        {
          product: ["mango", "banana", "orange"],
          customer: "Matamorphosis",
          quantity: 200,
          amount: 1000000,
          transactionType: "cash",
        },
        {
          product: ["mango", "banana", "orange"],
          customer: "next.js",
          quantity: 200,
          amount: 100000000,
          transactionType: "cash",
        },
      ]);

      const res = await request(server).get("/api/sales");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((s) => s.customer === "Matamorphosis")).toBeTruthy();
      expect(res.body.some((s) => s.customer === "next.js")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return a sale if valid id is passed", async () => {
      const sale = new Sale({
        product: ["mango", "banana", "orange"],
        customer: "shafe",
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
                      product: ["mango", "banana", "orange"],
                      customer: "shafe",
                      quantity: 200,
                      amount: 1000,
                      transactionType: "",
                    });

      expect(res.status).toBe(400);
    });
  });

  describe("POST /", () => {
    it("should save the sale if it is valid", async () => {
      const token = new User().generateAuthToken();

      const res = await request(server)
        .post("/api/sales")
        .set("x-auth-token", token)
        .send({
          product: ["mango", "banana", "orange"],
          customer: "shafe",
          quantity: 200,
          amount: 1000,
          transactionType: "cash",
        });

      const sale = await Sale.find({
        product: ["mango", "banana", "orange"],
        customer: "shafe",
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

      const res = await request(server)
        .post("/api/sales")
        .set("x-auth-token", token)
        .send({
          product: ["mango", "banana", "orange"],
          customer: "shafe",
          quantity: 200,
          amount: 1000,
          transactionType: "cash",
        });

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("customer", "shafe");
    });
  });

  // afterAll(async () => {
  // await mongoose.connection.close();
  // });
});
