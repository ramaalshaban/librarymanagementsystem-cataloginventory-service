const { sequelize } = require("common");
const { DataTypes } = require("sequelize");

//Represents a physical library branch for catalog holdings: names, contact details, and geocoordinates for geospatial/proximity queries.
const Branch = sequelize.define(
  "branch",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    name: {
      // The common name of the library branch.
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      // Branch postal address object (street, city, zip, etc).
      type: DataTypes.JSONB,
      allowNull: true,
    },
    geoLocation: {
      // GeoJSON Point for branch location (for spatial/proximity queries).
      type: DataTypes.JSONB,
      allowNull: true,
    },
    contactEmail: {
      // Branch or staff contact email for inquiries.
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
        fields: ["name"],
      },
      {
        unique: false,
        fields: ["geoLocation"],
      },

      {
        unique: true,
        fields: ["name"],
        where: { isActive: true },
      },
    ],
  },
);

module.exports = Branch;
