const { User } = require("../../model/users");
const request = require("supertest");

describe("auth middleware", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(() => {
    server.close();
  });

  let token;
  const exec = () => {
    return request(server)
      .post("api/sales")
      .set("x-auth-token", token)
      .send({
        customer: "",
        amount: 10000,
        quantity: 40,
        product: ["mango", "banana", "coconut"],
        transactionType: "cash",
      });
  };

  beforeEach(() => {
    token = new User().generateAuthToken();
  });

  it("should return 401 if no token is provided", async () => {
    token = "";
    await exec();
    request(server).toBe(401);
  });
});
