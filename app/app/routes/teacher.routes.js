module.exports = app => {
  const teachers = require("../controllers/teahcher.controller.js");

  var router = require("express").Router();

  // Retrieve all teachers
  router.get("/", teachers.findAll);

  // Retrieve a single Teacher with id
  router.get("/:id", teachers.findOne);

  // Update a Teacher with id
  router.put("/:id", teachers.update);

  // Delete a Teacher with id
  router.delete("/:id", teachers.delete);

  // Delete all teachers
  router.delete("/", teachers.deleteAll);

  app.use('/api/teachers', router);
};