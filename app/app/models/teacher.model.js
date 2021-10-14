module.exports = (sequelize, Sequelize) => {
  const Teacher = sequelize.define("teacher", {
    title: {
      userId: Sequelize.INTEGER
    },
    image: {
      type: Sequelize.STRING
    },
    title: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    phoneNumber: {
      type: Sequelize.STRING
    },
    certificate: {
      type: Sequelize.STRING
    },
    position: {
      type: Sequelize.STRING
    },
    image: {
      type: Sequelize.STRING
    },
    dob: {
      type: Sequelize.DATE
    },
    intro: {
      type: Sequelize.TEXT
    },
    joined: {
      type: Sequelize.DATE
    },
    active: {
      type: Sequelize.BOOLEAN
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

  return Teacher;
};
