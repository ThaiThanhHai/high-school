module.exports = (sequelize, Sequelize) => {
  const ProGroup = sequelize.define("pro_group", {
    groupName: {
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

  return ProGroup;
};
