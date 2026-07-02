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
    if (await hasTable(queryInterface, "pages")) {
      return;
    }

    await queryInterface.createTable("pages", {
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
      slug: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      description: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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
    if (!(await hasTable(queryInterface, "pages"))) {
      return;
    }

    await queryInterface.dropTable("pages");
  },
};
