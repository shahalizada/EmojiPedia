const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Jwt = require("jsonwebtoken");
const config = require("config");
const gravatar = require("gravatar");
const { body, validationResult } = require("express-validator");

//User Model Import
const User = require("../../models/userModel");

//Route    Post => api/register;
//Desc     Register User;
//access   Public route;
router.post(
  "/",
  [
    body("name", "Name is a required field!").not().isEmpty(),
    body("email", "Email is a required field!").isEmail(),
    body(
      "password",
      "Password is a required field with minium 8 characters!"
    ).isLength({ min: 8 }),
  ],
  async (req, res) => {
    //Validation force;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
      //Check existing user;
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({
          errors: [{ msg: "Email is associated with another account!" }],
        });
      }
      //Get gravatar;
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });
      //New User;
      user = new User({
        name,
        email,
        password,
        avatar,
      });
      //Password Encryption
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      //save user;
      user.save();

      //Return Jwt Payload;
      const payload = {
        user: {
          id: user.id,
        },
      };
      //Sign a jsonwebtoken to user;
      Jwt.sign(
        payload,
        config.get("JWT-SECRET"),
        { expiresIn: "5 day" },
        (err, token) => {
          if (err) throw err;
          res.json({
            token,
            user: { id: user.id, name: user.name, email: user.email },
          });
        }
      );
    } catch (err) {
      console.error(err.message);
      res
        .status(500)
        .json({ msg: "There is an error on user registeration file" });
    }
    //Check exsiting user;
  }
);

module.exports = router;
