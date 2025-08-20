const { mongoose } = require("common");
const { Schema } = mongoose;
const branchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: Schema.Types.Mixed,
      required: false,
    },
    geoLocation: {
      type: Schema.Types.Mixed,
      required: false,
    },
    contactEmail: {
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

branchSchema.set("versionKey", "recordVersion");
branchSchema.set("timestamps", true);

branchSchema.set("toObject", { virtuals: true });
branchSchema.set("toJSON", { virtuals: true });

module.exports = branchSchema;
