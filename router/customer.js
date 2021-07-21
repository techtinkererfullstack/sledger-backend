const { Customer, validate } = require("../model/customers");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const customer = await Customer.find();
    res.send(customer);
  } catch (ex) {
    next(ex);
  }
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  let customer = new Customer({
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    address: req.body.address,
    location: req.body.location,
  });

  customer = await customer.save();
  res.send(customer);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      location: req.body.location,
    },
    { new: true }
  );

  if (!customer) return res.status(404).send("id not found...");

  res.send(customer);
});

router.delete("/:id", async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);

  if (!customer) return res.status(404).send("id not found...");
  res.send(customer);
});

router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(404).send("id not found...");
  res.send(customer);
});

module.exports = router;
