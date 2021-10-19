const { verifySignUp } = require("../middleware");

module.exports = app => {
  const news = require("../controllers/news.controller.js");

  var router = require("express").Router();

  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Create a new news
  router.post("/", news.create);

  // Retrieve all news
  router.get("/", news.findAll);

  // Retrieve a single news with id
  router.get("/:id", news.findOne);

  // Update a news with id
  router.put("/:id", news.update);

  // Delete a news with id
  router.delete("/:id", news.delete);

  app.use('/api/news', [authJwt.verifyToken], router);
};