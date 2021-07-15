const { Sale, validate } = require("../model/sales");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const sales = await Sale.find().sort("name");
  res.send(sales);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  let sale = new Sale({
    name: req.body.name,
    quantity: req.body.quantity,
    amount: req.body.amount,
    product: req.body.product,
    transactionType: req.body.transactionType,
  });

  sale = await sale.save();
  res.send(sale);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  const sale = await Sale.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
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

router.delete("/:id", async (req, res) => {
  const sale = await Sale.findByIdAndDelete(req.params.id);

  if (!sale) return res.status(404).send("id not found...");
  res.send(sale);
});

router.get("/:id", async (req, res) => {
  const sale = await Sale.findById(req.params.id);
  if (!sale) return res.status(404).send("id not found...");
  res.send(sale);
});

module.exports = router;
