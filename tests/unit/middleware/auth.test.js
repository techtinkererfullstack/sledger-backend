const { User } = require("../../../model/users");
const auth = require("../../../middleware/auth");
const mongoose = require("mongoose");

describe("auth middleware", () => {
  it("should populate req.user with payload of a valid jwt", () => {
    const user = {
      _id: mongoose.Types.ObjectId().toHexString(),
      admin: true,
    };

    const token = new User().generateAuthToken();

    const req = {
      header: jest.fn().mockReturnValue(token),
    };

    const res = {};
    const next = jest.fn();

    auth(req, res, next);
    expect(req.user).toMatchObject(user);
  });
});
