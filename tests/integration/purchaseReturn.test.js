const request = require("supertest");
const mongoose = require("mongoose");
const { Purchase } = require("../../model/purchases");

describe("api/purchaseReturn", () => {
  let supplierId;
  let purchase;
  let server;

  beforeEach(async () => {
    server = require("../../index");

    supplierId = new mongoose.Types.ObjectId();

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
  afterEach(async () => {
    await server.close();
    await Purchase.deleteMany({});
  });

  it("should work!", async () => {
    const res = await Purchase.findById(purchase._id);
    expect(res).not.toBeNull();
  });

  it("should return 401 if client is not logged in", async () => {
    const res = await request(server)
      .post("api/purchaseReturn")
      .send({
        supplierId: supplierId,
        quantity: 50,
        amount: 50000,
        product: ["a", "b", "c"],
        transactionType: "cash",
      });
    expect(res.status).toBe(401);
  });
});
