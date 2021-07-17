const { Product, validate } = require("../model/products");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const product = await Product.find();
  res.send(product);
});

router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).send("id not found...");
  res.send(product);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  let product = new Product({
    name: req.body.name,
  });

  product = await product.save();
  res.send(product);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
    },
    { new: true }
  );

  if (!product) return res.status(404).send("id not found...");

  res.send(product);
});

router.delete("/:id", async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) return res.status(404).send("id not found...");
  res.send(product);
});

module.exports = router;
