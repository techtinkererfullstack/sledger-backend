const jwt = require("jsonwebtoken");
const config = require("config");

function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("access denied, no token found");

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));

    req.user = decoded;
    //req.user._id...i
    next();
  } catch (ex) {
    console.log(ex.message);
    res.status(400).send("Invalid token");
  }
}

module.exports = auth;
