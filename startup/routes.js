const sales = require("../router/sale");
const customers = require("../router/customer");
const products = require("../router/product");
const purchases = require("../router/purchase");
const suppliers = require("../router/supplier");
const users = require("../router/user");
const auths = require("../router/auth");
const error = require("../middleware/error");
const express = require("express");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/sales", sales);
  app.use("/api/customers", customers);
  app.use("/api/products", products);
  app.use("/api/purchases", purchases);
  app.use("/api/suppliers", suppliers);
  app.use("/api/users", users);
  app.use("/api/auths", auths);
  app.use(error);
};
