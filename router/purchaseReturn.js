const express = require("express");
const router = express.Router();
const { Purchase } = require("../model/purchases");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  // const {error} = valodate(req.body)
  // if (error) return res.status(400).send(error.details[0].message)

  if (!req.body.supplierId)
    return res.status(400).send("supplierId id not provided");

  const purchase = await Purchase.findOne({
    "supplier._id": req.body.supplierId,
    quantity: req.body.quantity,
    amount: req.body.amount,
    product: req.body.product,
    transactionType: req.body.transactionType,
  });

  if (!purchase) return res.status(404).send("purchase not found");

  if (purchase.dateReturned) return res.status(400).send("already returned");

  purchase.dateReturned = new Date();

  await purchase.save();

  return res.status(200).send(purchase);
});

module.exports = router;
