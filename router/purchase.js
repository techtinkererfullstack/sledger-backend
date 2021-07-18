const express = require("express");
const router = express.Router();
const { Purchase, validate } = require("../model/purchases");                               
const { Supplier } = require("../model/suppliers");

router.get("/", async (req, res) => {
  const purchases = await Purchase.find();

 // res.send(purchases);
  res.send('working..')
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  const supplier = await Supplier.findById(supplierId);
  if (!supplier) return res.status(404).send("supplier id not valid...");

  let purchase = new Purchase({
    supplier: {
      _id: supplier._id,
      name: supplier.name,
      phone: supplier.phone,
      reference: supplier.reference
    },
    quantity: req.body.quantity,
    amount: req.body.amount,
    product: req.body.product,
    transactionType: req.body.transactionType,
  });

  purchase = await Purchase.save();
  supplier.reference++;
  Supplier.save();

  res.send(purchase);
  console.log(purchase);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  const purchase = await Purchase.findByIdAndUpdate(
    req.params.id,
    {
      supplier: {
        _id: supplier._id,
        name: supplier.name,
        phone: supplier.phone,
      },
      quantity: req.body.quantity,
      amount: req.body.amount,
      product: req.body.product,
      transactionType: req.body.transactionType,
    },
    { new: true }
  );

  if (!purchase) return res.status(404).send("id not found...");

  res.send(purchase);
});

router.delete("/:id", async (req, res) => {
  const purchase = await purchase.findByIdAndDelete(req.params.id);

  if (!purchase) return res.status(404).send("id not found...");
  res.send(purchase);
});

router.get("/:id", async (req, res) => {
  const purchase = await purchase.findById(req.params.id);
  if (!purchase) return res.status(404).send("id not found...");
  res.send(purchase);
});

module.exports = router;
