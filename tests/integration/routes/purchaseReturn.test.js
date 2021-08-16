const request = require("supertest");
const mongoose = require("mongoose");
const { Purchase } = require("../../../model/purchases");
const { User } = require("../../../model/users");
const moment = require("moment");
let server;
let supplierId;
let purchase;
let token;

describe("api/purchaseReturn", () => {
  beforeEach(async () => {
    server = require("../../../index");

    supplierId = new mongoose.Types.ObjectId();
    token = new User().generateAuthToken();

    purchase = new Purchase({
      supplier: {
        _id: supplierId,
        name: "12345",
        phone: "1234567891010",
        reference: "12345",
      },
      quantity: 50,
      amount: 50000,
      product: ["a", "b", "c"],
      transactionType: "cash",
    });
    await purchase.save();
  });

  const exec = () => {
    return request(server)
      .post("/api/purchaseReturn")
      .set("x-auth-token", token)
      .send({
        supplierId: supplierId,
        quantity: 50,
        amount: 50000,
        product: ["a", "b", "c"],
        transactionType: "cash",
      });
  };

  afterEach(async () => {
    await server.close();
    await Purchase.deleteMany({});
  });

  it("should return 401 if client is not logged in", async () => {
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });

  it("should return 400 if supplierId is not provided", async () => {
    supplierId = "";

    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 404 if no purchase found from this customer", async () => {
    await Purchase.remove({});

    const res = await exec();

    expect(res.status).toBe(404);
  });

  it("should return 400 if if purchase is already returned", async () => {
    purchase.dateReturned = new Date();
    await purchase.save();

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 200 if valid request", async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });

  it("should return the return date if input is valid", async () => {
    const res = await exec();

    const purchaseInDb = await Purchase.findById(purchase._id);
    const diff = new Date() - purchaseInDb.dateReturned;

    //expect(purchaseInDb.dateReturned).toBeDefined();
    expect(diff).toBeLessThan(10 * 1000);
  });

  it("should return ", async () => {
    const res = await exec();

    const purchaseInDb = await Purchase.findById(purchase._id);
    const diff = new Date() - purchaseInDb.dateReturned;

    //expect(purchaseInDb.dateReturned).toBeDefined();
    expect(diff).toBeLessThan(10 * 1000);
  });
});
