const { mongoose } = require("common");
const { Schema } = mongoose;
const inventoryauditlogSchema = new mongoose.Schema(
  {
    branchId: {
      type: String,
      required: true,
    },
    branchInventoryId: {
      type: String,
      required: true,
    },
    auditType: {
      type: String,
      required: true,
      defaultValue: "audit",
    },
    detailNote: {
      type: String,
      required: false,
    },
    adjustmentValue: {
      type: Number,
      required: false,
      defaultValue: 0,
    },
    recordedByUserId: {
      type: String,
      required: true,
    },
    isActive: {
      // isActive property will be set to false when deleted
      // so that the document will be archived
      type: Boolean,
      default: true,
      required: false,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
      },
    },
  },
);

inventoryauditlogSchema.set("versionKey", "recordVersion");
inventoryauditlogSchema.set("timestamps", true);

inventoryauditlogSchema.set("toObject", { virtuals: true });
inventoryauditlogSchema.set("toJSON", { virtuals: true });

module.exports = inventoryauditlogSchema;
