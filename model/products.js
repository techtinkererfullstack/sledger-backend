const mongoose = require("mongoose");
const Joi = require("joi");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
});

const Product = mongoose.model("Product", productSchema);

function validateCustomer(product) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
  });

  return schema.validate(product);
}

exports.Product = Product;
exports.validate = validateCustomer;
exports.productSchema = productSchema;
