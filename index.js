const express = require("express");
const mongoose = require("mongoose");
const sales = require("./router/sales");
const customer = require("./router/customer");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect("mongodb://localhost/s-ledger", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to mongo db..."))
  .catch((err) => console.error("could not connect to mongodb...1", err));

app.get("/", (req, res) => {
  res.send("sledger home page...");
});

app.use("/api/sales", sales);
app.use("/api/customer", customer);

const port = 5050;
app.listen(port, () => console.log(`Listening onport ${port}...`));
