const validateObjectid = require('../middleware/validateObjectId')
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { Sale, validate } = require("../model/sales");
const { Customer } = require("../model/customers");

router.get("/", async (req, res) => {
  const sales = await Sale.find()
    .sort("name")
    .populate("customer", "name location -_id")
    .select("customer name");
  res.send(sales);
});

router.get("/:id",validateObjectid, async (req, res) => {
  const sale = await Sale.findById(req.params.id);
  if (!sale) return res.status(404).send("id not found...");

  res.send(sale);

});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(404).send("Invalid customer");

  let sale = new Sale({
    customer: req.body.customerId,
    quantity: req.body.quantity,
    amount: req.body.amount,
    product: req.body.product,
    transactionType: req.body.transactionType,
  });

  sale = await sale.save();
  res.send(sale);
  console.log(sale);
});

router.put("/:id", [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(404).send("Invalid customer");

  const sale = await Sale.findByIdAndUpdate(
    req.params.id,
    {
      customer: req.body.customerId,
      quantity: req.body.quantity,
      amount: req.body.amount,
      product: req.body.product,
      transactionType: req.body.transactionType,
    },
    { new: true }
  );

  if (!sale) return res.status(404).send("id not found...");

  res.send(sale);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const sale = await Sale.findByIdAndDelete(req.params.id);

  if (!sale) return res.status(404).send("id not found...");
  res.send(sale);
});

module.exports = router;
