const { sequelize } = require("common");
const { DataTypes } = require("sequelize");

//Represents a branch purchase/acquisition request for new catalog items; includes items requested, status, and approval/fulfillment workflow.
const PurchaseOrder = sequelize.define(
  "purchaseOrder",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    branchId: {
      // Branch from which this purchase order was created/requested.
      type: DataTypes.UUID,
      allowNull: false,
    },
    requestedByUserId: {
      // User/staff who created purchase order.
      type: DataTypes.UUID,
      allowNull: false,
    },
    itemRequests: {
      // Requested book (by ID/isbn/title) and quantity (array of objects: {bookId, isbn, title, requestedQuantity})
      type: DataTypes.ARRAY(DataTypes.JSONB),
      allowNull: false,
    },
    status: {
      // Order workflow status (requested, approved, rejected, fulfilled, canceled).
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "requested",
    },
    approvalNotes: {
      // Branch manager (or admin) notes on decision, update trail, rejection reasons, etc.
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
        fields: ["branchId"],
      },
      {
        unique: false,
        fields: ["status"],
      },

      {
        unique: true,
        fields: ["branchId", "status"],
        where: { isActive: true },
      },
    ],
  },
);

module.exports = PurchaseOrder;
