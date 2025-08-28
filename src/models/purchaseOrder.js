const { mongoose } = require("common");
const { Schema } = mongoose;
const purchaseorderSchema = new mongoose.Schema(
  {
    branchId: {
      type: String,
      required: true,
    },
    requestedByUserId: {
      type: String,
      required: true,
    },
    itemRequests: {
      type: [Schema.Types.Mixed],
      required: true,
    },
    status: {
      type: String,
      required: true,
      defaultValue: "requested",
    },
    approvalNotes: {
      type: String,
      required: false,
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

purchaseorderSchema.set("versionKey", "recordVersion");
purchaseorderSchema.set("timestamps", true);

purchaseorderSchema.set("toObject", { virtuals: true });
purchaseorderSchema.set("toJSON", { virtuals: true });

module.exports = purchaseorderSchema;
