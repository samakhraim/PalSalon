export default function UserRoleModel(sequelize, DataTypes) {
  return sequelize.define(
    "UserRole",
    {
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
      },
      roleId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      tableName: "user_roles",
      timestamps: false,
    }
  )
}
