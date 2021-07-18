const mongoose = require("mongoose");
const Joi = require("joi");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  group: {
    type: String,
    enum: ["a", "b", "c"],
  },
  inStock: {
    type: Number,
    default: 0,
    required: true,
  },
});

const Product = mongoose.model("Product", productSchema);

function validateProduct(product) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    group: Joi.string().required(),
    inStock: Joi.number().integer().require(),
  });

  return schema.validate(product);
}

exports.Product = Product;
exports.validate = validateProduct;
exports.productSchema = productSchema;
