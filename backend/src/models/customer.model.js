export default function CustomerModel(sequelize, DataTypes) {
  const Customer = sequelize.define(
    "Customer",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      middle_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country_phone_code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email_verified_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      is_email_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      email_otp: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phone_verified_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      phone_otp: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      fcm_token: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      isactive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: "customers",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      defaultScope: {
        attributes: {
          exclude: ["password", "email_otp", "phone_otp"],
        },
      },
      scopes: {
        withPassword: {
          attributes: {
            include: ["password", "email_otp", "phone_otp"],
          },
        },
      },
    }
  );

  Customer.prototype.toSafeJSON = function toSafeJSON() {
    const values = { ...this.get({ plain: true }) };
    delete values.password;
    delete values.email_otp;
    delete values.phone_otp;

    return values;
  };

  return Customer;
}
