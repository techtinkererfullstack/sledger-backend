const mongoose = require("mongoose");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    date: {
      type: Date,
      default: Date.now,
    },
    username: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minlength: 5,
      maxlength: 255,
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 1024,
    },
  })
);

function validateUser(user) {
  const schema = Joi.object({
    username: Joi.string().min(5).max(255).required(),
    password: passwordComplexity(),
    email: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;

//joi-passwor-complexity
