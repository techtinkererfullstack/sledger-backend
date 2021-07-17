const mongoose = require("mongoose");
const Joi = require("joi");

const customersSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    phoneNumber: {
      type: String,
      required: true,
      min: 1,
      max: 11,
    },
    address: {
      type: String,
      required: true,
      min: 1,
      maxlength: 30,
    },
    location: {
      type: String,
      minlength: 0,
      maxlength: 50,
    },
  })

const Customer = mongoose.model(
  "Customer", customersSchema
  );

function validateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    phoneNumber: Joi.string().min(1).max(11).required(),
    address: Joi.string().min(1).max(30).required(),
    location: Joi.string().min(1).max(30).required(),
  });

  return schema.validate(customer);
}

exports.Customer = Customer;
exports.validate = validateCustomer;
exports.customersSchema = customersSchema;
