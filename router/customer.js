const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Joi = require("joi");

const Customer = mongoose.model(
  "Customer",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
      max: 11,
    },
    address: {
      type: String,
      required: true,
      maxlength: 30,
    },
  })
);

router.get("/", async (req, res) => {
  const customer = await Customer.find();
  res.send(customer);
});

router.post("/", async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  let customer = new Customer({
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    address: req.body.address,
  });

  customer = await customer.save();
  res.send(customer);
});

router.put("/:id", async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      phoneNumber: req.body.quantity,
      address: req.body.amount,
    },
    { new: true }
  );

  if (!customer) return res.status(404).send("id not found...");

  res.send(customer);
});

router.delete("/:id", async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.param.id);

  if (!customer) return res.status(404).send("id not found...");
  res.send(customer);
});

router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.param.id);
  if (!customer) return res.status(404).send("id not found...");
  res.send(customer);
});

function validateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().required(),
    phoneNumber: Joi.number().integer().required(),
    address: Joi.number().integer().required(),
  });

  return schema.validate(customer);
}

module.exports = router;
