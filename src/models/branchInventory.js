const { mongoose } = require("common");
const { Schema } = mongoose;
const branchinventorySchema = new mongoose.Schema(
  {
    bookId: {
      type: String,
      required: true,
    },
    branchId: {
      type: String,
      required: true,
    },
    totalCopies: {
      type: Number,
      required: true,
      defaultValue: 1,
    },
    availableCopies: {
      type: Number,
      required: true,
      defaultValue: 1,
    },
    localShelfLocation: {
      type: String,
      required: false,
    },
    conditionNotes: {
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

branchinventorySchema.set("versionKey", "recordVersion");
branchinventorySchema.set("timestamps", true);

branchinventorySchema.set("toObject", { virtuals: true });
branchinventorySchema.set("toJSON", { virtuals: true });

module.exports = branchinventorySchema;
