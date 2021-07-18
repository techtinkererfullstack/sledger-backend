const { Supplier, validate } = require("../model/suppliers");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const supplier = await Supplier.find();
  res.send(supplier);
});

router.get("/:id", async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);
  if (!supplier) return res.status(404).send("supplier not found...");
  res.send(supplier);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  let supplier = new Supplier({
    supplier: req.body.supplier,
    phone: req.body.phone,
    reference: req.body.reference,
  });

  supplier = await supplier.save();
  res.send(supplier);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  const supplier = await Supplier.findByIdAndUpdate(
    req.params.id,
    {
      supplier: req.body.supplier,
      phone: req.body.phone,
      reference: req.body.reference,
    },
    { new: true }
  );

  if (!supplier) return res.status(404).send("id not found...");

  res.send(supplier);
});

router.delete("/:id", async (req, res) => {
  const supplier = await Supplier.findByIdAndDelete(req.params.id);

  if (!supplier) return res.status(404).send("id not found...");
  res.send(supplier);
});

module.exports = router;
