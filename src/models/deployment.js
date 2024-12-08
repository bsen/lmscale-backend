const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Deployment extends Model {}

Deployment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    modelId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Models",
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM("pending", "running", "stopped", "failed"),
      allowNull: false,
      defaultValue: "pending",
    },
    config: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Deployment",
    paranoid: true,
    timestamps: true,
  }
);

module.exports = Deployment;
