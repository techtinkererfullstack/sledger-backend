const mongoose = require("mongoose");

module.exports = function validateObjectId(req, res, next) {
  const objectId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!objectId) {
    return res.status(404).send("Invalid Id");
  }
  next();
};
