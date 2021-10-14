module.exports = (sequelize, Sequelize) => {
  const News = sequelize.define("news", {
    title: {
      type: Sequelize.STRING
    },
    image: {
      type: Sequelize.STRING
    },
    type: {
      type: Sequelize.STRING
    },
    content: {
      type: Sequelize.TEXT
    },
    createdBy: {
      type: Sequelize.INTEGER
    },
    createdAt: {
      type: Sequelize.DATE
    },
    updatedBy: {
      type: Sequelize.INTEGER
    },
    updatedAt: {
      type: Sequelize.DATE
    },
    deletedAt: {
      type: Sequelize.DATE
    },
  });

  return News;
};
