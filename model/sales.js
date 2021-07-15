const mongoose = require("mongoose");
const Joi = require("joi");

const Sale = mongoose.model(
  "Sale",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
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
      type: String,
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
    name: Joi.string(),
    quantity: Joi.number().integer().required(),
    amount: Joi.number().integer().required(),
    product: Joi.string().required(),
    transactionType: Joi.string().required(),
  });

  return schema.validate(sale);
}

exports.Sale = Sale;
exports.validate = validateSale;
