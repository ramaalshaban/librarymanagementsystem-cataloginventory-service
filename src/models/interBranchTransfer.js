const { mongoose } = require("common");
const { Schema } = mongoose;
const interbranchtransferSchema = new mongoose.Schema(
  {
    bookId: {
      type: String,
      required: true,
    },
    sourceBranchId: {
      type: String,
      required: true,
    },
    destBranchId: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      defaultValue: 1,
    },
    requestedByUserId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      defaultValue: "requested",
    },
    transferLog: {
      type: [Schema.Types.Mixed],
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

interbranchtransferSchema.set("versionKey", "recordVersion");
interbranchtransferSchema.set("timestamps", true);

interbranchtransferSchema.set("toObject", { virtuals: true });
interbranchtransferSchema.set("toJSON", { virtuals: true });

module.exports = interbranchtransferSchema;
