const mongoose = require("mongoose");
const Joi = require("joi");

const Sale = mongoose.model(
  "Sale",
  new mongoose.Schema({
    customer: {
      type: String,
      required: true,
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
    customer: Joi.string().required(),
    quantity: Joi.number().integer().required(),
    amount: Joi.number().integer().required(),
    product: Joi.array().items(Joi.string()).required(),
    transactionType: Joi.string().required(),
  });

  return schema.validate(sale);
}

exports.Sale = Sale;
exports.validate = validateSale;
