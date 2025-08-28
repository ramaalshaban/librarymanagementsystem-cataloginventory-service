# REST API GUIDE

## librarymanagementsystem-cataloginventory-service

Manages the master book catalog, detailed metadata, per-branch inventory, advanced searching, inventory audits, inter-branch transfers, and collection purchasing workflows for a multi-branch library network..

## Architectural Design Credit and Contact Information

The architectural design of this microservice is credited to .
For inquiries, feedback, or further information regarding the architecture, please direct your communication to:

Email:

We encourage open communication and welcome any questions or discussions related to the architectural aspects of this microservice.

## Documentation Scope

Welcome to the official documentation for the CatalogInventory Service's REST API. This document is designed to provide a comprehensive guide to interfacing with our CatalogInventory Service exclusively through RESTful API endpoints.

**Intended Audience**

This documentation is intended for developers and integrators who are looking to interact with the CatalogInventory Service via HTTP requests for purposes such as creating, updating, deleting and querying CatalogInventory objects.

**Overview**

Within these pages, you will find detailed information on how to effectively utilize the REST API, including authentication methods, request and response formats, endpoint descriptions, and examples of common use cases.

Beyond REST
It's important to note that the CatalogInventory Service also supports alternative methods of interaction, such as gRPC and messaging via a Message Broker. These communication methods are beyond the scope of this document. For information regarding these protocols, please refer to their respective documentation.

## Authentication And Authorization

To ensure secure access to the CatalogInventory service's protected endpoints, a project-wide access token is required. This token serves as the primary method for authenticating requests to our service. However, it's important to note that access control varies across different routes:

**Protected Routes**:
Certain routes require specific authorization levels. Access to these routes is contingent upon the possession of a valid access token that meets the route-specific authorization criteria. Unauthorized requests to these routes will be rejected.

**Public Routes**:
The service also includes routes that are accessible without authentication. These public endpoints are designed for open access and do not require an access token.

### Token Locations

When including your access token in a request, ensure it is placed in one of the following specified locations. The service will sequentially search these locations for the token, utilizing the first one it encounters.

| Location             | Token Name / Param Name              |
| -------------------- | ------------------------------------ |
| Query                | access_token                         |
| Authorization Header | Bearer                               |
| Header               | librarymanagementsystem-access-token |
| Cookie               | librarymanagementsystem-access-token |

Please ensure the token is correctly placed in one of these locations, using the appropriate label as indicated. The service prioritizes these locations in the order listed, processing the first token it successfully identifies.

## Api Definitions

This section outlines the API endpoints available within the CatalogInventory service. Each endpoint can receive parameters through various methods, meticulously described in the following definitions. It's important to understand the flexibility in how parameters can be included in requests to effectively interact with the CatalogInventory service.

This service is configured to listen for HTTP requests on port `3000`,
serving both the main API interface and default administrative endpoints.

The following routes are available by default:

- **API Test Interface (API Face):** `/`
- **Swagger Documentation:** `/swagger`
- **Postman Collection Download:** `/getPostmanCollection`
- **Health Checks:** `/health` and `/admin/health`
- **Current Session Info:** `/currentuser`
- **Favicon:** `/favicon.ico`

This service is accessible via the following environment-specific URLs:

- **Preview:** `https://catalogInventory-api.librarymanagementsystem.prw.mindbricks.com`
- **Staging:** `https://catalogInventory-api.librarymanagementsystem.staging.mindbricks.com`
- **Production:** `https://catalogInventory-api.librarymanagementsystem.prod.mindbricks.com`

**Parameter Inclusion Methods:**
Parameters can be incorporated into API requests in several ways, each with its designated location. Understanding these methods is crucial for correctly constructing your requests:

**Query Parameters:** Included directly in the URL's query string.

**Path Parameters:** Embedded within the URL's path.

**Body Parameters:** Sent within the JSON body of the request.

**Session Parameters:** Automatically read from the session object. This method is used for parameters that are intrinsic to the user's session, such as userId. When using an API that involves session parameters, you can omit these from your request. The service will automatically bind them to the route, provided that a session is associated with your request.

**Note on Session Parameters:**
Session parameters represent a unique method of parameter inclusion, relying on the context of the user's session. A common example of a session parameter is userId, which the service automatically associates with your request when a session exists. This feature ensures seamless integration of user-specific data without manual input for each request.

By adhering to the specified parameter inclusion methods, you can effectively utilize the CatalogInventory service's API endpoints. For detailed information on each endpoint, including required parameters and their accepted locations, refer to the individual API definitions below.

### Common Parameters

The `CatalogInventory` service's routes support several common parameters designed to modify and enhance the behavior of API requests. These parameters are not individually listed in the API route definitions to avoid repetition. Instead, refer to this section to understand how to leverage these common behaviors across different routes. Note that all common parameters should be included in the query part of the URL.

### Supported Common Parameters:

- **getJoins (BOOLEAN)**: Controls whether to retrieve associated objects along with the main object. By default, `getJoins` is assumed to be `true`. Set it to `false` if you prefer to receive only the main fields of an object, excluding its associations.

- **excludeCQRS (BOOLEAN)**: Applicable only when `getJoins` is `true`. By default, `excludeCQRS` is set to `false`. Enabling this parameter (`true`) omits non-local associations, which are typically more resource-intensive as they require querying external services like ElasticSearch for additional information. Use this to optimize response times and resource usage.

- **requestId (String)**: Identifies a request to enable tracking through the service's log chain. A random hex string of 32 characters is assigned by default. If you wish to use a custom `requestId`, simply include it in your query parameters.

- **caching (BOOLEAN)**: Determines the use of caching for query routes. By default, caching is enabled (`true`). To ensure the freshest data directly from the database, set this parameter to `false`, bypassing the cache.

- **cacheTTL (Integer)**: Specifies the Time-To-Live (TTL) for query caching, in seconds. This is particularly useful for adjusting the default caching duration (5 minutes) for `get list` queries. Setting a custom `cacheTTL` allows you to fine-tune the cache lifespan to meet your needs.

- **pageNumber (Integer)**: For paginated `get list` routes, this parameter selects which page of results to retrieve. The default is `1`, indicating the first page. To disable pagination and retrieve all results, set `pageNumber` to `0`.

- **pageRowCount (Integer)**: In conjunction with paginated routes, this parameter defines the number of records per page. The default value is `25`. Adjusting `pageRowCount` allows you to control the volume of data returned in a single request.

By utilizing these common parameters, you can tailor the behavior of API requests to suit your specific requirements, ensuring optimal performance and usability of the `CatalogInventory` service.

### Error Response

If a request encounters an issue, whether due to a logical fault or a technical problem, the service responds with a standardized JSON error structure. The HTTP status code within this response indicates the nature of the error, utilizing commonly recognized codes for clarity:

- **400 Bad Request**: The request was improperly formatted or contained invalid parameters, preventing the server from processing it.
- **401 Unauthorized**: The request lacked valid authentication credentials or the credentials provided do not grant access to the requested resource.
- **404 Not Found**: The requested resource was not found on the server.
- **500 Internal Server Error**: The server encountered an unexpected condition that prevented it from fulfilling the request.

Each error response is structured to provide meaningful insight into the problem, assisting in diagnosing and resolving issues efficiently.

```js
{
  "result": "ERR",
  "status": 400,
  "message": "errMsg_organizationIdisNotAValidID",
  "errCode": 400,
  "date": "2024-03-19T12:13:54.124Z",
  "detail": "String"
}
```

### Object Structure of a Successfull Response

When the `CatalogInventory` service processes requests successfully, it wraps the requested resource(s) within a JSON envelope. This envelope not only contains the data but also includes essential metadata, such as configuration details and pagination information, to enrich the response and provide context to the client.

**Key Characteristics of the Response Envelope:**

- **Data Presentation**: Depending on the nature of the request, the service returns either a single data object or an array of objects encapsulated within the JSON envelope.
  - **Creation and Update Routes**: These routes return the unmodified (pure) form of the data object(s), without any associations to other data objects.
  - **Delete Routes**: Even though the data is removed from the database, the last known state of the data object(s) is returned in its pure form.
  - **Get Requests**: A single data object is returned in JSON format.
  - **Get List Requests**: An array of data objects is provided, reflecting a collection of resources.

- **Data Structure and Joins**: The complexity of the data structure in the response can vary based on the route's architectural design and the join options specified in the request. The architecture might inherently limit join operations, or they might be dynamically controlled through query parameters.
  - **Pure Data Forms**: In some cases, the response mirrors the exact structure found in the primary data table, without extensions.
  - **Extended Data Forms**: Alternatively, responses might include data extended through joins with tables within the same service or aggregated from external sources, such as ElasticSearch indices related to other services.
  - **Join Varieties**: The extensions might involve one-to-one joins, resulting in single object associations, or one-to-many joins, leading to an array of objects. In certain instances, the data might even feature nested inclusions from other data objects.

**Design Considerations**: The structure of a route's response data is meticulously crafted during the service's architectural planning. This design ensures that responses adequately reflect the intended data relationships and service logic, providing clients with rich and meaningful information.

**Brief Data**: Certain routes return a condensed version of the object data, intentionally selecting only specific fields deemed useful for that request. In such instances, the route documentation will detail the properties included in the response, guiding developers on what to expect.

### API Response Structure

The API utilizes a standardized JSON envelope to encapsulate responses. This envelope is designed to consistently deliver both the requested data and essential metadata, ensuring that clients can efficiently interpret and utilize the response.

**HTTP Status Codes:**

- **200 OK**: This status code is returned for successful GET, GETLIST, UPDATE, or DELETE operations, indicating that the request has been processed successfully.
- **201 Created**: This status code is specific to CREATE operations, signifying that the requested resource has been successfully created.

**Success Response Format:**

For successful operations, the response includes a `"status": "OK"` property, signaling the successful execution of the request. The structure of a successful response is outlined below:

```json
{
  "status":"OK",
  "statusCode": 200,
  "elapsedMs":126,
  "ssoTime":120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName":"products",
  "method":"GET",
  "action":"getList",
  "appVersion":"Version",
  "rowCount":3
  "products":[{},{},{}],
  "paging": {
    "pageNumber":1,
    "pageRowCount":25,
    "totalRowCount":3,
    "pageCount":1
  },
  "filters": [],
  "uiPermissions": []
}
```

- **`products`**: In this example, this key contains the actual response content, which may be a single object or an array of objects depending on the operation performed.

**Handling Errors:**

For details on handling error scenarios and understanding the structure of error responses, please refer to the "Error Response" section provided earlier in this documentation. It outlines how error conditions are communicated, including the use of HTTP status codes and standardized JSON structures for error messages.

**Route Validation Layers:**

Route Validations may be executed in 4 different layers. The layer is a kind of time definition in the route life cycle. Note that while conditional check times are defined by layers, the fetch actions are defined by access times.

`layer1`: "The first layer of route life cycle which is just after the request parameters are validated and the request is in controller. Any script, validation or data operation in this layer can access the route parameters only. The beforeInstance data is not ready yet."

`layer2`: "The second layer of route life cycle which is just after beforeInstance data is collected before the main operation of the route and the main operation is not started yet. In this layer the collected supplementary data is accessable with the route parameters."

`layer3`: "The third layer of route life cycle which is just after the main operation of the route is completed. In this layer the main operation result is accessable with the beforeInstance data and route parameters. Note that the afterInstance data is not ready yet."

`layer4`: "The last layer of route life cycle which is just after afterInstance supplementary data is collected. In this layer the afterInstance data is accessable with the main operation result, beforeInstance data and route parameters."

## Resources

CatalogInventory service provides the following resources which are stored in its own database as a data object. Note that a resource for an api access is a data object for the service.

### Book resource

_Resource Definition_ : Master catalog record for a book or multi-copy item; includes bibliographic metadata, ISBN, authors, genres, full-text and geospatial search fields.
_Book Resource Properties_
| Name | Type | Required | Default | Definition |
| ---- | ---- | -------- | ------- | ---------- |
| **title** | String | | | _The canonical title of the book/work._ |
| **authors** | String | | | _List of authors (for multi-author works, in order as credited)._ |
| **isbn** | String | | | _International Standard Book Number (ISBN-10 or ISBN-13)._ |
| **synopsis** | Text | | | _Short/long description or synopsis of the book._ |
| **genres** | String | | | _Genres/categories assigned to the book (e.g. Fiction, Science, Children, Biography)._ |
| **publicationDate** | Date | | | _Publication date (first edition or this edition)._ |
| **language** | String | | | _Primary language of the book._ |
| **publisher** | String | | | _Publisher of the edition._ |
| **coverImageUrl** | String | | | _Optional cover image URL for the book._ |

### Branch resource

_Resource Definition_ : Represents a physical library branch for catalog holdings: names, contact details, and geocoordinates for geospatial/proximity queries.
_Branch Resource Properties_
| Name | Type | Required | Default | Definition |
| ---- | ---- | -------- | ------- | ---------- |
| **name** | String | | | _The common name of the library branch._ |
| **address** | Object | | | _Branch postal address object (street, city, zip, etc)._ |
| **geoLocation** | Object | | | _GeoJSON Point for branch location (for spatial/proximity queries)._ |
| **contactEmail** | String | | | _Branch or staff contact email for inquiries._ |

### BranchInventory resource

_Resource Definition_ : Links a book with a branch; tracks quantity, availability, local shelf/copy/serial identifiers, and overall condition for per-branch inventory.
_BranchInventory Resource Properties_
| Name | Type | Required | Default | Definition |
| ---- | ---- | -------- | ------- | ---------- |
| **bookId** | ID | | | _Foreign key to book._ |
| **branchId** | ID | | | _Foreign key to branch._ |
| **totalCopies** | Integer | | | _Total number of copies held at this branch._ |
| **availableCopies** | Integer | | | _Number of un-lent, available copies at this branch._ |
| **localShelfLocation** | String | | | _Shelf, area, or local ID for physical asset at branch._ |
| **conditionNotes** | Text | | | _Notes on general condition or issues for this holding._ |

### InventoryAuditLog resource

_Resource Definition_ : Log/audit entries of inventory audits, discrepancy findings, loss/damage/adjustment events during branch stock checks.
_InventoryAuditLog Resource Properties_
| Name | Type | Required | Default | Definition |
| ---- | ---- | -------- | ------- | ---------- |
| **branchId** | ID | | | _Branch where audit/adjustment occurs._ |
| **branchInventoryId** | ID | | | _Inventory record at branch for this adjustment/event._ |
| **auditType** | Enum | | | _Type of audit or adjustment: inventory, damage, loss, etc._ |
| **detailNote** | Text | | | _Notes/details for this audit/discrepancy entry (explanation, corrective action, etc)._ |
| **adjustmentValue** | Integer | | | _Adjustment: +n/-n to available copies (for missing, found, disposed books)._ |
| **recordedByUserId** | ID | | | _User (staff) who recorded this audit entry._ |

#### Enum Properties

Enum properties are represented as Small Integer values (0-255) in the database. The values are mapped to their corresponding names in the application layer.

##### auditType Enum Property

_Enum Options_
| Name | Value | Index |
| ---- | ----- | ----- |
| **audit** | `"audit""` | 0 |
| **damage** | `"damage""` | 1 |
| **loss** | `"loss""` | 2 |
| **discrepancy** | `"discrepancy""` | 3 |
| **adjustment** | `"adjustment""` | 4 |

### InterBranchTransfer resource

_Resource Definition_ : Tracks in-progress or completed inter-branch transfers of books/materials, including statuses, movement, who requested, and fulfillment actions.
_InterBranchTransfer Resource Properties_
| Name | Type | Required | Default | Definition |
| ---- | ---- | -------- | ------- | ---------- |
| **bookId** | ID | | | _Book to transfer (master catalog id)._ |
| **sourceBranchId** | ID | | | _Branch from which book is sent._ |
| **destBranchId** | ID | | | _Branch receiving the transfer._ |
| **quantity** | Integer | | | _Number of copies to transfer._ |
| **requestedByUserId** | ID | | | _User (staff) who requested the transfer._ |
| **status** | Enum | | | _Status (requested, approved, inTransit, completed, rejected, canceled)._ |
| **transferLog** | Object | | | _Log array (timestamp, action, userId, note) for steps in the transfer workflow._ |

#### Enum Properties

Enum properties are represented as Small Integer values (0-255) in the database. The values are mapped to their corresponding names in the application layer.

##### status Enum Property

_Enum Options_
| Name | Value | Index |
| ---- | ----- | ----- |
| **requested** | `"requested""` | 0 |
| **approved** | `"approved""` | 1 |
| **inTransit** | `"inTransit""` | 2 |
| **completed** | `"completed""` | 3 |
| **rejected** | `"rejected""` | 4 |
| **canceled** | `"canceled""` | 5 |

### PurchaseOrder resource

_Resource Definition_ : Represents a branch purchase/acquisition request for new catalog items; includes items requested, status, and approval/fulfillment workflow.
_PurchaseOrder Resource Properties_
| Name | Type | Required | Default | Definition |
| ---- | ---- | -------- | ------- | ---------- |
| **branchId** | ID | | | _Branch from which this purchase order was created/requested._ |
| **requestedByUserId** | ID | | | _User/staff who created purchase order._ |
| **itemRequests** | Object | | | _Requested book (by ID/isbn/title) and quantity (array of objects: {bookId, isbn, title, requestedQuantity})_ |
| **status** | Enum | | | _Order workflow status (requested, approved, rejected, fulfilled, canceled)._ |
| **approvalNotes** | Text | | | _Branch manager (or admin) notes on decision, update trail, rejection reasons, etc._ |

#### Enum Properties

Enum properties are represented as Small Integer values (0-255) in the database. The values are mapped to their corresponding names in the application layer.

##### status Enum Property

_Enum Options_
| Name | Value | Index |
| ---- | ----- | ----- |
| **requested** | `"requested""` | 0 |
| **approved** | `"approved""` | 1 |
| **rejected** | `"rejected""` | 2 |
| **fulfilled** | `"fulfilled""` | 3 |
| **canceled** | `"canceled""` | 4 |

### CatalogInventoryShareToken resource

_Resource Definition_ : A data object that stores the share tokens for tokenized access to shared objects.
_CatalogInventoryShareToken Resource Properties_
| Name | Type | Required | Default | Definition |
| ---- | ---- | -------- | ------- | ---------- |
| **configName** | String | | | _A string value to represent the related configuration of the shared token._ |
| **objectName** | String | | | _A string value to represent the type name of the shared object like `report`, `document`._ |
| **objectId** | ID | | | _An ID value to represent the shared target data object instance._ |
| **ownerId** | ID | | | _An ID value to represent the user who shared the object by creating this token._ |
| **peopleOption** | String | | | _A string value to represent the access option of the share token. It can be either anyoneWithLink or specificEmails._ |
| **tokenPermissions** | | | | _A string array to store the names of permissions (or roles) by the sharing user._ |
| **allowedEmails** | | | | _A string array to store the allowed emails if the peopleOption is specificEmails._ |
| **expireDate** | Date | | | _A date value to specify the expire date of the token. Null for infinite token._ |

## Crud Routes

### Route: getBook

_Route Definition_ : Retrieve book by id (master catalog entry).

_Route Type_ : get

_Default access route_ : _GET_ `/books/:bookId`

#### Parameters

The getBook api has got 1 parameter

| Parameter | Type | Required | Population             |
| --------- | ---- | -------- | ---------------------- |
| bookId    | ID   | true     | request.params?.bookId |

To access the api you can use the **REST** controller with the path **GET /books/:bookId**

```js
axios({
  method: "GET",
  url: `/books/${bookId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`book`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "book",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "book": { "id": "ID", "isActive": true }
}
```

### Route: createBook

_Route Definition_ : Create a new master book/catalog record entry.

_Route Type_ : create

_Default access route_ : _POST_ `/books`

#### Parameters

The createBook api has got 9 parameters

| Parameter       | Type   | Required | Population                    |
| --------------- | ------ | -------- | ----------------------------- |
| title           | String | true     | request.body?.title           |
| authors         | String | true     | request.body?.authors         |
| isbn            | String | false    | request.body?.isbn            |
| synopsis        | Text   | false    | request.body?.synopsis        |
| genres          | String | false    | request.body?.genres          |
| publicationDate | Date   | false    | request.body?.publicationDate |
| language        | String | false    | request.body?.language        |
| publisher       | String | false    | request.body?.publisher       |
| coverImageUrl   | String | false    | request.body?.coverImageUrl   |

To access the api you can use the **REST** controller with the path **POST /books**

```js
axios({
  method: "POST",
  url: "/books",
  data: {
    title: "String",
    authors: "String",
    isbn: "String",
    synopsis: "Text",
    genres: "String",
    publicationDate: "Date",
    language: "String",
    publisher: "String",
    coverImageUrl: "String",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`book`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "book",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "book": { "id": "ID", "isActive": true }
}
```

### Route: updateBook

_Route Definition_ : Update an existing master book entry.

_Route Type_ : update

_Default access route_ : _PATCH_ `/books/:bookId`

#### Parameters

The updateBook api has got 10 parameters

| Parameter       | Type   | Required | Population                    |
| --------------- | ------ | -------- | ----------------------------- |
| bookId          | ID     | true     | request.params?.bookId        |
| title           | String | false    | request.body?.title           |
| authors         | String | false    | request.body?.authors         |
| isbn            | String | false    | request.body?.isbn            |
| synopsis        | Text   | false    | request.body?.synopsis        |
| genres          | String | false    | request.body?.genres          |
| publicationDate | Date   | false    | request.body?.publicationDate |
| language        | String | false    | request.body?.language        |
| publisher       | String | false    | request.body?.publisher       |
| coverImageUrl   | String | false    | request.body?.coverImageUrl   |

To access the api you can use the **REST** controller with the path **PATCH /books/:bookId**

```js
axios({
  method: "PATCH",
  url: `/books/${bookId}`,
  data: {
    title: "String",
    authors: "String",
    isbn: "String",
    synopsis: "Text",
    genres: "String",
    publicationDate: "Date",
    language: "String",
    publisher: "String",
    coverImageUrl: "String",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`book`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "book",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "book": { "id": "ID", "isActive": true }
}
```

### Route: deleteBook

_Route Definition_ : Delete a book entry from the catalog.

_Route Type_ : delete

_Default access route_ : _DELETE_ `/books/:bookId`

#### Parameters

The deleteBook api has got 1 parameter

| Parameter | Type | Required | Population             |
| --------- | ---- | -------- | ---------------------- |
| bookId    | ID   | true     | request.params?.bookId |

To access the api you can use the **REST** controller with the path **DELETE /books/:bookId**

```js
axios({
  method: "DELETE",
  url: `/books/${bookId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`book`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "book",
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "book": { "id": "ID", "isActive": false }
}
```

### Route: listBooks

_Route Definition_ : Find and filter books by title, author, genre, availability, etc (advanced search).

_Route Type_ : getList

_Default access route_ : _GET_ `/books`

The listBooks api has got no parameters.

To access the api you can use the **REST** controller with the path **GET /books**

```js
axios({
  method: "GET",
  url: "/books",
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`books`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "books",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": "\"Number\"",
  "books": [{ "id": "ID", "isActive": true }, {}, {}],
  "paging": {
    "pageNumber": "Number",
    "pageRowCount": "NUmber",
    "totalRowCount": "Number",
    "pageCount": "Number"
  },
  "filters": [],
  "uiPermissions": []
}
```

### Route: getBranch

_Route Definition_ : Get a branch by ID.

_Route Type_ : get

_Default access route_ : _GET_ `/branches/:branchId`

#### Parameters

The getBranch api has got 1 parameter

| Parameter | Type | Required | Population               |
| --------- | ---- | -------- | ------------------------ |
| branchId  | ID   | true     | request.params?.branchId |

To access the api you can use the **REST** controller with the path **GET /branches/:branchId**

```js
axios({
  method: "GET",
  url: `/branches/${branchId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`branch`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "branch",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "branch": { "id": "ID", "isActive": true }
}
```

### Route: createBranch

_Route Definition_ : Create a new library branch entry.

_Route Type_ : create

_Default access route_ : _POST_ `/branches`

#### Parameters

The createBranch api has got 4 parameters

| Parameter    | Type   | Required | Population                 |
| ------------ | ------ | -------- | -------------------------- |
| name         | String | true     | request.body?.name         |
| address      | Object | false    | request.body?.address      |
| geoLocation  | Object | false    | request.body?.geoLocation  |
| contactEmail | String | false    | request.body?.contactEmail |

To access the api you can use the **REST** controller with the path **POST /branches**

```js
axios({
  method: "POST",
  url: "/branches",
  data: {
    name: "String",
    address: "Object",
    geoLocation: "Object",
    contactEmail: "String",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`branch`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "branch",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "branch": { "id": "ID", "isActive": true }
}
```

### Route: updateBranch

_Route Definition_ : Update an existing branch entry.

_Route Type_ : update

_Default access route_ : _PATCH_ `/branches/:branchId`

#### Parameters

The updateBranch api has got 5 parameters

| Parameter    | Type   | Required | Population                 |
| ------------ | ------ | -------- | -------------------------- |
| branchId     | ID     | true     | request.params?.branchId   |
| name         | String | false    | request.body?.name         |
| address      | Object | false    | request.body?.address      |
| geoLocation  | Object | false    | request.body?.geoLocation  |
| contactEmail | String | false    | request.body?.contactEmail |

To access the api you can use the **REST** controller with the path **PATCH /branches/:branchId**

```js
axios({
  method: "PATCH",
  url: `/branches/${branchId}`,
  data: {
    name: "String",
    address: "Object",
    geoLocation: "Object",
    contactEmail: "String",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`branch`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "branch",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "branch": { "id": "ID", "isActive": true }
}
```

### Route: deleteBranch

_Route Definition_ : Delete a branch record.

_Route Type_ : delete

_Default access route_ : _DELETE_ `/branches/:branchId`

#### Parameters

The deleteBranch api has got 1 parameter

| Parameter | Type | Required | Population               |
| --------- | ---- | -------- | ------------------------ |
| branchId  | ID   | true     | request.params?.branchId |

To access the api you can use the **REST** controller with the path **DELETE /branches/:branchId**

```js
axios({
  method: "DELETE",
  url: `/branches/${branchId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`branch`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "branch",
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "branch": { "id": "ID", "isActive": false }
}
```

### Route: listBranches

_Route Definition_ : List/search library branches (with geo support).

_Route Type_ : getList

_Default access route_ : _GET_ `/branches`

The listBranches api has got no parameters.

To access the api you can use the **REST** controller with the path **GET /branches**

```js
axios({
  method: "GET",
  url: "/branches",
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`branches`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "branches",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": "\"Number\"",
  "branches": [{ "id": "ID", "isActive": true }, {}, {}],
  "paging": {
    "pageNumber": "Number",
    "pageRowCount": "NUmber",
    "totalRowCount": "Number",
    "pageCount": "Number"
  },
  "filters": [],
  "uiPermissions": []
}
```

### Route: getBranchInventory

_Route Definition_ : Get a branch&#39;s inventory record for a book.

_Route Type_ : get

_Default access route_ : _GET_ `/branchinventories/:branchInventoryId`

#### Parameters

The getBranchInventory api has got 1 parameter

| Parameter         | Type | Required | Population                        |
| ----------------- | ---- | -------- | --------------------------------- |
| branchInventoryId | ID   | true     | request.params?.branchInventoryId |

To access the api you can use the **REST** controller with the path **GET /branchinventories/:branchInventoryId**

```js
axios({
  method: "GET",
  url: `/branchinventories/${branchInventoryId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`branchInventory`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "branchInventory",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "branchInventory": { "id": "ID", "isActive": true }
}
```

### Route: createBranchInventory

_Route Definition_ : Create branch inventory record for a book.

_Route Type_ : create

_Default access route_ : _POST_ `/branchinventories`

#### Parameters

The createBranchInventory api has got 6 parameters

| Parameter          | Type    | Required | Population                       |
| ------------------ | ------- | -------- | -------------------------------- |
| bookId             | ID      | true     | request.body?.bookId             |
| branchId           | ID      | true     | request.body?.branchId           |
| totalCopies        | Integer | true     | request.body?.totalCopies        |
| availableCopies    | Integer | true     | request.body?.availableCopies    |
| localShelfLocation | String  | false    | request.body?.localShelfLocation |
| conditionNotes     | Text    | false    | request.body?.conditionNotes     |

To access the api you can use the **REST** controller with the path **POST /branchinventories**

```js
axios({
  method: "POST",
  url: "/branchinventories",
  data: {
    bookId: "ID",
    branchId: "ID",
    totalCopies: "Integer",
    availableCopies: "Integer",
    localShelfLocation: "String",
    conditionNotes: "Text",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`branchInventory`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "branchInventory",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "branchInventory": { "id": "ID", "isActive": true }
}
```

### Route: updateBranchInventory

_Route Definition_ : Update a branch inventory record (e.g. adjust totals, condition notes).

_Route Type_ : update

_Default access route_ : _PATCH_ `/branchinventories/:branchInventoryId`

#### Parameters

The updateBranchInventory api has got 5 parameters

| Parameter          | Type    | Required | Population                        |
| ------------------ | ------- | -------- | --------------------------------- |
| branchInventoryId  | ID      | true     | request.params?.branchInventoryId |
| totalCopies        | Integer | false    | request.body?.totalCopies         |
| availableCopies    | Integer | false    | request.body?.availableCopies     |
| localShelfLocation | String  | false    | request.body?.localShelfLocation  |
| conditionNotes     | Text    | false    | request.body?.conditionNotes      |

To access the api you can use the **REST** controller with the path **PATCH /branchinventories/:branchInventoryId**

```js
axios({
  method: "PATCH",
  url: `/branchinventories/${branchInventoryId}`,
  data: {
    totalCopies: "Integer",
    availableCopies: "Integer",
    localShelfLocation: "String",
    conditionNotes: "Text",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`branchInventory`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "branchInventory",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "branchInventory": { "id": "ID", "isActive": true }
}
```

### Route: deleteBranchInventory

_Route Definition_ : Delete a branch inventory record for a book+branch.

_Route Type_ : delete

_Default access route_ : _DELETE_ `/branchinventories/:branchInventoryId`

#### Parameters

The deleteBranchInventory api has got 1 parameter

| Parameter         | Type | Required | Population                        |
| ----------------- | ---- | -------- | --------------------------------- |
| branchInventoryId | ID   | true     | request.params?.branchInventoryId |

To access the api you can use the **REST** controller with the path **DELETE /branchinventories/:branchInventoryId**

```js
axios({
  method: "DELETE",
  url: `/branchinventories/${branchInventoryId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`branchInventory`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "branchInventory",
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "branchInventory": { "id": "ID", "isActive": false }
}
```

### Route: listBranchInventories

_Route Definition_ : List/search inventory records by branch, book, or advanced filters for holdings.

_Route Type_ : getList

_Default access route_ : _GET_ `/branchinventories`

The listBranchInventories api has got no parameters.

To access the api you can use the **REST** controller with the path **GET /branchinventories**

```js
axios({
  method: "GET",
  url: "/branchinventories",
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`branchInventories`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "branchInventories",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": "\"Number\"",
  "branchInventories": [{ "id": "ID", "isActive": true }, {}, {}],
  "paging": {
    "pageNumber": "Number",
    "pageRowCount": "NUmber",
    "totalRowCount": "Number",
    "pageCount": "Number"
  },
  "filters": [],
  "uiPermissions": []
}
```

### Route: getInventoryAuditLog

_Route Definition_ : Get single audit log entry by id.

_Route Type_ : get

_Default access route_ : _GET_ `/inventoryauditlogs/:inventoryAuditLogId`

#### Parameters

The getInventoryAuditLog api has got 1 parameter

| Parameter           | Type | Required | Population                          |
| ------------------- | ---- | -------- | ----------------------------------- |
| inventoryAuditLogId | ID   | true     | request.params?.inventoryAuditLogId |

To access the api you can use the **REST** controller with the path **GET /inventoryauditlogs/:inventoryAuditLogId**

```js
axios({
  method: "GET",
  url: `/inventoryauditlogs/${inventoryAuditLogId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`inventoryAuditLog`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "inventoryAuditLog",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "inventoryAuditLog": { "id": "ID", "isActive": true }
}
```

### Route: createInventoryAuditLog

_Route Definition_ : Create a new inventory audit/adjustment/discrepancy log entry.

_Route Type_ : create

_Default access route_ : _POST_ `/inventoryauditlogs`

#### Parameters

The createInventoryAuditLog api has got 5 parameters

| Parameter         | Type    | Required | Population                      |
| ----------------- | ------- | -------- | ------------------------------- |
| branchId          | ID      | true     | request.body?.branchId          |
| branchInventoryId | ID      | true     | request.body?.branchInventoryId |
| auditType         | Enum    | true     | request.body?.auditType         |
| detailNote        | Text    | false    | request.body?.detailNote        |
| adjustmentValue   | Integer | false    | request.body?.adjustmentValue   |

To access the api you can use the **REST** controller with the path **POST /inventoryauditlogs**

```js
axios({
  method: "POST",
  url: "/inventoryauditlogs",
  data: {
    branchId: "ID",
    branchInventoryId: "ID",
    auditType: "Enum",
    detailNote: "Text",
    adjustmentValue: "Integer",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`inventoryAuditLog`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "inventoryAuditLog",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "inventoryAuditLog": { "id": "ID", "isActive": true }
}
```

### Route: updateInventoryAuditLog

_Route Definition_ : Update an inventory audit/adjustment log entry (only editable fields).

_Route Type_ : update

_Default access route_ : _PATCH_ `/inventoryauditlogs/:inventoryAuditLogId`

#### Parameters

The updateInventoryAuditLog api has got 4 parameters

| Parameter           | Type    | Required | Population                          |
| ------------------- | ------- | -------- | ----------------------------------- |
| inventoryAuditLogId | ID      | true     | request.params?.inventoryAuditLogId |
| auditType           | Enum    | false    | request.body?.auditType             |
| detailNote          | Text    | false    | request.body?.detailNote            |
| adjustmentValue     | Integer | false    | request.body?.adjustmentValue       |

To access the api you can use the **REST** controller with the path **PATCH /inventoryauditlogs/:inventoryAuditLogId**

```js
axios({
  method: "PATCH",
  url: `/inventoryauditlogs/${inventoryAuditLogId}`,
  data: {
    auditType: "Enum",
    detailNote: "Text",
    adjustmentValue: "Integer",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`inventoryAuditLog`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "inventoryAuditLog",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "inventoryAuditLog": { "id": "ID", "isActive": true }
}
```

### Route: deleteInventoryAuditLog

_Route Definition_ : Delete an inventory audit log entry.

_Route Type_ : delete

_Default access route_ : _DELETE_ `/inventoryauditlogs/:inventoryAuditLogId`

#### Parameters

The deleteInventoryAuditLog api has got 1 parameter

| Parameter           | Type | Required | Population                          |
| ------------------- | ---- | -------- | ----------------------------------- |
| inventoryAuditLogId | ID   | true     | request.params?.inventoryAuditLogId |

To access the api you can use the **REST** controller with the path **DELETE /inventoryauditlogs/:inventoryAuditLogId**

```js
axios({
  method: "DELETE",
  url: `/inventoryauditlogs/${inventoryAuditLogId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`inventoryAuditLog`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "inventoryAuditLog",
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "inventoryAuditLog": { "id": "ID", "isActive": false }
}
```

### Route: listInventoryAuditLogs

_Route Definition_ : List/search inventory audit or discrepancy log entries by branch, inventory, or type.

_Route Type_ : getList

_Default access route_ : _GET_ `/inventoryauditlogs`

The listInventoryAuditLogs api has got no parameters.

To access the api you can use the **REST** controller with the path **GET /inventoryauditlogs**

```js
axios({
  method: "GET",
  url: "/inventoryauditlogs",
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`inventoryAuditLogs`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "inventoryAuditLogs",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": "\"Number\"",
  "inventoryAuditLogs": [{ "id": "ID", "isActive": true }, {}, {}],
  "paging": {
    "pageNumber": "Number",
    "pageRowCount": "NUmber",
    "totalRowCount": "Number",
    "pageCount": "Number"
  },
  "filters": [],
  "uiPermissions": []
}
```

### Route: getInterBranchTransfer

_Route Definition_ : Get a book&#39;s inter-branch transfer record.

_Route Type_ : get

_Default access route_ : _GET_ `/interbranchtransfers/:interBranchTransferId`

#### Parameters

The getInterBranchTransfer api has got 1 parameter

| Parameter             | Type | Required | Population                            |
| --------------------- | ---- | -------- | ------------------------------------- |
| interBranchTransferId | ID   | true     | request.params?.interBranchTransferId |

To access the api you can use the **REST** controller with the path **GET /interbranchtransfers/:interBranchTransferId**

```js
axios({
  method: "GET",
  url: `/interbranchtransfers/${interBranchTransferId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`interBranchTransfer`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "interBranchTransfer",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "interBranchTransfer": { "id": "ID", "isActive": true }
}
```

### Route: createInterBranchTransfer

_Route Definition_ : Create a new inter-branch transfer workflow entry.

_Route Type_ : create

_Default access route_ : _POST_ `/interbranchtransfers`

#### Parameters

The createInterBranchTransfer api has got 6 parameters

| Parameter      | Type    | Required | Population                   |
| -------------- | ------- | -------- | ---------------------------- |
| bookId         | ID      | true     | request.body?.bookId         |
| sourceBranchId | ID      | true     | request.body?.sourceBranchId |
| destBranchId   | ID      | true     | request.body?.destBranchId   |
| quantity       | Integer | true     | request.body?.quantity       |
| status         | Enum    | true     | request.body?.status         |
| transferLog    | Object  | false    | request.body?.transferLog    |

To access the api you can use the **REST** controller with the path **POST /interbranchtransfers**

```js
axios({
  method: "POST",
  url: "/interbranchtransfers",
  data: {
    bookId: "ID",
    sourceBranchId: "ID",
    destBranchId: "ID",
    quantity: "Integer",
    status: "Enum",
    transferLog: "Object",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`interBranchTransfer`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "interBranchTransfer",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "interBranchTransfer": { "id": "ID", "isActive": true }
}
```

### Route: updateInterBranchTransfer

_Route Definition_ : Update status or log of an inter-branch transfer record (status workflow steps, notes, log).

_Route Type_ : update

_Default access route_ : _PATCH_ `/interbranchtransfers/:interBranchTransferId`

#### Parameters

The updateInterBranchTransfer api has got 3 parameters

| Parameter             | Type   | Required | Population                            |
| --------------------- | ------ | -------- | ------------------------------------- |
| interBranchTransferId | ID     | true     | request.params?.interBranchTransferId |
| status                | Enum   | false    | request.body?.status                  |
| transferLog           | Object | false    | request.body?.transferLog             |

To access the api you can use the **REST** controller with the path **PATCH /interbranchtransfers/:interBranchTransferId**

```js
axios({
  method: "PATCH",
  url: `/interbranchtransfers/${interBranchTransferId}`,
  data: {
    status: "Enum",
    transferLog: "Object",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`interBranchTransfer`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "interBranchTransfer",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "interBranchTransfer": { "id": "ID", "isActive": true }
}
```

### Route: deleteInterBranchTransfer

_Route Definition_ : Delete an inter-branch transfer record.

_Route Type_ : delete

_Default access route_ : _DELETE_ `/interbranchtransfers/:interBranchTransferId`

#### Parameters

The deleteInterBranchTransfer api has got 1 parameter

| Parameter             | Type | Required | Population                            |
| --------------------- | ---- | -------- | ------------------------------------- |
| interBranchTransferId | ID   | true     | request.params?.interBranchTransferId |

To access the api you can use the **REST** controller with the path **DELETE /interbranchtransfers/:interBranchTransferId**

```js
axios({
  method: "DELETE",
  url: `/interbranchtransfers/${interBranchTransferId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`interBranchTransfer`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "interBranchTransfer",
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "interBranchTransfer": { "id": "ID", "isActive": false }
}
```

### Route: listInterBranchTransfers

_Route Definition_ : List/search inter-branch book transfer records (by branch, book, status).

_Route Type_ : getList

_Default access route_ : _GET_ `/interbranchtransfers`

The listInterBranchTransfers api has got no parameters.

To access the api you can use the **REST** controller with the path **GET /interbranchtransfers**

```js
axios({
  method: "GET",
  url: "/interbranchtransfers",
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`interBranchTransfers`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "interBranchTransfers",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": "\"Number\"",
  "interBranchTransfers": [{ "id": "ID", "isActive": true }, {}, {}],
  "paging": {
    "pageNumber": "Number",
    "pageRowCount": "NUmber",
    "totalRowCount": "Number",
    "pageCount": "Number"
  },
  "filters": [],
  "uiPermissions": []
}
```

### Route: getPurchaseOrder

_Route Definition_ : Get a branch&#39;s purchase/acquisition order entry.

_Route Type_ : get

_Default access route_ : _GET_ `/purchaseorders/:purchaseOrderId`

#### Parameters

The getPurchaseOrder api has got 1 parameter

| Parameter       | Type | Required | Population                      |
| --------------- | ---- | -------- | ------------------------------- |
| purchaseOrderId | ID   | true     | request.params?.purchaseOrderId |

To access the api you can use the **REST** controller with the path **GET /purchaseorders/:purchaseOrderId**

```js
axios({
  method: "GET",
  url: `/purchaseorders/${purchaseOrderId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`purchaseOrder`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "purchaseOrder",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "purchaseOrder": { "id": "ID", "isActive": true }
}
```

### Route: createPurchaseOrder

_Route Definition_ : Create a new purchase/acquisition order for library holdings.

_Route Type_ : create

_Default access route_ : _POST_ `/purchaseorders`

#### Parameters

The createPurchaseOrder api has got 4 parameters

| Parameter     | Type   | Required | Population                  |
| ------------- | ------ | -------- | --------------------------- |
| branchId      | ID     | true     | request.body?.branchId      |
| itemRequests  | Object | true     | request.body?.itemRequests  |
| status        | Enum   | true     | request.body?.status        |
| approvalNotes | Text   | false    | request.body?.approvalNotes |

To access the api you can use the **REST** controller with the path **POST /purchaseorders**

```js
axios({
  method: "POST",
  url: "/purchaseorders",
  data: {
    branchId: "ID",
    itemRequests: "Object",
    status: "Enum",
    approvalNotes: "Text",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`purchaseOrder`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "purchaseOrder",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "purchaseOrder": { "id": "ID", "isActive": true }
}
```

### Route: updatePurchaseOrder

_Route Definition_ : Update status, fulfillment, or approval notes of a branch purchase order.

_Route Type_ : update

_Default access route_ : _PATCH_ `/purchaseorders/:purchaseOrderId`

#### Parameters

The updatePurchaseOrder api has got 4 parameters

| Parameter       | Type   | Required | Population                      |
| --------------- | ------ | -------- | ------------------------------- |
| purchaseOrderId | ID     | true     | request.params?.purchaseOrderId |
| itemRequests    | Object | false    | request.body?.itemRequests      |
| status          | Enum   | false    | request.body?.status            |
| approvalNotes   | Text   | false    | request.body?.approvalNotes     |

To access the api you can use the **REST** controller with the path **PATCH /purchaseorders/:purchaseOrderId**

```js
axios({
  method: "PATCH",
  url: `/purchaseorders/${purchaseOrderId}`,
  data: {
    itemRequests: "Object",
    status: "Enum",
    approvalNotes: "Text",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`purchaseOrder`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "purchaseOrder",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "purchaseOrder": { "id": "ID", "isActive": true }
}
```

### Route: deletePurchaseOrder

_Route Definition_ : Delete a purchase order record.

_Route Type_ : delete

_Default access route_ : _DELETE_ `/purchaseorders/:purchaseOrderId`

#### Parameters

The deletePurchaseOrder api has got 1 parameter

| Parameter       | Type | Required | Population                      |
| --------------- | ---- | -------- | ------------------------------- |
| purchaseOrderId | ID   | true     | request.params?.purchaseOrderId |

To access the api you can use the **REST** controller with the path **DELETE /purchaseorders/:purchaseOrderId**

```js
axios({
  method: "DELETE",
  url: `/purchaseorders/${purchaseOrderId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`purchaseOrder`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "purchaseOrder",
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "purchaseOrder": { "id": "ID", "isActive": false }
}
```

### Route: listPurchaseOrders

_Route Definition_ : List/search branch purchase/acquisition order records (by branch, status).

_Route Type_ : getList

_Default access route_ : _GET_ `/purchaseorders`

The listPurchaseOrders api has got no parameters.

To access the api you can use the **REST** controller with the path **GET /purchaseorders**

```js
axios({
  method: "GET",
  url: "/purchaseorders",
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`purchaseOrders`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "purchaseOrders",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": "\"Number\"",
  "purchaseOrders": [{ "id": "ID", "isActive": true }, {}, {}],
  "paging": {
    "pageNumber": "Number",
    "pageRowCount": "NUmber",
    "totalRowCount": "Number",
    "pageCount": "Number"
  },
  "filters": [],
  "uiPermissions": []
}
```

### Authentication Specific Routes

### Common Routes

### Route: currentuser

_Route Definition_: Retrieves the currently authenticated user's session information.

_Route Type_: sessionInfo

_Access Route_: `GET /currentuser`

#### Parameters

This route does **not** require any request parameters.

#### Behavior

- Returns the authenticated session object associated with the current access token.
- If no valid session exists, responds with a 401 Unauthorized.

```js
// Sample GET /currentuser call
axios.get("/currentuser", {
  headers: {
    Authorization: "Bearer your-jwt-token",
  },
});
```

**Success Response**
Returns the session object, including user-related data and token information.

```
{
  "sessionId": "9cf23fa8-07d4-4e7c-80a6-ec6d6ac96bb9",
  "userId": "d92b9d4c-9b1e-4e95-842e-3fb9c8c1df38",
  "email": "user@example.com",
  "fullname": "John Doe",
  "roleId": "user",
  "tenantId": "abc123",
  "accessToken": "jwt-token-string",
  ...
}
```

**Error Response**
**401 Unauthorized:** No active session found.

```
{
  "status": "ERR",
  "message": "No login found"
}
```

**Notes**

- This route is typically used by frontend or mobile applications to fetch the current session state after login.
- The returned session includes key user identity fields, tenant information (if applicable), and the access token for further authenticated requests.
- Always ensure a valid access token is provided in the request to retrieve the session.

### Route: permissions

`*Route Definition*`: Retrieves all effective permission records assigned to the currently authenticated user.

`*Route Type*`: permissionFetch

_Access Route_: `GET /permissions`

#### Parameters

This route does **not** require any request parameters.

#### Behavior

- Fetches all active permission records (`givenPermissions` entries) associated with the current user session.
- Returns a full array of permission objects.
- Requires a valid session (`access token`) to be available.

```js
// Sample GET /permissions call
axios.get("/permissions", {
  headers: {
    Authorization: "Bearer your-jwt-token",
  },
});
```

**Success Response**

Returns an array of permission objects.

```json
[
  {
    "id": "perm1",
    "permissionName": "adminPanel.access",
    "roleId": "admin",
    "subjectUserId": "d92b9d4c-9b1e-4e95-842e-3fb9c8c1df38",
    "subjectUserGroupId": null,
    "objectId": null,
    "canDo": true,
    "tenantCodename": "store123"
  },
  {
    "id": "perm2",
    "permissionName": "orders.manage",
    "roleId": null,
    "subjectUserId": "d92b9d4c-9b1e-4e95-842e-3fb9c8c1df38",
    "subjectUserGroupId": null,
    "objectId": null,
    "canDo": true,
    "tenantCodename": "store123"
  }
]
```

Each object reflects a single permission grant, aligned with the givenPermissions model:

- `**permissionName**`: The permission the user has.
- `**roleId**`: If the permission was granted through a role. -` **subjectUserId**`: If directly granted to the user.
- `**subjectUserGroupId**`: If granted through a group.
- `**objectId**`: If tied to a specific object (OBAC).
- `**canDo**`: True or false flag to represent if permission is active or restricted.

**Error Responses**

- **401 Unauthorized**: No active session found.

```json
{
  "status": "ERR",
  "message": "No login found"
}
```

- **500 Internal Server Error**: Unexpected error fetching permissions.

**Notes**

- The /permissions route is available across all backend services generated by Mindbricks, not just the auth service.
- Auth service: Fetches permissions freshly from the live database (givenPermissions table).
- Other services: Typically use a cached or projected view of permissions stored in a common ElasticSearch store, optimized for faster authorization checks.

> **Tip**:
> Applications can cache permission results client-side or server-side, but should occasionally refresh by calling this endpoint, especially after login or permission-changing operations.

### Route: permissions/:permissionName

_Route Definition_: Checks whether the current user has access to a specific permission, and provides a list of scoped object exceptions or inclusions.

_Route Type_: permissionScopeCheck

_Access Route_: `GET /permissions/:permissionName`

#### Parameters

| Parameter      | Type   | Required | Population                      |
| -------------- | ------ | -------- | ------------------------------- |
| permissionName | String | Yes      | `request.params.permissionName` |

#### Behavior

- Evaluates whether the current user **has access** to the given `permissionName`.
- Returns a structured object indicating:
  - Whether the permission is generally granted (`canDo`)
  - Which object IDs are explicitly included or excluded from access (`exceptions`)
- Requires a valid session (`access token`).

```js
// Sample GET /permissions/orders.manage
axios.get("/permissions/orders.manage", {
  headers: {
    Authorization: "Bearer your-jwt-token",
  },
});
```

**Success Response**

```json
{
  "canDo": true,
  "exceptions": [
    "a1f2e3d4-xxxx-yyyy-zzzz-object1",
    "b2c3d4e5-xxxx-yyyy-zzzz-object2"
  ]
}
```

- If `canDo` is `true`, the user generally has the permission, but not for the objects listed in `exceptions` (i.e., restrictions).
- If `canDo` is `false`, the user does not have the permission by default — but only for the objects in `exceptions`, they do have permission (i.e., selective overrides).
- The exceptions array contains valid **UUID strings**, each corresponding to an object ID (typically from the data model targeted by the permission).

## Copyright

All sources, documents and other digital materials are copyright of .

## About Us

For more information please visit our website: .

.
.
