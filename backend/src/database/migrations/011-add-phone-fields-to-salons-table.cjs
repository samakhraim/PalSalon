"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const tables = await queryInterface.showAllTables();
    const normalizedTables = tables.map((table) =>
      typeof table === "string" ? table : table.tableName || table.name
    );

    if (!normalizedTables.includes("salons")) {
      return;
    }

    const salonsTable = await queryInterface.describeTable("salons");

    if (!Object.prototype.hasOwnProperty.call(salonsTable, "country_phone_code")) {
      await queryInterface.addColumn("salons", "country_phone_code", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (!Object.prototype.hasOwnProperty.call(salonsTable, "city_phone_code")) {
      await queryInterface.addColumn("salons", "city_phone_code", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (!Object.prototype.hasOwnProperty.call(salonsTable, "telephone")) {
      await queryInterface.addColumn("salons", "telephone", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (!Object.prototype.hasOwnProperty.call(salonsTable, "phone_number")) {
      await queryInterface.addColumn("salons", "phone_number", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  async down(queryInterface) {
    const tables = await queryInterface.showAllTables();
    const normalizedTables = tables.map((table) =>
      typeof table === "string" ? table : table.tableName || table.name
    );

    if (!normalizedTables.includes("salons")) {
      return;
    }

    const salonsTable = await queryInterface.describeTable("salons");

    const removableColumns = [
      "phone_number",
      "telephone",
      "city_phone_code",
      "country_phone_code",
    ];

    for (const columnName of removableColumns) {
      if (Object.prototype.hasOwnProperty.call(salonsTable, columnName)) {
        await queryInterface.removeColumn("salons", columnName);
      }
    }
  },
};
