const winston = require("winston");
const express = require("express");
const app = express();

require("./startup/loggin")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();

//const port = process.env.PORT || 5050;
const port = 5050;
const server = app.listen(port, () => winston.info(`Listening onport ${port}...`));

module.exports = server;
