const db = require("../models");
const Group = db.groups;
const Op = db.Sequelize.Op;

// Create and Save a new Group
exports.create = async(req, res) => {
  // Validate request
  if (!req.body.groupName || !req.body.type) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  const currentTime = new Date();
  // Create a Group
  const group = {
    group_name: req.body.groupName,
    type: req.body.type,
    category: req.body.category,
    createdBy: req.body.createdBy,
    createdAt: currentTime,
    updatedBy: null,
    updatedAt: null,
    deletedAt: null,
  };

  // Save Group in the database
  Group.create(group)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Group."
      });
    });
};

// Retrieve all Groups from the database.
exports.findAll = async(req, res) => {
  const groupName = req.query.groupName ? req.query.groupName : null;
  const type = req.query.type ? req.query.type : null;
  const limit = req.query.limit ? req.query.limit : null;
  const offset = req.query.offset ? req.query.offset : 0;

  // create search condition
  var condition = {};
  if (groupname) {
    Object.assign(condition, {
      group_name: {
        [Op.like]: `%${groupName}%`
      }
    });
  }
  if (type) {
    Object.assign(condition, {
      type: type
    });
  }

  // get total
  const total = await Group.count({ where: condition });

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

  await Group.findAll(Object.assign({ where: condition }, pagination))
    .then(data => {
      const resData = {
        groups: data,
        limit: limit,
        offset: offset,
        total: total,
      }
      res.send(resData);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Groups."
      });
    });
};

// Find a single Group with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Group.findByPk(Number(id))
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Group with id=" + id
      });
    });
};

// Update a Group by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Group.update(req.body, {
      where: { id: Number(id) }
    })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Group was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Group with id=${id}. Maybe Group was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Group with id=" + id
      });
    });
};

// Delete a Group with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Group.destroy({
      where: { id: Number(id) }
    })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Group was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Group with id=${id}. Maybe Group was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Group with id=" + id
      });
    });
};

// Delete all Groups from the database.
exports.deleteAll = (req, res) => {
  Group.destroy({
      where: {},
      truncate: false
    })
    .then(nums => {
      res.send({ message: `${nums} Groups were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all Groups."
      });
    });
};