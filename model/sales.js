const mongoose = require("mongoose");
const Joi = require("joi");
const { Customer } = require("./customers");

const Sale = mongoose.model(
  "Sale",
  new mongoose.Schema({
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: false,
    },
    quantity: {
      type: Number,
      required: false,
    },
    amount: {
      type: Number,
      required: true,
    },
    product: {
      type: Array,
      required: true,
    },
    transactionType: {
      type: String,
      enum: ["cash", "credit"],
    },
  })
);

function validateSale(sale) {
  const schema = Joi.object({
    // customerId: Joi.objectId().required(),
    quantity: Joi.number().integer().required(),
    amount: Joi.number().integer().required(),
    product: Joi.array().items(Joi.string()).required(),
    transactionType: Joi.string().required(),
  });

  return schema.validate(sale);
}

exports.Sale = Sale;
exports.validate = validateSale;
