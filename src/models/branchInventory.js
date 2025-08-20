const { sequelize } = require("common");
const { DataTypes } = require("sequelize");

//Links a book with a branch; tracks quantity, availability, local shelf/copy/serial identifiers, and overall condition for per-branch inventory.
const BranchInventory = sequelize.define(
  "branchInventory",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    bookId: {
      // Foreign key to book.
      type: DataTypes.UUID,
      allowNull: false,
    },
    branchId: {
      // Foreign key to branch.
      type: DataTypes.UUID,
      allowNull: false,
    },
    totalCopies: {
      // Total number of copies held at this branch.
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    availableCopies: {
      // Number of un-lent, available copies at this branch.
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    localShelfLocation: {
      // Shelf, area, or local ID for physical asset at branch.
      type: DataTypes.STRING,
      allowNull: true,
    },
    conditionNotes: {
      // Notes on general condition or issues for this holding.
      type: DataTypes.TEXT,
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
        fields: ["branchId"],
      },

      {
        unique: true,
        fields: ["branchId", "bookId"],
        where: { isActive: true },
      },
    ],
  },
);

module.exports = BranchInventory;
