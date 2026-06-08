export default function RoleModel(sequelize, DataTypes) {
  return sequelize.define(
    "Role",
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
      tableName: "roles",
      timestamps: true,
    }
  )
}
