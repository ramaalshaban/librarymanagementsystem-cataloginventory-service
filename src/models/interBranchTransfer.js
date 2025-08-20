const { sequelize } = require("common");
const { DataTypes } = require("sequelize");

//Tracks in-progress or completed inter-branch transfers of books/materials, including statuses, movement, who requested, and fulfillment actions.
const InterBranchTransfer = sequelize.define(
  "interBranchTransfer",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    bookId: {
      // Book to transfer (master catalog id).
      type: DataTypes.UUID,
      allowNull: false,
    },
    sourceBranchId: {
      // Branch from which book is sent.
      type: DataTypes.UUID,
      allowNull: false,
    },
    destBranchId: {
      // Branch receiving the transfer.
      type: DataTypes.UUID,
      allowNull: false,
    },
    quantity: {
      // Number of copies to transfer.
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    requestedByUserId: {
      // User (staff) who requested the transfer.
      type: DataTypes.UUID,
      allowNull: false,
    },
    status: {
      // Status (requested, approved, inTransit, completed, rejected, canceled).
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "requested",
    },
    transferLog: {
      // Log array (timestamp, action, userId, note) for steps in the transfer workflow.
      type: DataTypes.ARRAY(DataTypes.JSONB),
      allowNull: true,
    },
    isActive: {
      // isActive property will be set to false when deleted
      // so that the document will be archived
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: true,
    },
  },
  {
    indexes: [
      {
        unique: false,
        fields: ["bookId"],
      },
      {
        unique: false,
        fields: ["sourceBranchId"],
      },
      {
        unique: false,
        fields: ["destBranchId"],
      },
      {
        unique: false,
        fields: ["status"],
      },

      {
        unique: true,
        fields: ["sourceBranchId", "destBranchId", "bookId"],
        where: { isActive: true },
      },
    ],
  },
);

module.exports = InterBranchTransfer;
