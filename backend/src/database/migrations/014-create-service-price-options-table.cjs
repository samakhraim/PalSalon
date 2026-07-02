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
    if (await hasTable(queryInterface, "service_price_options")) {
      return;
    }

    await queryInterface.createTable("service_price_options", {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      service_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: "services",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      name: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      discount_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      duration_minutes: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
      },
      is_default: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isactive: {
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
    if (!(await hasTable(queryInterface, "service_price_options"))) {
      return;
    }

    await queryInterface.dropTable("service_price_options");
  },
};
