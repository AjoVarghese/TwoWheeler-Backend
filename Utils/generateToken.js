const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.generateToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_CODE, {
    expiresIn: "30d",
  });
};

// module.export = generateToken
