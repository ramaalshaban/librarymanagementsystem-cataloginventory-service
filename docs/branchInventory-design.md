# Service Design Specification - Object Design for branchInventory

**librarymanagementsystem-cataloginventory-service** documentation

## Document Overview

This document outlines the object design for the `branchInventory` model in our application. It includes details about the model's attributes, relationships, and any specific validation or business logic that applies.

## branchInventory Data Object

### Object Overview

**Description:** Links a book with a branch; tracks quantity, availability, local shelf/copy/serial identifiers, and overall condition for per-branch inventory.

This object represents a core data structure within the service and acts as the blueprint for database interaction, API generation, and business logic enforcement.
It is defined using the `ObjectSettings` pattern, which governs its behavior, access control, caching strategy, and integration points with other systems such as Stripe and Redis.

### Core Configuration

- **Soft Delete:** Enabled — Determines whether records are marked inactive (`isActive = false`) instead of being physically deleted.
- **Public Access:** Yes — If enabled, anonymous users may access this object’s data depending on route-level rules.

### Composite Indexes

- **branch_book_unique_idx**: [branchId, bookId]
  This composite index is defined to optimize query performance for complex queries involving multiple fields.

The index also defines a conflict resolution strategy for duplicate key violations.

When a new record would violate this composite index, the following action will be taken:

**On Duplicate**: `throwError`

An error will be thrown, preventing the insertion of conflicting data.

### Properties Schema

| Property             | Type    | Required | Description                                            |
| -------------------- | ------- | -------- | ------------------------------------------------------ |
| `bookId`             | ID      | Yes      | Foreign key to book.                                   |
| `branchId`           | ID      | Yes      | Foreign key to branch.                                 |
| `totalCopies`        | Integer | Yes      | Total number of copies held at this branch.            |
| `availableCopies`    | Integer | Yes      | Number of un-lent, available copies at this branch.    |
| `localShelfLocation` | String  | No       | Shelf, area, or local ID for physical asset at branch. |
| `conditionNotes`     | Text    | No       | Notes on general condition or issues for this holding. |

- Required properties are mandatory for creating objects and must be provided in the request body if no default value is set.

### Default Values

Default values are automatically assigned to properties when a new object is created, if no value is provided in the request body.
Since default values are applied on db level, they should be literal values, not expressions.If you want to use expressions, you can use transposed parameters in any crud route to set default values dynamically.

- **totalCopies**: 1
- **availableCopies**: 1

### Constant Properties

`bookId` `branchId`

Constant properties are defined to be immutable after creation, meaning they cannot be updated or changed once set. They are typically used for properties that should remain constant throughout the object's lifecycle.
A property is set to be constant if the `Allow Update` option is set to `false`.

### Auto Update Properties

`totalCopies` `availableCopies` `localShelfLocation` `conditionNotes`

An update crud route created with the option `Auto Params` enabled will automatically update these properties with the provided values in the request body.
If you want to update any property in your own business logic not by user input, you can set the `Allow Auto Update` option to false.
These properties will be added to the update route's body parameters and can be updated by the user if any value is provided in the request body.

### Elastic Search Indexing

`bookId` `branchId`

Properties that are indexed in Elastic Search will be searchable via the Elastic Search API.
While all properties are stored in the elastic search index of the data object, only those marked for Elastic Search indexing will be available for search queries.

### Database Indexing

`bookId` `branchId`

Properties that are indexed in the database will be optimized for query performance, allowing for faster data retrieval.
Make a property indexed in the database if you want to use it frequently in query filters or sorting.

### Relation Properties

`bookId` `branchId`

Mindbricks supports relations between data objects, allowing you to define how objects are linked together.
You can define relations in the data object properties, which will be used to create foreign key constraints in the database.
For complex joins operations, Mindbricks supportsa BFF pattern, where you can view dynamic and static views based on Elastic Search Indexes.
Use db level relations for simple one-to-one or one-to-many relationships, and use BFF views for complex joins that require multiple data objects to be joined together.

- **bookId**: ID
  Relation to `book`.id

The target object is a parent object, meaning that the relation is a one-to-many relationship from target to this object.

On Delete: Set Null
Required: Yes

- **branchId**: ID
  Relation to `branch`.id

The target object is a parent object, meaning that the relation is a one-to-many relationship from target to this object.

On Delete: Set Null
Required: Yes

### Filter Properties

`bookId` `branchId`

Filter properties are used to define parameters that can be used in query filters, allowing for dynamic data retrieval based on user input or predefined criteria.
These properties are automatically mapped as route parameters in the listing CRUD routes that have "Auto Params" enabled.

- **bookId**: ID has a filter named `bookId`

- **branchId**: ID has a filter named `branchId`
