const mongoose = require("mongoose");
const Joi = require("joi");

const Supplier = mongoose.model(
  "Supplier",
  new mongoose.Schema({
    supplier: {
      type: String,
      required: true,
    },
    phone: String,
    reference: {
      type: Number,
      default: 0,
    },
  })
);

function validateSupplier(supplier) {
  const schema = Joi.object({
    supplier: Joi.string().required(),
    phone: Joi.string().required(),
    reference: Joi.number().integer(),
  });

  return schema.validate(supplier);
}

exports.Supplier = Supplier;
exports.validate = validateSupplier;
