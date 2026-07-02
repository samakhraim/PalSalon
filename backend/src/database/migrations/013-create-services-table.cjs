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
    if (await hasTable(queryInterface, "services")) {
      return;
    }

    await queryInterface.createTable("services", {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      salon_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: "salons",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      category_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: "categories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      name: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      description: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      duration_minutes: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
      },
      isactive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
    if (!(await hasTable(queryInterface, "services"))) {
      return;
    }

    await queryInterface.dropTable("services");
  },
};
