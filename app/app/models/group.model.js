module.exports = (sequelize, Sequelize) => {
  const Group = sequelize.define("group", {
    groupName: {
      type: Sequelize.STRING
    },
    type: {
      type: Sequelize.STRING
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

  return Group;
};