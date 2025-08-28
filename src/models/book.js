const { mongoose } = require("common");
const { Schema } = mongoose;
const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    authors: {
      type: [String],
      required: true,
    },
    isbn: {
      type: String,
      required: false,
      unique: true,
    },
    synopsis: {
      type: String,
      required: false,
    },
    genres: {
      type: [String],
      required: false,
    },
    publicationDate: {
      type: Date,
      required: false,
    },
    language: {
      type: String,
      required: false,
      defaultValue: "English",
    },
    publisher: {
      type: String,
      required: false,
    },
    coverImageUrl: {
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

bookSchema.set("versionKey", "recordVersion");
bookSchema.set("timestamps", true);

bookSchema.set("toObject", { virtuals: true });
bookSchema.set("toJSON", { virtuals: true });

module.exports = bookSchema;
