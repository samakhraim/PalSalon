export default function IntroModel(sequelize, DataTypes) {
  return sequelize.define(
    "Intro",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      description: {
        type: DataTypes.JSON,
        allowNull: false,
      },
    },
    {
      tableName: "intros",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  )
}
