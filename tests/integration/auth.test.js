const request = require("supertest");
const mongoose = require("mongoose");
const { User } = require("../../model/users");
const { Sale } = require("../../model/sales");

let server;

describe("auth middleware", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    server.close();
    await User.deleteMany({});
  });

  it("should return 401 if if no token is provided", async () => {
    const res = await request(server).post("/api/sales/").send();
    expect(res.status).toBe(401);
  });

  it("should return 400 if if invalid token is provided", async () => {
    // const token = new User().generateAuthToken();
    const token = "invalid token";

    const res = await request(server)
      .post("/api/sales/")
      .set("x-auth-token", token)
      .send();
    expect(res.status).toBe(400);
  });

  it("should return 200 if if valid token is provided", async () => {
    const token = new User({
      username: "shafe",
      password: "ThisIs@a12345pass",
      email: "alam.shafe@gmail.com",
    }).generateAuthToken();

    //const token = 'invalid token';

    const res = await request(server)
      .post("/api/sales")
      .set("x-auth-token", token)
      .send({
        product: ["mango", "banana", "orange"],
        customer: "shafe",
        quantity: 200,
        amount: 1000,
        transactionType: "credit",
      });
    expect(res.status).toBe(200);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
