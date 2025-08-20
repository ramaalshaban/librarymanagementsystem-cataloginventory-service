const { sequelize } = require("common");
const { DataTypes } = require("sequelize");

//Log/audit entries of inventory audits, discrepancy findings, loss/damage/adjustment events during branch stock checks.
const InventoryAuditLog = sequelize.define(
  "inventoryAuditLog",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    branchId: {
      // Branch where audit/adjustment occurs.
      type: DataTypes.UUID,
      allowNull: false,
    },
    branchInventoryId: {
      // Inventory record at branch for this adjustment/event.
      type: DataTypes.UUID,
      allowNull: false,
    },
    auditType: {
      // Type of audit or adjustment: inventory, damage, loss, etc.
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "audit",
    },
    detailNote: {
      // Notes/details for this audit/discrepancy entry (explanation, corrective action, etc).
      type: DataTypes.TEXT,
      allowNull: true,
    },
    adjustmentValue: {
      // Adjustment: +n/-n to available copies (for missing, found, disposed books).
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    recordedByUserId: {
      // User (staff) who recorded this audit entry.
      type: DataTypes.UUID,
      allowNull: false,
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
        fields: ["branchInventoryId"],
      },

      {
        unique: true,
        fields: ["branchId", "branchInventoryId"],
        where: { isActive: true },
      },
    ],
  },
);

module.exports = InventoryAuditLog;
