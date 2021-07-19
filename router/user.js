const { User, validate } = require("../model/users");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const _ = require("lodash");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered");

  user = new User(_.pick(req.body, ["username", "password", "email"]));

  await user.save();
  res.send(_.pick(user, ["username", "email"]));
});

module.exports = router;
