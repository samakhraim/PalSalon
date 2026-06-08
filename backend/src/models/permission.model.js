export default function PermissionModel(sequelize, DataTypes) {
  return sequelize.define(
    "Permission",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      guardName: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "api",
      },
    },
    {
      tableName: "permissions",
      timestamps: true,
    }
  )
}
