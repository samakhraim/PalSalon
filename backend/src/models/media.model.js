export default function MediaModel(sequelize, DataTypes) {
  return sequelize.define(
    "Media",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      modelType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      modelId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      collectionName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fileName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      originalName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mimeType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      size: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      disk: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "local",
      },
      path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      conversions: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      tableName: "media",
      timestamps: true,
    }
  )
}
