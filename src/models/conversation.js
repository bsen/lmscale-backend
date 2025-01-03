const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Conversation extends Model {}

Conversation.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    agentId: {
      type: DataTypes.UUID,
      allowNull: true,
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
    lastMessageAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "Conversation",
    paranoid: true,
    timestamps: true,
    indexes: [
      {
        fields: ["agentId"],
      },
      {
        fields: ["lastMessageAt"],
      },
    ],
  }
);

module.exports = Conversation;
