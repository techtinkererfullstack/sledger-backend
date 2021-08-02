const mongoose = require('mongoose');

module.exports = function(req, res, next) {
	const objectId = mongoose.Types.ObjectId.isValid(req.params.id);   
    if (!objectId) {
        console.log(!objectId)
       return res.status(404).send("Invalid Id");
  }
  next();	
}


  
