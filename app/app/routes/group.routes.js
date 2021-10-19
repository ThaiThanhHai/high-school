const { verifySignUp } = require("../middleware");

module.exports = app => {
  const groups = require("../controllers/group.controller.js");

  var router = require("express").Router();

  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Create a new group
  router.post("/", groups.create);

  // Retrieve all groups
  router.get("/", groups.findAll);

  // Retrieve a single group with id
  router.get("/:id", groups.findOne);

  // Update a group with id
  router.put("/:id", groups.update);

  // Delete a group with id
  router.delete("/:id", groups.delete);

  app.use('/api/groups', [authJwt.verifyToken], router);
};