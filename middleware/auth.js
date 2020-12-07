const Jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  //Get token from headers;
  const token = req.header("access-token");
  //check if token exists?;
  if (!token) {
    return res
      .status(401)
      .json({ msg: "There are no token provided in the header!" });
  }
  //verify the Token;
  try {
    Jwt.verify(token, config.get("JWT-SECRET"), (err, decode) => {
      if (err) {
        return res.status(401).json({ msg: "The given token is not valid" });
      } else {
        req.user = decode.user;
        next();
      }
    });
  } catch (err) {
    console.error("There is an error with auth file verifying token");
    res.status(500).json({ msg: "Server side error in auth file." });
  }
};
