export default function CategoryModel(sequelize, DataTypes) {
  return sequelize.define(
    "Category",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      description: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      isactive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: "categories",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  )
}
