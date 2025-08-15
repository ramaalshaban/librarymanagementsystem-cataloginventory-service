# Service Design Specification - Object Design for branch

**librarymanagementsystem-cataloginventory-service** documentation

## Document Overview

This document outlines the object design for the `branch` model in our application. It includes details about the model's attributes, relationships, and any specific validation or business logic that applies.

## branch Data Object

### Object Overview

**Description:** Represents a physical library branch for catalog holdings: names, contact details, and geocoordinates for geospatial/proximity queries.

This object represents a core data structure within the service and acts as the blueprint for database interaction, API generation, and business logic enforcement.
It is defined using the `ObjectSettings` pattern, which governs its behavior, access control, caching strategy, and integration points with other systems such as Stripe and Redis.

### Core Configuration

- **Soft Delete:** Enabled — Determines whether records are marked inactive (`isActive = false`) instead of being physically deleted.
- **Public Access:** Yes — If enabled, anonymous users may access this object’s data depending on route-level rules.

### Composite Indexes

- **branch_name_addr_idx**: [name]
  This composite index is defined to optimize query performance for complex queries involving multiple fields.

The index also defines a conflict resolution strategy for duplicate key violations.

When a new record would violate this composite index, the following action will be taken:

**On Duplicate**: `throwError`

An error will be thrown, preventing the insertion of conflicting data.

### Properties Schema

| Property       | Type   | Required | Description                                                        |
| -------------- | ------ | -------- | ------------------------------------------------------------------ |
| `name`         | String | Yes      | The common name of the library branch.                             |
| `address`      | Object | No       | Branch postal address object (street, city, zip, etc).             |
| `geoLocation`  | Object | No       | GeoJSON Point for branch location (for spatial/proximity queries). |
| `contactEmail` | String | No       | Branch or staff contact email for inquiries.                       |

- Required properties are mandatory for creating objects and must be provided in the request body if no default value is set.

### Auto Update Properties

`name` `address` `geoLocation` `contactEmail`

An update crud route created with the option `Auto Params` enabled will automatically update these properties with the provided values in the request body.
If you want to update any property in your own business logic not by user input, you can set the `Allow Auto Update` option to false.
These properties will be added to the update route's body parameters and can be updated by the user if any value is provided in the request body.

### Elastic Search Indexing

`name` `address`

Properties that are indexed in Elastic Search will be searchable via the Elastic Search API.
While all properties are stored in the elastic search index of the data object, only those marked for Elastic Search indexing will be available for search queries.

### Database Indexing

`name` `geoLocation`

Properties that are indexed in the database will be optimized for query performance, allowing for faster data retrieval.
Make a property indexed in the database if you want to use it frequently in query filters or sorting.

### Filter Properties

`name`

Filter properties are used to define parameters that can be used in query filters, allowing for dynamic data retrieval based on user input or predefined criteria.
These properties are automatically mapped as route parameters in the listing CRUD routes that have "Auto Params" enabled.

- **name**: String has a filter named `name`
