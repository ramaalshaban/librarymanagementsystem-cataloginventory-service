const { sequelize } = require("common");
const { DataTypes } = require("sequelize");

//Master catalog record for a book or multi-copy item; includes bibliographic metadata, ISBN, authors, genres, full-text and geospatial search fields.
const Book = sequelize.define(
  "book",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    title: {
      // The canonical title of the book/work.
      type: DataTypes.STRING,
      allowNull: false,
    },
    authors: {
      // List of authors (for multi-author works, in order as credited).
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    isbn: {
      // International Standard Book Number (ISBN-10 or ISBN-13).
      type: DataTypes.STRING,
      allowNull: true,
    },
    synopsis: {
      // Short/long description or synopsis of the book.
      type: DataTypes.TEXT,
      allowNull: true,
    },
    genres: {
      // Genres/categories assigned to the book (e.g. Fiction, Science, Children, Biography).
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    publicationDate: {
      // Publication date (first edition or this edition).
      type: DataTypes.DATE,
      allowNull: true,
    },
    language: {
      // Primary language of the book.
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "English",
    },
    publisher: {
      // Publisher of the edition.
      type: DataTypes.STRING,
      allowNull: true,
    },
    coverImageUrl: {
      // Optional cover image URL for the book.
      type: DataTypes.STRING,
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
        fields: ["title"],
      },
      {
        unique: false,
        fields: ["publicationDate"],
      },

      {
        unique: true,
        fields: ["title"],
        where: { isActive: true },
      },
      {
        unique: true,
        fields: ["isbn"],
        where: { isActive: true },
      },
    ],
  },
);

module.exports = Book;
