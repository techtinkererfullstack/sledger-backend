const winston = require("winston");
module.exports = function (err, req, res, next) {
  // log
  //winston.log("error", err);
  winston.error(err.message, err);
  //error
  //warn
  //info
  //verbose
  //debug
  //silly
  res.status(500).send("something went wrong");
};
