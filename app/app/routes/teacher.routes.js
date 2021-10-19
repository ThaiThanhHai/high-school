const { verifySignUp } = require("../middleware");

module.exports = app => {
  const teachers = require("../controllers/teacher.controller.js");

  var router = require("express").Router();

  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

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

  app.use('/api/teachers', [authJwt.verifyToken], router);
};