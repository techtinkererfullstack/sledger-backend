const mongoose = require("mongoose");
const Joi = require("joi");

const Purchase = mongoose.model(
  "Purchase",
  new mongoose.Schema({
    date: {
      type: Date,
      default: Date.now,
    },
    supplier: {
      type: new mongoose.Schema({
        name: {
          type: String,
          required: true,
          minlength: 5,
          maxlength: 200,
        },
      }),
      required: true,
    },
    quantity: {
      type: Number,
      default: 0,
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

function validatePurchase(purchase) {
  const schema = Joi.object({
    supplierId: Joi.string().required(),
    quantity: Joi.number().integer().required(),
    amount: Joi.number().integer().required(),
    product: Joi.array().items(Joi.string()).required(),
    transactionType: Joi.string().required(),
  });

  return schema.validate(purchase);
}

exports.Purchase = Purchase;
exports.validate = validatePurchase;
