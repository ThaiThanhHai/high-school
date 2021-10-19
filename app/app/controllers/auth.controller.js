const db = require("../models");
const User = db.users;
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");

// User signin
exports.signin = async(req, res) => {
  // Validate request
  if (!req.body.username || !req.body.password) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  const username = req.body.username;
  const password = req.body.password;

  // check user
  const user = await User.findOne({ where: { active: true, username: username } })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id
      });
    });
  if (user == null || !bcrypt.compareSync(password, user.password)) {
    res.status(400).send({
      message: "Username or Password is not correct!!!"
    });
    return;
  }
  var token = jwt.sign({ id: user.id }, config.secret, {
    expiresIn: 86400 // 24 hours
  });
  res.status(200).send({
    id: user.id,
    username: user.username,
    // email: user.email,
    roles: user.roles,
    accessToken: token
  });
};