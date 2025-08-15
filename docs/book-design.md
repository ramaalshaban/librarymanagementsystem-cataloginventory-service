# Service Design Specification - Object Design for book

**librarymanagementsystem-cataloginventory-service** documentation

## Document Overview

This document outlines the object design for the `book` model in our application. It includes details about the model's attributes, relationships, and any specific validation or business logic that applies.

## book Data Object

### Object Overview

**Description:** Master catalog record for a book or multi-copy item; includes bibliographic metadata, ISBN, authors, genres, full-text and geospatial search fields.

This object represents a core data structure within the service and acts as the blueprint for database interaction, API generation, and business logic enforcement.
It is defined using the `ObjectSettings` pattern, which governs its behavior, access control, caching strategy, and integration points with other systems such as Stripe and Redis.

### Core Configuration

- **Soft Delete:** Enabled — Determines whether records are marked inactive (`isActive = false`) instead of being physically deleted.
- **Public Access:** Yes — If enabled, anonymous users may access this object’s data depending on route-level rules.

### Composite Indexes

- **title_fulltext_idx**: [title]
  This composite index is defined to optimize query performance for complex queries involving multiple fields.

The index also defines a conflict resolution strategy for duplicate key violations.

When a new record would violate this composite index, the following action will be taken:

**On Duplicate**: `throwError`

An error will be thrown, preventing the insertion of conflicting data.

- **isbn_unique_idx**: [isbn]
  This composite index is defined to optimize query performance for complex queries involving multiple fields.

The index also defines a conflict resolution strategy for duplicate key violations.

When a new record would violate this composite index, the following action will be taken:

**On Duplicate**: `throwError`

An error will be thrown, preventing the insertion of conflicting data.

### Properties Schema

| Property          | Type   | Required | Description                                                                          |
| ----------------- | ------ | -------- | ------------------------------------------------------------------------------------ |
| `title`           | String | Yes      | The canonical title of the book/work.                                                |
| `authors`         | String | Yes      | List of authors (for multi-author works, in order as credited).                      |
| `isbn`            | String | No       | International Standard Book Number (ISBN-10 or ISBN-13).                             |
| `synopsis`        | Text   | No       | Short/long description or synopsis of the book.                                      |
| `genres`          | String | No       | Genres/categories assigned to the book (e.g. Fiction, Science, Children, Biography). |
| `publicationDate` | Date   | No       | Publication date (first edition or this edition).                                    |
| `language`        | String | No       | Primary language of the book.                                                        |
| `publisher`       | String | No       | Publisher of the edition.                                                            |
| `coverImageUrl`   | String | No       | Optional cover image URL for the book.                                               |

- Required properties are mandatory for creating objects and must be provided in the request body if no default value is set.

### Array Properties

`authors` `genres`

Array properties can hold multiple values and are indicated by the `[]` suffix in their type. Avoid using arrays in properties that are used for relations, as they will not work correctly.
Note that using connection objects instead of arrays is recommended for relations, as they provide better performance and flexibility.

### Default Values

Default values are automatically assigned to properties when a new object is created, if no value is provided in the request body.
Since default values are applied on db level, they should be literal values, not expressions.If you want to use expressions, you can use transposed parameters in any crud route to set default values dynamically.

- **language**: English

### Auto Update Properties

`title` `authors` `isbn` `synopsis` `genres` `publicationDate` `language` `publisher` `coverImageUrl`

An update crud route created with the option `Auto Params` enabled will automatically update these properties with the provided values in the request body.
If you want to update any property in your own business logic not by user input, you can set the `Allow Auto Update` option to false.
These properties will be added to the update route's body parameters and can be updated by the user if any value is provided in the request body.

### Elastic Search Indexing

`title` `authors` `isbn` `synopsis` `genres` `language`

Properties that are indexed in Elastic Search will be searchable via the Elastic Search API.
While all properties are stored in the elastic search index of the data object, only those marked for Elastic Search indexing will be available for search queries.

### Database Indexing

`title` `isbn` `genres` `publicationDate`

Properties that are indexed in the database will be optimized for query performance, allowing for faster data retrieval.
Make a property indexed in the database if you want to use it frequently in query filters or sorting.

### Unique Properties

`isbn`

Unique properties are enforced to have distinct values across all instances of the data object, preventing duplicate entries.
Note that a unique property is automatically indexed in the database so you will not need to set the `Indexed in DB` option.

### Secondary Key Properties

`isbn`

Secondary key properties are used to create an additional indexed identifiers for the data object, allowing for alternative access patterns.
Different than normal indexed properties, secondary keys will act as primary keys and Mindbricks will provide automatic secondary key db utility functions to access the data object by the secondary key.

### Filter Properties

`title` `authors` `isbn` `genres` `publicationDate` `language` `publisher`

Filter properties are used to define parameters that can be used in query filters, allowing for dynamic data retrieval based on user input or predefined criteria.
These properties are automatically mapped as route parameters in the listing CRUD routes that have "Auto Params" enabled.

- **title**: String has a filter named `title`

- **authors**: String has a filter named `authors`

- **isbn**: String has a filter named `isbn`

- **genres**: String has a filter named `genres`

- **publicationDate**: Date has a filter named `publicationDate`

- **language**: String has a filter named `language`

- **publisher**: String has a filter named `publisher`
