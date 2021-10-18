const db = require("../models");
const User = db.users;
const Teacher = db.teachers;
const Op = db.Sequelize.Op;
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Create and Save a new User
exports.create = async(req, res) => {
  // Validate request
  if (!req.body.username || !req.body.password) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  // check is exist username
  const countUsername = await User.count({ where: { username: req.body.username } });
  if (countUsername > 0) {
    res.status(400).send({
      message: "username already exists!"
    });
    return;
  }
  // to hash a password
  const password = req.body.password;
  const hash = bcrypt.hashSync(password, saltRounds);

  const currentTime = new Date();
  // Create a User
  const user = {
    username: req.body.username,
    password: hash,
    roles: req.body.roles,
    category: req.body.category,
    active: true,
    createdBy: req.body.createdBy,
    createdAt: currentTime,
    updatedBy: null,
    updatedAt: null,
    deletedAt: null,
  };

  // Save User in the database
  User.create(user)
    .then(data => {
      // If category is teacher then create a teacher
      if ('teacher' == req.body.category) {
        const teacher = {
          user_id: data.id,
          username: req.body.username,
          first_name: req.body.firstName ? req.body.firstName : null,
          last_name: req.body.lastName ? req.body.lastName : null,
          active: true,
          createdBy: req.body.createdBy ? req.body.createdBy : null,
          createdAt: currentTime,
          updatedBy: null,
          updatedAt: null,
          deletedAt: null,
        }
        Teacher.create(teacher)
          .catch(err => {
            res.status(500).send({
              message: err.message || "Some error occurred while creating the Teacher."
            });
          });
      }
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User."
      });
    });
};

// Retrieve all Users from the database.
exports.findAll = async(req, res) => {
  const username = req.query.username ? req.query.username : null;
  const category = req.query.category ? req.query.category : null;
  const roles = req.query.roles ? req.query.roles : null;
  const limit = req.query.limit ? req.query.limit : null;
  const offset = req.query.offset ? req.query.offset : 0;

  // create search condition
  var condition = {};
  if (username) {
    Object.assign(condition, {
      username: {
        [Op.like]: `%${username}%`
      }
    });
  }
  if (category) {
    Object.assign(condition, {
      category: category
    });
  }
  if (roles) {
    Object.assign(condition, {
      roles: roles
    });
  }
  if (active) {
    Object.assign(condition, {
      active: active
    });
  }
  // get total
  const total = await User.count({ where: condition });

  const pagination = {};
  if (limit) {
    Object.assign(pagination, {
      limit: Number(limit)
    });
  }
  if (offset) {
    Object.assign(pagination, {
      offset: Number(offset)
    });
  }

  await User.findAll(Object.assign({ where: condition }, pagination))
    .then(data => {
      const resData = {
        users: data,
        limit: limit,
        offset: offset,
        total: total,
      }
      res.send(resData);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Users."
      });
    });
};

// Find a single User with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findByPk(Number(id))
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id
      });
    });
};

// Update a User by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  User.update(req.body, {
      where: { id: Number(id) }
    })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating User with id=" + id
      });
    });
};

// change password
exports.changePassword = async(req, res) => {
  const id = req.params.id;
  const username = req.body.username;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  // confirm old password
  const currentUser = await User.findOne({ where: { id: Number(id), username: username } })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id
      });
    });
  if (currentUser == null || !bcrypt.compareSync(oldPassword, currentUser.password)) {
    res.status(400).send({
      message: "Username or Password is not correct!!!"
    });
    return;
  }

  // hash a new password
  const hash = bcrypt.hashSync(newPassword, saltRounds);
  User.update({ password: hash, updatedAt: new Date() }, {
      where: { id: Number(id) }
    })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Changed password successfully."
        });
      } else {
        res.send({
          message: `Cannot change password with id=${id}. Maybe User was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating User with id=" + id
      });
    });
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  User.destroy({
      where: { id: Number(id) }
    })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "User was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete User with id=" + id
      });
    });
};

// Delete all Users from the database.
exports.deleteAll = (req, res) => {
  User.destroy({
      where: {},
      truncate: false
    })
    .then(nums => {
      res.send({ message: `${nums} Users were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all Users."
      });
    });
};

// find all published User
exports.findAllPublished = (req, res) => {
  User.findAll({ where: { published: true } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Users."
      });
    });
};

// User login
exports.login = async(req, res) => {
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
  const currentUser = await User.findOne({ where: { active: true, username: username } })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id
      });
    });
  if (currentUser == null || !bcrypt.compareSync(password, currentUser.password)) {
    res.status(400).send({
      message: "Username or Password is not correct!!!"
    });
    return;
  }
  res.send({
    message: "Login successfully!"
  });
};