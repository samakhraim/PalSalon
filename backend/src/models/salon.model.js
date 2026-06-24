export default function SalonModel(sequelize, DataTypes) {
  return sequelize.define(
    "Salon",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      salon_owner_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      city_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      name: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      description: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      address: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      cancellation_policy: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      country_phone_code: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      telephone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      latitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: true,
      },
      longitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: true,
      },
      opening_hours: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      off_days: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      click_count: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
      isactive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: "salons",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  )
}
