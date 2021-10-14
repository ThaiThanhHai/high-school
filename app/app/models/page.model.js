module.exports = (sequelize, Sequelize) => {
  const Page = sequelize.define("page", {
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

  return Page;
};
