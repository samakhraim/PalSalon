module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("faqs", {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      question: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      answer: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    })
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("faqs")
  },
}
