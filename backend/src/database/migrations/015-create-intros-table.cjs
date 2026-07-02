"use strict";

const hasTable = async (queryInterface, tableName) => {
  const tables = await queryInterface.showAllTables();
  const normalizedTableName = tableName.toLowerCase();

  return tables.some((table) => {
    if (typeof table === "string") {
      return table.toLowerCase() === normalizedTableName;
    }

    if (table && typeof table === "object") {
      return Object.values(table).some(
        (value) => String(value).toLowerCase() === normalizedTableName
      );
    }

    return false;
  });
};

module.exports = {
  async up(queryInterface, Sequelize) {
    if (await hasTable(queryInterface, "intros")) {
      return;
    }

    await queryInterface.createTable("intros", {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      description: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    if (!(await hasTable(queryInterface, "intros"))) {
      return;
    }

    await queryInterface.dropTable("intros");
  },
};
