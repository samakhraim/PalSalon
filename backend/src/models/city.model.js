export default function CityModel(sequelize, DataTypes) {
  return sequelize.define(
    "City",
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
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: "cities",
      timestamps: true,
    }
  )
}
