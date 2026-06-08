export default function UserPermissionModel(sequelize, DataTypes) {
  return sequelize.define(
    "UserPermission",
    {
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
      },
      permissionId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      tableName: "user_permissions",
      timestamps: false,
    }
  )
}
