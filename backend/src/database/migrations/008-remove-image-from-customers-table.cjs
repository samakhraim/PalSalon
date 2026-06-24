"use strict";

module.exports = {
  async up(queryInterface) {
    const tables = await queryInterface.showAllTables();
    const normalizedTables = tables.map((table) =>
      typeof table === "string" ? table : table.tableName || table.name
    );

    if (!normalizedTables.includes("customers")) {
      return;
    }

    const customersTable = await queryInterface.describeTable("customers");

    if (Object.prototype.hasOwnProperty.call(customersTable, "image")) {
      await queryInterface.removeColumn("customers", "image");
    }
  },

  async down(queryInterface, Sequelize) {
    const tables = await queryInterface.showAllTables();
    const normalizedTables = tables.map((table) =>
      typeof table === "string" ? table : table.tableName || table.name
    );

    if (!normalizedTables.includes("customers")) {
      return;
    }

    const customersTable = await queryInterface.describeTable("customers");

    if (!Object.prototype.hasOwnProperty.call(customersTable, "image")) {
      await queryInterface.addColumn("customers", "image", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },
};
