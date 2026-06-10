module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("media", {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      modelType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      modelId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      collectionName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fileName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      originalName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      mimeType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      size: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      disk: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "local",
      },
      path: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      conversions: {
        type: Sequelize.JSON,
        allowNull: true,
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

    await queryInterface.addIndex("media", ["modelType", "modelId"])
    await queryInterface.addIndex("media", ["collectionName"])
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("media")
  },
}
