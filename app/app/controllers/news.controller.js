const db = require("../models");
const News = db.news;
const Teacher = db.teachers;
const Op = db.Sequelize.Op;

// Create and Save a new News
exports.create = async(req, res) => {
  // Validate request
  if (!req.body.title || !req.body.type) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  const currentTime = new Date();
  // Create a new news
  const news = {
    title: req.body.title,
    type: req.body.type,
    image: req.body.image,
    content: req.body.content,
    createdBy: req.body.createdBy,
    createdAt: currentTime,
    updatedBy: null,
    updatedAt: null,
    deletedAt: null,
  };

  // Save News in the database
  News.create(news)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the News."
      });
    });
};

// Retrieve all news from the database.
exports.findAll = async(req, res) => {
  const title = req.query.title ? req.query.title : null;
  const type = req.query.type ? req.query.type : null;
  const createdBy = req.query.createdBy ? req.query.createdBy : null;
  const fromDate = req.query.fromDate ? req.query.fromDate : null;
  const toDate = req.query.toDate ? req.query.toDate : null;
  const limit = req.query.limit ? req.query.limit : null;
  const offset = req.query.offset ? req.query.offset : 0;

  // create search condition
  var condition = {};
  if (title) {
    Object.assign(condition, {
      title: {
        [Op.like]: `%${title}%`
      }
    });
  }
  if (type) {
    Object.assign(condition, {
      type: type
    });
  }
  if (createdBy) {
    Object.assign(condition, {
      created_by: {
        [Op.like]: `%${createdBy}%`
      }
    });
  }
  if (fromDate && toDate) {
    Object.assign(condition, {
      created_at: {
        [Op.lt]: new Date(toDate),
        [Op.gte]: new Date(fromDate)
      }
    });
  }

  // get total
  const total = await News.count({ where: condition });

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

  await News.findAll(Object.assign({ where: condition }, pagination))
    .then(data => {
      const resData = {
        news: data,
        limit: limit,
        offset: offset,
        total: total,
      }
      res.send(resData);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving news."
      });
    });
};

// Find a single News with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  News.findByPk(Number(id))
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving News with id=" + id
      });
    });
};

// Update a News by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  News.update(req.body, {
      where: { id: Number(id) }
    })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "News was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update News with id=${id}. Maybe News was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating News with id=" + id
      });
    });
};

// Delete a News with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  News.destroy({
      where: { id: Number(id) }
    })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "News was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete News with id=${id}. Maybe News was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete News with id=" + id
      });
    });
};

// Delete all news from the database.
exports.deleteAll = (req, res) => {
  News.destroy({
      where: {},
      truncate: false
    })
    .then(nums => {
      res.send({ message: `${nums} news were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all news."
      });
    });
};