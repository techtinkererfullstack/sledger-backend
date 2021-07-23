const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");
const config = require("config");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

require("./startup/routes")(app);

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

const port = 5050;
app.listen(port, () => console.log(`Listening onport ${port}...`));
