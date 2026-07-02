export default function ServiceModel(sequelize, DataTypes) {
  return sequelize.define(
    "Service",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      salon_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      category_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      name: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      description: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      duration_minutes: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      isactive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: "services",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  )
}
