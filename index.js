const winston = require("winston");
const express = require("express");
const app = express();

require("./startup/loggin");
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();

const port = process.env.PORT || 5050;
app.listen(port, () => winston.info(`Listening onport ${port}...`));
