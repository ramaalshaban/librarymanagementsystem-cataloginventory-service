# EVENT GUIDE

## librarymanagementsystem-cataloginventory-service

Manages the master book catalog, detailed metadata, per-branch inventory, advanced searching, inventory audits, inter-branch transfers, and collection purchasing workflows for a multi-branch library network..

## Architectural Design Credit and Contact Information

The architectural design of this microservice is credited to . For inquiries, feedback, or further information regarding the architecture, please direct your communication to:

Email:

We encourage open communication and welcome any questions or discussions related to the architectural aspects of this microservice.

# Documentation Scope

Welcome to the official documentation for the `CatalogInventory` Service Event descriptions. This guide is dedicated to detailing how to subscribe to and listen for state changes within the `CatalogInventory` Service, offering an exclusive focus on event subscription mechanisms.

**Intended Audience**

This documentation is aimed at developers and integrators looking to monitor `CatalogInventory` Service state changes. It is especially relevant for those wishing to implement or enhance business logic based on interactions with `CatalogInventory` objects.

**Overview**

This section provides detailed instructions on monitoring service events, covering payload structures and demonstrating typical use cases through examples.

# Authentication and Authorization

Access to the `CatalogInventory` service's events is facilitated through the project's Kafka server, which is not accessible to the public. Subscription to a Kafka topic requires being on the same network and possessing valid Kafka user credentials. This document presupposes that readers have existing access to the Kafka server.

Additionally, the service offers a public subscription option via REST for real-time data management in frontend applications, secured through REST API authentication and authorization mechanisms. To subscribe to service events via the REST API, please consult the Realtime REST API Guide.

# Database Events

Database events are triggered at the database layer, automatically and atomically, in response to any modifications at the data level. These events serve to notify subscribers about the creation, update, or deletion of objects within the database, distinct from any overarching business logic.

Listening to database events is particularly beneficial for those focused on tracking changes at the database level. A typical use case for subscribing to database events is to replicate the data store of one service within another service's scope, ensuring data consistency and syncronization across services.

For example, while a business operation such as "approve membership" might generate a high-level business event like `membership-approved`, the underlying database changes could involve multiple state updates to different entities. These might be published as separate events, such as `dbevent-member-updated` and `dbevent-user-updated`, reflecting the granular changes at the database level.

Such detailed eventing provides a robust foundation for building responsive, data-driven applications, enabling fine-grained observability and reaction to the dynamics of the data landscape. It also facilitates the architectural pattern of event sourcing, where state changes are captured as a sequence of events, allowing for high-fidelity data replication and history replay for analytical or auditing purposes.

## DbEvent book-created

**Event topic**: `librarymanagementsystem-cataloginventory-service-dbevent-book-created`

This event is triggered upon the creation of a `book` data object in the database. The event payload encompasses the newly created data, encapsulated within the root of the paylod.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "title": "String",
  "authors": "String",
  "isbn": "String",
  "synopsis": "Text",
  "genres": "String",
  "publicationDate": "Date",
  "language": "String",
  "publisher": "String",
  "coverImageUrl": "String",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent book-updated

**Event topic**: `librarymanagementsystem-cataloginventory-service-dbevent-book-updated`

Activation of this event follows the update of a `book` data object. The payload contains the updated information under the `book` attribute, along with the original data prior to update, labeled as `old_book`.

**Event payload**:

```json
{
  "old_book": {
    "id": "ID",
    "_owner": "ID",
    "title": "String",
    "authors": "String",
    "isbn": "String",
    "synopsis": "Text",
    "genres": "String",
    "publicationDate": "Date",
    "language": "String",
    "publisher": "String",
    "coverImageUrl": "String",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  },
  "book": {
    "id": "ID",
    "_owner": "ID",
    "title": "String",
    "authors": "String",
    "isbn": "String",
    "synopsis": "Text",
    "genres": "String",
    "publicationDate": "Date",
    "language": "String",
    "publisher": "String",
    "coverImageUrl": "String",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  }
}
```

## DbEvent book-deleted

**Event topic**: `librarymanagementsystem-cataloginventory-service-dbevent-book-deleted`

This event announces the deletion of a `book` data object, covering both hard deletions (permanent removal) and soft deletions (where the `isActive` attribute is set to false). Regardless of the deletion type, the event payload will present the data as it was immediately before deletion, highlighting an `isActive` status of false for soft deletions.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "title": "String",
  "authors": "String",
  "isbn": "String",
  "synopsis": "Text",
  "genres": "String",
  "publicationDate": "Date",
  "language": "String",
  "publisher": "String",
  "coverImageUrl": "String",
  "isActive": false,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent branch-created

**Event topic**: `librarymanagementsystem-cataloginventory-service-dbevent-branch-created`

This event is triggered upon the creation of a `branch` data object in the database. The event payload encompasses the newly created data, encapsulated within the root of the paylod.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "name": "String",
  "address": "Object",
  "geoLocation": "Object",
  "contactEmail": "String",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent branch-updated

**Event topic**: `librarymanagementsystem-cataloginventory-service-dbevent-branch-updated`

Activation of this event follows the update of a `branch` data object. The payload contains the updated information under the `branch` attribute, along with the original data prior to update, labeled as `old_branch`.

**Event payload**:

```json
{
  "old_branch": {
    "id": "ID",
    "_owner": "ID",
    "name": "String",
    "address": "Object",
    "geoLocation": "Object",
    "contactEmail": "String",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  },
  "branch": {
    "id": "ID",
    "_owner": "ID",
    "name": "String",
    "address": "Object",
    "geoLocation": "Object",
    "contactEmail": "String",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  }
}
```

## DbEvent branch-deleted

**Event topic**: `librarymanagementsystem-cataloginventory-service-dbevent-branch-deleted`

This event announces the deletion of a `branch` data object, covering both hard deletions (permanent removal) and soft deletions (where the `isActive` attribute is set to false). Regardless of the deletion type, the event payload will present the data as it was immediately before deletion, highlighting an `isActive` status of false for soft deletions.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "name": "String",
  "address": "Object",
  "geoLocation": "Object",
  "contactEmail": "String",
  "isActive": false,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent branchInventory-created

**Event topic**: `librarymanagementsystem-cataloginventory-service-dbevent-branchinventory-created`

This event is triggered upon the creation of a `branchInventory` data object in the database. The event payload encompasses the newly created data, encapsulated within the root of the paylod.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "bookId": "ID",
  "branchId": "ID",
  "totalCopies": "Integer",
  "availableCopies": "Integer",
  "localShelfLocation": "String",
  "conditionNotes": "Text",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent branchInventory-updated

**Event topic**: `librarymanagementsystem-cataloginventory-service-dbevent-branchinventory-updated`

Activation of this event follows the update of a `branchInventory` data object. The payload contains the updated information under the `branchInventory` attribute, along with the original data prior to update, labeled as `old_branchInventory`.

**Event payload**:

```json
{
  "old_branchInventory": {
    "id": "ID",
    "_owner": "ID",
    "bookId": "ID",
    "branchId": "ID",
    "totalCopies": "Integer",
    "availableCopies": "Integer",
    "localShelfLocation": "String",
    "conditionNotes": "Text",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  },
  "branchInventory": {
    "id": "ID",
    "_owner": "ID",
    "bookId": "ID",
    "branchId": "ID",
    "totalCopies": "Integer",
    "availableCopies": "Integer",
    "localShelfLocation": "String",
    "conditionNotes": "Text",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  }
}
```

## DbEvent branchInventory-deleted

**Event topic**: `librarymanagementsystem-cataloginventory-service-dbevent-branchinventory-deleted`

This event announces the deletion of a `branchInventory` data object, covering both hard deletions (permanent removal) and soft deletions (where the `isActive` attribute is set to false). Regardless of the deletion type, the event payload will present the data as it was immediately before deletion, highlighting an `isActive` status of false for soft deletions.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "bookId": "ID",
  "branchId": "ID",
  "totalCopies": "Integer",
  "availableCopies": "Integer",
  "localShelfLocation": "String",
  "conditionNotes": "Text",
  "isActive": false,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent inventoryAuditLog-created

**Event topic**: `librarymanagementsystem-cataloginventory-service-dbevent-inventoryauditlog-created`

This event is triggered upon the creation of a `inventoryAuditLog` data object in the database. The event payload encompasses the newly created data, encapsulated within the root of the paylod.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "branchId": "ID",
  "branchInventoryId": "ID",
  "auditType": "Enum",
  "auditType_": "String",
  "detailNote": "Text",
  "adjustmentValue": "Integer",
  "recordedByUserId": "ID",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent inventoryAuditLog-updated

**Event topic**: `librarymanagementsystem-cataloginventory-service-dbevent-inventoryauditlog-updated`

Activation of this event follows the update of a `inventoryAuditLog` data object. The payload contains the updated information under the `inventoryAuditLog` attribute, along with the original data prior to update, labeled as `old_inventoryAuditLog`.

**Event payload**:

```json
{
  "old_inventoryAuditLog": {
    "id": "ID",
    "_owner": "ID",
    "branchId": "ID",
    "branchInventoryId": "ID",
    "auditType": "Enum",
    "auditType_": "String",
    "detailNote": "Text",
    "adjustmentValue": "Integer",
    "recordedByUserId": "ID",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  },
  "inventoryAuditLog": {
    "id": "ID",
    "_owner": "ID",
    "branchId": "ID",
    "branchInventoryId": "ID",
    "auditType": "Enum",
    "auditType_": "String",
    "detailNote": "Text",
    "adjustmentValue": "Integer",
    "recordedByUserId": "ID",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  }
}
```

## DbEvent inventoryAuditLog-deleted

**Event topic**: `librarymanagementsystem-cataloginventory-service-dbevent-inventoryauditlog-deleted`

This event announces the deletion of a `inventoryAuditLog` data object, covering both hard deletions (permanent removal) and soft deletions (where the `isActive` attribute is set to false). Regardless of the deletion type, the event payload will present the data as it was immediately before deletion, highlighting an `isActive` status of false for soft deletions.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "branchId": "ID",
  "branchInventoryId": "ID",
  "auditType": "Enum",
  "auditType_": "String",
  "detailNote": "Text",
  "adjustmentValue": "Integer",
  "recordedByUserId": "ID",
  "isActive": false,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent interBranchTransfer-created

**Event topic**: `librarymanagementsystem-cataloginventory-service-dbevent-interbranchtransfer-created`

This event is triggered upon the creation of a `interBranchTransfer` data object in the database. The event payload encompasses the newly created data, encapsulated within the root of the paylod.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "bookId": "ID",
  "sourceBranchId": "ID",
  "destBranchId": "ID",
  "quantity": "Integer",
  "requestedByUserId": "ID",
  "status": "Enum",
  "status_": "String",
  "transferLog": "Object",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent interBranchTransfer-updated

**Event topic**: `librarymanagementsystem-cataloginventory-service-dbevent-interbranchtransfer-updated`

Activation of this event follows the update of a `interBranchTransfer` data object. The payload contains the updated information under the `interBranchTransfer` attribute, along with the original data prior to update, labeled as `old_interBranchTransfer`.

**Event payload**:

```json
{
  "old_interBranchTransfer": {
    "id": "ID",
    "_owner": "ID",
    "bookId": "ID",
    "sourceBranchId": "ID",
    "destBranchId": "ID",
    "quantity": "Integer",
    "requestedByUserId": "ID",
    "status": "Enum",
    "status_": "String",
    "transferLog": "Object",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  },
  "interBranchTransfer": {
    "id": "ID",
    "_owner": "ID",
    "bookId": "ID",
    "sourceBranchId": "ID",
    "destBranchId": "ID",
    "quantity": "Integer",
    "requestedByUserId": "ID",
    "status": "Enum",
    "status_": "String",
    "transferLog": "Object",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  }
}
```

## DbEvent interBranchTransfer-deleted

**Event topic**: `librarymanagementsystem-cataloginventory-service-dbevent-interbranchtransfer-deleted`

This event announces the deletion of a `interBranchTransfer` data object, covering both hard deletions (permanent removal) and soft deletions (where the `isActive` attribute is set to false). Regardless of the deletion type, the event payload will present the data as it was immediately before deletion, highlighting an `isActive` status of false for soft deletions.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "bookId": "ID",
  "sourceBranchId": "ID",
  "destBranchId": "ID",
  "quantity": "Integer",
  "requestedByUserId": "ID",
  "status": "Enum",
  "status_": "String",
  "transferLog": "Object",
  "isActive": false,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent purchaseOrder-created

**Event topic**: `librarymanagementsystem-cataloginventory-service-dbevent-purchaseorder-created`

This event is triggered upon the creation of a `purchaseOrder` data object in the database. The event payload encompasses the newly created data, encapsulated within the root of the paylod.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "branchId": "ID",
  "requestedByUserId": "ID",
  "itemRequests": "Object",
  "status": "Enum",
  "status_": "String",
  "approvalNotes": "Text",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent purchaseOrder-updated

**Event topic**: `librarymanagementsystem-cataloginventory-service-dbevent-purchaseorder-updated`

Activation of this event follows the update of a `purchaseOrder` data object. The payload contains the updated information under the `purchaseOrder` attribute, along with the original data prior to update, labeled as `old_purchaseOrder`.

**Event payload**:

```json
{
  "old_purchaseOrder": {
    "id": "ID",
    "_owner": "ID",
    "branchId": "ID",
    "requestedByUserId": "ID",
    "itemRequests": "Object",
    "status": "Enum",
    "status_": "String",
    "approvalNotes": "Text",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  },
  "purchaseOrder": {
    "id": "ID",
    "_owner": "ID",
    "branchId": "ID",
    "requestedByUserId": "ID",
    "itemRequests": "Object",
    "status": "Enum",
    "status_": "String",
    "approvalNotes": "Text",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  }
}
```

## DbEvent purchaseOrder-deleted

**Event topic**: `librarymanagementsystem-cataloginventory-service-dbevent-purchaseorder-deleted`

This event announces the deletion of a `purchaseOrder` data object, covering both hard deletions (permanent removal) and soft deletions (where the `isActive` attribute is set to false). Regardless of the deletion type, the event payload will present the data as it was immediately before deletion, highlighting an `isActive` status of false for soft deletions.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "branchId": "ID",
  "requestedByUserId": "ID",
  "itemRequests": "Object",
  "status": "Enum",
  "status_": "String",
  "approvalNotes": "Text",
  "isActive": false,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent catalogInventoryShareToken-created

**Event topic**: `librarymanagementsystem-cataloginventory-service-dbevent-cataloginventorysharetoken-created`

This event is triggered upon the creation of a `catalogInventoryShareToken` data object in the database. The event payload encompasses the newly created data, encapsulated within the root of the paylod.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "configName": "String",
  "objectName": "String",
  "objectId": "ID",
  "ownerId": "ID",
  "peopleOption": "String",
  "tokenPermissions": null,
  "allowedEmails": null,
  "expireDate": "Date",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent catalogInventoryShareToken-updated

**Event topic**: `librarymanagementsystem-cataloginventory-service-dbevent-cataloginventorysharetoken-updated`

Activation of this event follows the update of a `catalogInventoryShareToken` data object. The payload contains the updated information under the `catalogInventoryShareToken` attribute, along with the original data prior to update, labeled as `old_catalogInventoryShareToken`.

**Event payload**:

```json
{
  "old_catalogInventoryShareToken": {
    "id": "ID",
    "_owner": "ID",
    "configName": "String",
    "objectName": "String",
    "objectId": "ID",
    "ownerId": "ID",
    "peopleOption": "String",
    "tokenPermissions": null,
    "allowedEmails": null,
    "expireDate": "Date",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  },
  "catalogInventoryShareToken": {
    "id": "ID",
    "_owner": "ID",
    "configName": "String",
    "objectName": "String",
    "objectId": "ID",
    "ownerId": "ID",
    "peopleOption": "String",
    "tokenPermissions": null,
    "allowedEmails": null,
    "expireDate": "Date",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  }
}
```

## DbEvent catalogInventoryShareToken-deleted

**Event topic**: `librarymanagementsystem-cataloginventory-service-dbevent-cataloginventorysharetoken-deleted`

This event announces the deletion of a `catalogInventoryShareToken` data object, covering both hard deletions (permanent removal) and soft deletions (where the `isActive` attribute is set to false). Regardless of the deletion type, the event payload will present the data as it was immediately before deletion, highlighting an `isActive` status of false for soft deletions.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "configName": "String",
  "objectName": "String",
  "objectId": "ID",
  "ownerId": "ID",
  "peopleOption": "String",
  "tokenPermissions": null,
  "allowedEmails": null,
  "expireDate": "Date",
  "isActive": false,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

# ElasticSearch Index Events

Within the `CatalogInventory` service, most data objects are mirrored in ElasticSearch indices, ensuring these indices remain syncronized with their database counterparts through creation, updates, and deletions. These indices serve dual purposes: they act as a data source for external services and furnish aggregated data tailored to enhance frontend user experiences. Consequently, an ElasticSearch index might encapsulate data in its original form or aggregate additional information from other data objects.

These aggregations can include both one-to-one and one-to-many relationships not only with database objects within the same service but also across different services. This capability allows developers to access comprehensive, aggregated data efficiently. By subscribing to ElasticSearch index events, developers are notified when an index is updated and can directly obtain the aggregated entity within the event payload, bypassing the need for separate ElasticSearch queries.

It's noteworthy that some services may augment another service's index by appending to the entity’s `extends` object. In such scenarios, an `*-extended` event will contain only the newly added data. Should you require the complete dataset, you would need to retrieve the full ElasticSearch index entity using the provided ID.

This approach to indexing and event handling facilitates a modular, interconnected architecture where services can seamlessly integrate and react to changes, enriching the overall data ecosystem and enabling more dynamic, responsive applications.

## Index Event book-created

**Event topic**: `elastic-index-librarymanagementsystem_book-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "title": "String",
  "authors": "String",
  "isbn": "String",
  "synopsis": "Text",
  "genres": "String",
  "publicationDate": "Date",
  "language": "String",
  "publisher": "String",
  "coverImageUrl": "String",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event book-updated

**Event topic**: `elastic-index-librarymanagementsystem_book-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "title": "String",
  "authors": "String",
  "isbn": "String",
  "synopsis": "Text",
  "genres": "String",
  "publicationDate": "Date",
  "language": "String",
  "publisher": "String",
  "coverImageUrl": "String",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event book-deleted

**Event topic**: `elastic-index-librarymanagementsystem_book-deleted`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "title": "String",
  "authors": "String",
  "isbn": "String",
  "synopsis": "Text",
  "genres": "String",
  "publicationDate": "Date",
  "language": "String",
  "publisher": "String",
  "coverImageUrl": "String",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event book-extended

**Event topic**: `elastic-index-librarymanagementsystem_book-extended`

**Event payload**:

```js
{
  id: id,
  extends: {
    [extendName]: "Object",
    [extendName + "_count"]: "Number",
  },
}
```

# Route Events

Route events are emitted following the successful execution of a route. While most routes perform CRUD (Create, Read, Update, Delete) operations on data objects, resulting in route events that closely resemble database events, there are distinctions worth noting. A single route execution might trigger multiple CRUD actions and ElasticSearch indexing operations. However, for those primarily concerned with the overarching business logic and its outcomes, listening to the consolidated route event, published once at the conclusion of the route's execution, is more pertinent.

Moreover, routes often deliver aggregated data beyond the primary database object, catering to specific client needs. For instance, creating a data object via a route might not only return the entity's data but also route-specific metrics, such as the executing user's permissions related to the entity. Alternatively, a route might automatically generate default child entities following the creation of a parent object. Consequently, the route event encapsulates a unified dataset encompassing both the parent and its children, in contrast to individual events triggered for each entity created. Therefore, subscribing to route events can offer a richer, more contextually relevant set of information aligned with business logic.

The payload of a route event mirrors the REST response JSON of the route, providing a direct and comprehensive reflection of the data and metadata communicated to the client. This ensures that subscribers to route events receive a payload that encapsulates both the primary data involved and any additional information deemed significant at the business level, facilitating a deeper understanding and integration of the service's functional outcomes.

## Index Event branch-created

**Event topic**: `elastic-index-librarymanagementsystem_branch-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "name": "String",
  "address": "Object",
  "geoLocation": "Object",
  "contactEmail": "String",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event branch-updated

**Event topic**: `elastic-index-librarymanagementsystem_branch-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "name": "String",
  "address": "Object",
  "geoLocation": "Object",
  "contactEmail": "String",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event branch-deleted

**Event topic**: `elastic-index-librarymanagementsystem_branch-deleted`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "name": "String",
  "address": "Object",
  "geoLocation": "Object",
  "contactEmail": "String",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event branch-extended

**Event topic**: `elastic-index-librarymanagementsystem_branch-extended`

**Event payload**:

```js
{
  id: id,
  extends: {
    [extendName]: "Object",
    [extendName + "_count"]: "Number",
  },
}
```

# Route Events

Route events are emitted following the successful execution of a route. While most routes perform CRUD (Create, Read, Update, Delete) operations on data objects, resulting in route events that closely resemble database events, there are distinctions worth noting. A single route execution might trigger multiple CRUD actions and ElasticSearch indexing operations. However, for those primarily concerned with the overarching business logic and its outcomes, listening to the consolidated route event, published once at the conclusion of the route's execution, is more pertinent.

Moreover, routes often deliver aggregated data beyond the primary database object, catering to specific client needs. For instance, creating a data object via a route might not only return the entity's data but also route-specific metrics, such as the executing user's permissions related to the entity. Alternatively, a route might automatically generate default child entities following the creation of a parent object. Consequently, the route event encapsulates a unified dataset encompassing both the parent and its children, in contrast to individual events triggered for each entity created. Therefore, subscribing to route events can offer a richer, more contextually relevant set of information aligned with business logic.

The payload of a route event mirrors the REST response JSON of the route, providing a direct and comprehensive reflection of the data and metadata communicated to the client. This ensures that subscribers to route events receive a payload that encapsulates both the primary data involved and any additional information deemed significant at the business level, facilitating a deeper understanding and integration of the service's functional outcomes.

## Index Event branchinventory-created

**Event topic**: `elastic-index-librarymanagementsystem_branchinventory-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "bookId": "ID",
  "branchId": "ID",
  "totalCopies": "Integer",
  "availableCopies": "Integer",
  "localShelfLocation": "String",
  "conditionNotes": "Text",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event branchinventory-updated

**Event topic**: `elastic-index-librarymanagementsystem_branchinventory-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "bookId": "ID",
  "branchId": "ID",
  "totalCopies": "Integer",
  "availableCopies": "Integer",
  "localShelfLocation": "String",
  "conditionNotes": "Text",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event branchinventory-deleted

**Event topic**: `elastic-index-librarymanagementsystem_branchinventory-deleted`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "bookId": "ID",
  "branchId": "ID",
  "totalCopies": "Integer",
  "availableCopies": "Integer",
  "localShelfLocation": "String",
  "conditionNotes": "Text",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event branchinventory-extended

**Event topic**: `elastic-index-librarymanagementsystem_branchinventory-extended`

**Event payload**:

```js
{
  id: id,
  extends: {
    [extendName]: "Object",
    [extendName + "_count"]: "Number",
  },
}
```

# Route Events

Route events are emitted following the successful execution of a route. While most routes perform CRUD (Create, Read, Update, Delete) operations on data objects, resulting in route events that closely resemble database events, there are distinctions worth noting. A single route execution might trigger multiple CRUD actions and ElasticSearch indexing operations. However, for those primarily concerned with the overarching business logic and its outcomes, listening to the consolidated route event, published once at the conclusion of the route's execution, is more pertinent.

Moreover, routes often deliver aggregated data beyond the primary database object, catering to specific client needs. For instance, creating a data object via a route might not only return the entity's data but also route-specific metrics, such as the executing user's permissions related to the entity. Alternatively, a route might automatically generate default child entities following the creation of a parent object. Consequently, the route event encapsulates a unified dataset encompassing both the parent and its children, in contrast to individual events triggered for each entity created. Therefore, subscribing to route events can offer a richer, more contextually relevant set of information aligned with business logic.

The payload of a route event mirrors the REST response JSON of the route, providing a direct and comprehensive reflection of the data and metadata communicated to the client. This ensures that subscribers to route events receive a payload that encapsulates both the primary data involved and any additional information deemed significant at the business level, facilitating a deeper understanding and integration of the service's functional outcomes.

## Index Event inventoryauditlog-created

**Event topic**: `elastic-index-librarymanagementsystem_inventoryauditlog-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "branchId": "ID",
  "branchInventoryId": "ID",
  "auditType": "Enum",
  "auditType_": "String",
  "detailNote": "Text",
  "adjustmentValue": "Integer",
  "recordedByUserId": "ID",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event inventoryauditlog-updated

**Event topic**: `elastic-index-librarymanagementsystem_inventoryauditlog-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "branchId": "ID",
  "branchInventoryId": "ID",
  "auditType": "Enum",
  "auditType_": "String",
  "detailNote": "Text",
  "adjustmentValue": "Integer",
  "recordedByUserId": "ID",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event inventoryauditlog-deleted

**Event topic**: `elastic-index-librarymanagementsystem_inventoryauditlog-deleted`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "branchId": "ID",
  "branchInventoryId": "ID",
  "auditType": "Enum",
  "auditType_": "String",
  "detailNote": "Text",
  "adjustmentValue": "Integer",
  "recordedByUserId": "ID",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event inventoryauditlog-extended

**Event topic**: `elastic-index-librarymanagementsystem_inventoryauditlog-extended`

**Event payload**:

```js
{
  id: id,
  extends: {
    [extendName]: "Object",
    [extendName + "_count"]: "Number",
  },
}
```

# Route Events

Route events are emitted following the successful execution of a route. While most routes perform CRUD (Create, Read, Update, Delete) operations on data objects, resulting in route events that closely resemble database events, there are distinctions worth noting. A single route execution might trigger multiple CRUD actions and ElasticSearch indexing operations. However, for those primarily concerned with the overarching business logic and its outcomes, listening to the consolidated route event, published once at the conclusion of the route's execution, is more pertinent.

Moreover, routes often deliver aggregated data beyond the primary database object, catering to specific client needs. For instance, creating a data object via a route might not only return the entity's data but also route-specific metrics, such as the executing user's permissions related to the entity. Alternatively, a route might automatically generate default child entities following the creation of a parent object. Consequently, the route event encapsulates a unified dataset encompassing both the parent and its children, in contrast to individual events triggered for each entity created. Therefore, subscribing to route events can offer a richer, more contextually relevant set of information aligned with business logic.

The payload of a route event mirrors the REST response JSON of the route, providing a direct and comprehensive reflection of the data and metadata communicated to the client. This ensures that subscribers to route events receive a payload that encapsulates both the primary data involved and any additional information deemed significant at the business level, facilitating a deeper understanding and integration of the service's functional outcomes.

## Index Event interbranchtransfer-created

**Event topic**: `elastic-index-librarymanagementsystem_interbranchtransfer-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "bookId": "ID",
  "sourceBranchId": "ID",
  "destBranchId": "ID",
  "quantity": "Integer",
  "requestedByUserId": "ID",
  "status": "Enum",
  "status_": "String",
  "transferLog": "Object",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event interbranchtransfer-updated

**Event topic**: `elastic-index-librarymanagementsystem_interbranchtransfer-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "bookId": "ID",
  "sourceBranchId": "ID",
  "destBranchId": "ID",
  "quantity": "Integer",
  "requestedByUserId": "ID",
  "status": "Enum",
  "status_": "String",
  "transferLog": "Object",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event interbranchtransfer-deleted

**Event topic**: `elastic-index-librarymanagementsystem_interbranchtransfer-deleted`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "bookId": "ID",
  "sourceBranchId": "ID",
  "destBranchId": "ID",
  "quantity": "Integer",
  "requestedByUserId": "ID",
  "status": "Enum",
  "status_": "String",
  "transferLog": "Object",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event interbranchtransfer-extended

**Event topic**: `elastic-index-librarymanagementsystem_interbranchtransfer-extended`

**Event payload**:

```js
{
  id: id,
  extends: {
    [extendName]: "Object",
    [extendName + "_count"]: "Number",
  },
}
```

# Route Events

Route events are emitted following the successful execution of a route. While most routes perform CRUD (Create, Read, Update, Delete) operations on data objects, resulting in route events that closely resemble database events, there are distinctions worth noting. A single route execution might trigger multiple CRUD actions and ElasticSearch indexing operations. However, for those primarily concerned with the overarching business logic and its outcomes, listening to the consolidated route event, published once at the conclusion of the route's execution, is more pertinent.

Moreover, routes often deliver aggregated data beyond the primary database object, catering to specific client needs. For instance, creating a data object via a route might not only return the entity's data but also route-specific metrics, such as the executing user's permissions related to the entity. Alternatively, a route might automatically generate default child entities following the creation of a parent object. Consequently, the route event encapsulates a unified dataset encompassing both the parent and its children, in contrast to individual events triggered for each entity created. Therefore, subscribing to route events can offer a richer, more contextually relevant set of information aligned with business logic.

The payload of a route event mirrors the REST response JSON of the route, providing a direct and comprehensive reflection of the data and metadata communicated to the client. This ensures that subscribers to route events receive a payload that encapsulates both the primary data involved and any additional information deemed significant at the business level, facilitating a deeper understanding and integration of the service's functional outcomes.

## Index Event purchaseorder-created

**Event topic**: `elastic-index-librarymanagementsystem_purchaseorder-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "branchId": "ID",
  "requestedByUserId": "ID",
  "itemRequests": "Object",
  "status": "Enum",
  "status_": "String",
  "approvalNotes": "Text",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event purchaseorder-updated

**Event topic**: `elastic-index-librarymanagementsystem_purchaseorder-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "branchId": "ID",
  "requestedByUserId": "ID",
  "itemRequests": "Object",
  "status": "Enum",
  "status_": "String",
  "approvalNotes": "Text",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event purchaseorder-deleted

**Event topic**: `elastic-index-librarymanagementsystem_purchaseorder-deleted`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "branchId": "ID",
  "requestedByUserId": "ID",
  "itemRequests": "Object",
  "status": "Enum",
  "status_": "String",
  "approvalNotes": "Text",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event purchaseorder-extended

**Event topic**: `elastic-index-librarymanagementsystem_purchaseorder-extended`

**Event payload**:

```js
{
  id: id,
  extends: {
    [extendName]: "Object",
    [extendName + "_count"]: "Number",
  },
}
```

# Route Events

Route events are emitted following the successful execution of a route. While most routes perform CRUD (Create, Read, Update, Delete) operations on data objects, resulting in route events that closely resemble database events, there are distinctions worth noting. A single route execution might trigger multiple CRUD actions and ElasticSearch indexing operations. However, for those primarily concerned with the overarching business logic and its outcomes, listening to the consolidated route event, published once at the conclusion of the route's execution, is more pertinent.

Moreover, routes often deliver aggregated data beyond the primary database object, catering to specific client needs. For instance, creating a data object via a route might not only return the entity's data but also route-specific metrics, such as the executing user's permissions related to the entity. Alternatively, a route might automatically generate default child entities following the creation of a parent object. Consequently, the route event encapsulates a unified dataset encompassing both the parent and its children, in contrast to individual events triggered for each entity created. Therefore, subscribing to route events can offer a richer, more contextually relevant set of information aligned with business logic.

The payload of a route event mirrors the REST response JSON of the route, providing a direct and comprehensive reflection of the data and metadata communicated to the client. This ensures that subscribers to route events receive a payload that encapsulates both the primary data involved and any additional information deemed significant at the business level, facilitating a deeper understanding and integration of the service's functional outcomes.

## Index Event cataloginventorysharetoken-created

**Event topic**: `elastic-index-librarymanagementsystem_cataloginventorysharetoken-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "configName": "String",
  "objectName": "String",
  "objectId": "ID",
  "ownerId": "ID",
  "peopleOption": "String",
  "tokenPermissions": null,
  "allowedEmails": null,
  "expireDate": "Date",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event cataloginventorysharetoken-updated

**Event topic**: `elastic-index-librarymanagementsystem_cataloginventorysharetoken-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "configName": "String",
  "objectName": "String",
  "objectId": "ID",
  "ownerId": "ID",
  "peopleOption": "String",
  "tokenPermissions": null,
  "allowedEmails": null,
  "expireDate": "Date",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event cataloginventorysharetoken-deleted

**Event topic**: `elastic-index-librarymanagementsystem_cataloginventorysharetoken-deleted`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "configName": "String",
  "objectName": "String",
  "objectId": "ID",
  "ownerId": "ID",
  "peopleOption": "String",
  "tokenPermissions": null,
  "allowedEmails": null,
  "expireDate": "Date",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event cataloginventorysharetoken-extended

**Event topic**: `elastic-index-librarymanagementsystem_cataloginventorysharetoken-extended`

**Event payload**:

```js
{
  id: id,
  extends: {
    [extendName]: "Object",
    [extendName + "_count"]: "Number",
  },
}
```

# Route Events

Route events are emitted following the successful execution of a route. While most routes perform CRUD (Create, Read, Update, Delete) operations on data objects, resulting in route events that closely resemble database events, there are distinctions worth noting. A single route execution might trigger multiple CRUD actions and ElasticSearch indexing operations. However, for those primarily concerned with the overarching business logic and its outcomes, listening to the consolidated route event, published once at the conclusion of the route's execution, is more pertinent.

Moreover, routes often deliver aggregated data beyond the primary database object, catering to specific client needs. For instance, creating a data object via a route might not only return the entity's data but also route-specific metrics, such as the executing user's permissions related to the entity. Alternatively, a route might automatically generate default child entities following the creation of a parent object. Consequently, the route event encapsulates a unified dataset encompassing both the parent and its children, in contrast to individual events triggered for each entity created. Therefore, subscribing to route events can offer a richer, more contextually relevant set of information aligned with business logic.

The payload of a route event mirrors the REST response JSON of the route, providing a direct and comprehensive reflection of the data and metadata communicated to the client. This ensures that subscribers to route events receive a payload that encapsulates both the primary data involved and any additional information deemed significant at the business level, facilitating a deeper understanding and integration of the service's functional outcomes.

# Copyright

All sources, documents and other digital materials are copyright of .

# About Us

For more information please visit our website: .

.
.
