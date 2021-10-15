const db = require("../models");
const User = db.users;
const Teacher = db.teachers;
const Op = db.Sequelize.Op;

// Retrieve all Teachers from the database.
exports.findAll = async(req, res) => {
  const username = req.query.username ? req.query.username : null;
  const firstName = req.query.firstName ? req.query.firstName : null;
  const lastName = req.query.lastName ? req.query.lastName : null;
  const title = req.query.title ? req.query.title : null;
  const email = req.query.email ? req.query.email : null;
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
  if (firstName) {
    Object.assign(condition, {
      first_name: {
        [Op.like]: `%${firstName}%`
      }
    });
  }
  if (lastName) {
    Object.assign(condition, {
      last_name: {
        [Op.like]: `%${lastName}%`
      }
    })
  }
  if (email) {
    Object.assign(condition, {
      email: {
        [Op.like]: `%${email}%`
      }
    });
  }
  if (phoneNumber) {
    Object.assign(condition, {
      phone_number: {
        [Op.like]: `%${phoneNumber}%`
      }
    });
  }
  if (title) {
    Object.assign(condition, {
      title: title
    });
  }
  if (active) {
    Object.assign(condition, {
      active: active
    });
  }
  // get total
  const total = await Teacher.count({ where: condition });

  const pagination = {};
  if (limit) {
    Object.assign(pagination, {
      limit: Number(limit)
    })
  }
  if (offset) {
    Object.assign(pagination, {
      offset: Number(offset)
    })
  }

  await Teacher.findAll(Object.assign({ where: condition }, pagination))
    .then(data => {
      const resData = {
        teachers: data,
        limit: limit,
        offset: offset,
        total: total,
      }
      res.send(resData);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Teachers."
      });
    });
};

// Find a single Teacher with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Teacher.findByPk(Number(id))
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Teacher with id=" + id
      });
    });
};

// Update a Teacher by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  User.update(req.body, {
      where: { id: Number(id) }
    })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Teacher was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Teacher with id=${id}. Maybe Teacher was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Teacher with id=" + id
      });
    });
};

// Delete a Teacher with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Teacher.destroy({
      where: { id: Number(id) }
    })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Teacher was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Teacher with id=${id}. Maybe Teacher was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Teacher with id=" + id
      });
    });
};

// Delete all Teachers from the database.
exports.deleteAll = (req, res) => {
  Teacher.destroy({
      where: {},
      truncate: false
    })
    .then(nums => {
      res.send({ message: `${nums} Teachers were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all Teachers."
      });
    });
};