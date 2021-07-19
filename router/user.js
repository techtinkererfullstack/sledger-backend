const jwt = require('jsonwebtoken');
const config = require('config');
const { User, validate } = require("../model/users");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const _ = require("lodash");

router.get("/", async (req, res) => {
  const users = await User.find();
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

  const token = jwt.sign({ _id: user._id }, config.get("jwtPrivateKey"));

  await user.save();
  res.header('x-json-token',token).send(_.pick(user, ["_id", "username", "email"]));
});

module.exports = router;