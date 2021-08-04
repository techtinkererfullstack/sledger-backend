const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth');
const { User, validate } = require("../model/users");
const bcrypt = require("bcryptjs");
const _ = require("lodash");

router.get("/me",auth, async (req, res) => {
  const users = await User.findById(req.user._id).select('-password');
  res.send(users);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered");

  user = new User(_.pick(req.body, ["username", "password", "email"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();

  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "username", "email"]));
});

module.exports = router;
