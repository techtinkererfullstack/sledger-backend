const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");
const error = require("./middleware/error");
const config = require("config");
const express = require("express");
const mongoose = require("mongoose");
const sales = require("./router/sale");
const customers = require("./router/customer");
const products = require("./router/product");
const purchases = require("./router/purchase");
const suppliers = require("./router/supplier");
const users = require("./router/user");
const auths = require("./router/auth");
const app = express();
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

//first way
// process.on("uncaughtException", (ex) => {
//   //console.log("WE GOT AN UNCOUGHT EXCEPTION");
//   winston.error(ex.message, ex);
//   process.exit(1);
// });

// process.on("unhandledRejection", (ex) => {
//   //console.log("WE GOT AN UNCOUGHT EXCEPTION");
//   winston.error(ex.message, ex);
//   process.exit(1);
// });

//second way
winston.handleExceptions(
  new winston.transports.File({ filename: "uncaughtException.log" })
);

process.on("unhandledRejection", (ex) => {
  throw ex;
});

winston.add(winston.transports.File, { filename: "logfile.log" });
winston.add(winston.transports.MongoDB, {
  db: "mongodb://localhost/s-ledger",
  level: "info",
});

//throw new Error("intentional error");

const p = Promise.reject(new Error("something failed miserably"));
p.then(() => console.log("done"));

if (!config.get("jwtPrivateKey")) {
  return console.error("FATAL ERROR: jwt token is not defined");
  process.exit(1);
}

app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(`mongodb://localhost/s-ledger`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log("connected to mongo db..."))
  .catch((err) => console.error("could not connect to mongodb...1", err));

app.get("/", (req, res) => {
  res.send("sledger home page...");
});

app.use(express.json());
app.use("/api/sales", sales);
app.use("/api/customers", customers);
app.use("/api/products", products);
app.use("/api/purchases", purchases);
app.use("/api/suppliers", suppliers);
app.use("/api/users", users);
app.use("/api/auths", auths);
app.use(error);

const port = 5050;
app.listen(port, () => console.log(`Listening onport ${port}...`));
