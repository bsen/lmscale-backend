const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Instruction extends Model {}

Instruction.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    agentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Agents",
        key: "id",
      },
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "Instruction",
    paranoid: true,
    timestamps: true,
    indexes: [
      {
        fields: ["agentId"],
      },
    ],
  }
);

module.exports = Instruction;
