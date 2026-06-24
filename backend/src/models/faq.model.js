export default function FaqModel(sequelize, DataTypes) {
  return sequelize.define(
    "Faq",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      question: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      answer: {
        type: DataTypes.JSON,
        allowNull: false,
      },
    },
    {
      tableName: "faqs",
      timestamps: true,
    }
  )
}
