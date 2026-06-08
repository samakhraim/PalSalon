export default function RolePermissionModel(sequelize, DataTypes) {
  return sequelize.define(
    "RolePermission",
    {
      roleId: {
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
      tableName: "role_permissions",
      timestamps: false,
    }
  )
}
