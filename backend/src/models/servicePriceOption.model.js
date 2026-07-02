export default function ServicePriceOptionModel(sequelize, DataTypes) {
  return sequelize.define(
    "ServicePriceOption",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      service_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      name: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      discount_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      duration_minutes: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      is_default: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isactive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: "service_price_options",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  )
}
