const jwt = require("jsonwebtoken");
const token_secret =
  "dvf025vx4d2vs5vs2vqe1bf2ds5gbsfd6sf52sd2fxb5sdgb8gf5dh5z5rdf6hbdfb9d8gbrs74b1fg"; // Secret keys that should never come back

module.exports.generateToken = (userData) => {
  return jwt.sign({ userId: userData }, token_secret, { expiresIn: "24h" });
};

module.exports.token = token_secret;
