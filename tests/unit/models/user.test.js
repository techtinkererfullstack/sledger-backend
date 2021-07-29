const { User } = require("../../../model/users");
const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");

describe("user.generateAuthToken", () => {
  it("should return a valid jwt", () => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };
    const user = new User(payload);
    const token = user.generateAuthToken();
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    expect(decoded).toMatchObject(payload);
  });
});

// const { User } = require("../../../model/users");
// const jwt = require("jsonwebtoken");
// const mongoose = require("mongoose");
// const config = require("config");

// describe("generateAuthToken", () => {
//   it("should return a JWT signed with a private key", () => {
//     const userSchema = {
//       _id: new mongoose.Types.ObjectId().toHexString(),
//       isAdmin: true,
//     };
//     const userModel = new User(userSchema);
//     const token = userModel.generateAuthToken();
//     const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
//     expect(decoded).toMatchObject(userSchema);
//   });
// });
