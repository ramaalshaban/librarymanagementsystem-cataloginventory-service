const AWS = require("aws-sdk");

// Reusable enums
const REGION_OPTIONS = [
  "us-east-1",
  "us-east-2",
  "us-west-1",
  "us-west-2",
  "eu-west-1",
  "eu-west-2",
  "eu-west-3",
  "eu-central-1",
  "ap-northeast-1",
  "ap-northeast-2",
  "ap-southeast-1",
  "ap-southeast-2",
  "ap-south-1",
  "sa-east-1",
];

const ACL_OPTIONS = [
  "private",
  "public-read",
  "public-read-write",
  "authenticated-read",
  "aws-exec-read",
  "bucket-owner-read",
  "bucket-owner-full-control",
];

const STORAGE_CLASS_OPTIONS = [
  "STANDARD",
  "REDUCED_REDUNDANCY",
  "STANDARD_IA",
  "ONEZONE_IA",
  "INTELLIGENT_TIERING",
  "GLACIER",
  "DEEP_ARCHIVE",
  "OUTPOSTS",
];

const OBJECT_LOCK_MODE_OPTIONS = ["GOVERNANCE", "COMPLIANCE"];

/**
 * A Node.js client for AWS S3. Enables uploading, downloading, listing,
 * and managing files and buckets using AWS SDK with simple credentials.
 * @class
 * @label AWS S3
 * @icon https://cdn.iconscout.com/icon/free/png-256/aws-1869025-1583149.png
 * @className AwsS3ApiClient
 */
class AwsS3ApiClient {
  /**
   * @constructor
   * @param {string} config.accessKeyId — AWS access key ID for authentication
   * @param {string} config.secretAccessKey — AWS secret access key for authentication
   * @param {string} config.region — AWS region for S3 operations
   * @param {string} [config.sessionToken] — AWS session token for temporary credentials
   * @enumRef config.region REGION_OPTIONS
   */
  constructor(config) {
    this.s3 = new AWS.S3({
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
      region: config.region,
      sessionToken: config.sessionToken,
    });
  }

  /**
   * Creates a new S3 bucket in the specified region.
   * @function createBucket
   * @group Buckets
   * @label Create Bucket
   * @param {string} input.bucketName — Name for the new bucket
   * @param {string} [input.region] — AWS region for bucket creation
   * @param {string} [input.acl] — Access control list for bucket
   * @returns {Promise} Bucket creation confirmation with location
   * @enumRef input.region REGION_OPTIONS
   * @enumRef input.acl ACL_OPTIONS
   */
  async createBucket(input) {
    const params = {
      Bucket: input.bucketName,
      ACL: input.acl || "private",
    };

    if (input.region && input.region !== "us-east-1") {
      params.CreateBucketConfiguration = {
        LocationConstraint: input.region,
      };
    }

    return await this.s3.createBucket(params).promise();
  }

  /**
   * Deletes an S3 bucket (must be empty).
   * @function deleteBucket
   * @group Buckets
   * @label Delete Bucket
   * @param {string} input.bucketName — Name of the bucket to delete
   * @returns {Promise} Bucket deletion confirmation
   */
  async deleteBucket(input) {
    const params = {
      Bucket: input.bucketName,
    };

    return await this.s3.deleteBucket(params).promise();
  }

  /**
   * Lists all S3 buckets owned by the authenticated user.
   * @function listBuckets
   * @group Buckets
   * @label List Buckets
   * @returns {Promise} Array of bucket information objects
   */
  async listBuckets() {
    return await this.s3.listBuckets().promise();
  }

  /**
   * Gets bucket location and metadata information.
   * @function getBucket
   * @group Buckets
   * @label Get Bucket Info
   * @param {string} input.bucketName — Name of the bucket to retrieve
   * @returns {Promise} Bucket location and metadata
   */
  async getBucket(input) {
    const params = {
      Bucket: input.bucketName,
    };

    const [location, versioning, encryption] = await Promise.all([
      this.s3.getBucketLocation(params).promise(),
      this.s3
        .getBucketVersioning(params)
        .promise()
        .catch(() => null),
      this.s3
        .getBucketEncryption(params)
        .promise()
        .catch(() => null),
    ]);

    return { location, versioning, encryption };
  }

  /**
   * Uploads a file to S3 bucket with optional metadata.
   * @function uploadFile
   * @group Files
   * @label Upload File
   * @param {string} input.bucketName — Target bucket name
   * @param {string} input.key — Object key (file path) in bucket
   * @param {Buffer|Stream|string} input.body — File content to upload
   * @param {string} [input.contentType] — MIME type of the file
   * @param {string} [input.acl] — Access control list for the file
   * @param {string} [input.storageClass] — Storage class for the object
   * @param {Object} [input.metadata] — Custom metadata key-value pairs
   * @returns {Promise} Upload result with ETag and location
   * @enumRef input.acl ACL_OPTIONS
   * @enumRef input.storageClass STORAGE_CLASS_OPTIONS
   */
  async uploadFile(input) {
    const params = {
      Bucket: input.bucketName,
      Key: input.key,
      Body: input.body,
      ContentType: input.contentType,
      ACL: input.acl || "private",
      StorageClass: input.storageClass || "STANDARD",
      Metadata: input.metadata || {},
    };

    return await this.s3.upload(params).promise();
  }

  /**
   * Downloads a file from S3 bucket.
   * @function downloadFile
   * @group Files
   * @label Download File
   * @param {string} input.bucketName — Source bucket name
   * @param {string} input.key — Object key (file path) in bucket
   * @param {string} [input.versionId] — Specific version ID to download
   * @returns {Promise} File content and metadata
   */
  async downloadFile(input) {
    const params = {
      Bucket: input.bucketName,
      Key: input.key,
      VersionId: input.versionId,
    };

    return await this.s3.getObject(params).promise();
  }

  /**
   * Deletes a file from S3 bucket.
   * @function deleteFile
   * @group Files
   * @label Delete File
   * @param {string} input.bucketName — Source bucket name
   * @param {string} input.key — Object key (file path) to delete
   * @param {string} [input.versionId] — Specific version ID to delete
   * @returns {Promise} Deletion confirmation
   */
  async deleteFile(input) {
    const params = {
      Bucket: input.bucketName,
      Key: input.key,
      VersionId: input.versionId,
    };

    return await this.s3.deleteObject(params).promise();
  }

  /**
   * Lists objects in S3 bucket with optional filtering.
   * @function listFiles
   * @group Files
   * @label List Files
   * @param {string} input.bucketName — Bucket name to list objects from
   * @param {string} [input.prefix] — Filter objects by key prefix
   * @param {string} [input.delimiter] — Delimiter for grouping keys
   * @param {number} [input.maxKeys] — Maximum number of objects to return
   * @param {string} [input.continuationToken] — Token for pagination
   * @returns {Promise} List of objects with metadata
   */
  async listFiles(input) {
    const params = {
      Bucket: input.bucketName,
      Prefix: input.prefix,
      Delimiter: input.delimiter,
      MaxKeys: input.maxKeys || 1000,
      ContinuationToken: input.continuationToken,
    };

    return await this.s3.listObjectsV2(params).promise();
  }

  /**
   * Gets metadata and properties of an S3 object.
   * @function getFileMetadata
   * @group Files
   * @label Get File Metadata
   * @param {string} input.bucketName — Bucket name containing the object
   * @param {string} input.key — Object key to get metadata for
   * @param {string} [input.versionId] — Specific version ID
   * @returns {Promise} Object metadata including size, modified date, etag
   */
  async getFileMetadata(input) {
    const params = {
      Bucket: input.bucketName,
      Key: input.key,
      VersionId: input.versionId,
    };

    return await this.s3.headObject(params).promise();
  }

  /**
   * Copies an object from one location to another within S3.
   * @function copyFile
   * @group Files
   * @label Copy File
   * @param {string} input.sourceBucket — Source bucket name
   * @param {string} input.sourceKey — Source object key
   * @param {string} input.destinationBucket — Destination bucket name
   * @param {string} input.destinationKey — Destination object key
   * @param {string} [input.acl] — Access control list for copied object
   * @returns {Promise} Copy operation result
   * @enumRef input.acl ACL_OPTIONS
   */
  async copyFile(input) {
    const params = {
      Bucket: input.destinationBucket,
      Key: input.destinationKey,
      CopySource: `${input.sourceBucket}/${input.sourceKey}`,
      ACL: input.acl,
    };

    return await this.s3.copyObject(params).promise();
  }

  /**
   * Generates a pre-signed URL for temporary access to S3 object.
   * @function getSignedUrl
   * @group Sharing
   * @label Generate Signed URL
   * @param {string} input.bucketName — Bucket name containing the object
   * @param {string} input.key — Object key to generate URL for
   * @param {string} input.operation — Operation type (getObject, putObject, deleteObject)
   * @param {number} [input.expires] — URL expiration time in seconds (default 3600)
   * @returns {Promise} Pre-signed URL string
   */
  async getSignedUrl(input) {
    const params = {
      Bucket: input.bucketName,
      Key: input.key,
      Expires: input.expires || 3600,
    };

    return this.s3.getSignedUrl(input.operation || "getObject", params);
  }

  /**
   * Sets access control list (ACL) permissions for an S3 object.
   * @function setFilePermissions
   * @group Permissions
   * @label Set File Permissions
   * @param {string} input.bucketName — Bucket name containing the object
   * @param {string} input.key — Object key to set permissions for
   * @param {string} input.acl — Access control list to apply
   * @returns {Promise} Permission update confirmation
   * @enumRef input.acl ACL_OPTIONS
   */
  async setFilePermissions(input) {
    const params = {
      Bucket: input.bucketName,
      Key: input.key,
      ACL: input.acl,
    };

    return await this.s3.putObjectAcl(params).promise();
  }

  /**
   * Gets access control list (ACL) permissions for an S3 object.
   * @function getFilePermissions
   * @group Permissions
   * @label Get File Permissions
   * @param {string} input.bucketName — Bucket name containing the object
   * @param {string} input.key — Object key to get permissions for
   * @returns {Promise} Current ACL permissions and grants
   */
  async getFilePermissions(input) {
    const params = {
      Bucket: input.bucketName,
      Key: input.key,
    };

    return await this.s3.getObjectAcl(params).promise();
  }

  /**
   * Sets bucket-level access control list (ACL) permissions.
   * @function setBucketPermissions
   * @group Permissions
   * @label Set Bucket Permissions
   * @param {string} input.bucketName — Bucket name to set permissions for
   * @param {string} input.acl — Access control list to apply
   * @returns {Promise} Permission update confirmation
   * @enumRef input.acl ACL_OPTIONS
   */
  async setBucketPermissions(input) {
    const params = {
      Bucket: input.bucketName,
      ACL: input.acl,
    };

    return await this.s3.putBucketAcl(params).promise();
  }

  /**
   * Deletes multiple objects from S3 bucket in a single request.
   * @function deleteMultipleFiles
   * @group Files
   * @label Delete Multiple Files
   * @param {string} input.bucketName — Bucket name containing objects
   * @param {Array} input.keys — Array of object keys to delete
   * @param {boolean} [input.quiet] — Suppress successful deletion responses
   * @returns {Promise} Deletion results for each object
   */
  async deleteMultipleFiles(input) {
    const objects = input.keys.map((key) => ({ Key: key }));

    const params = {
      Bucket: input.bucketName,
      Delete: {
        Objects: objects,
        Quiet: input.quiet || false,
      },
    };

    return await this.s3.deleteObjects(params).promise();
  }

  /**
   * Creates a folder-like structure by creating an empty object with trailing slash.
   * @function createFolder
   * @group Folders
   * @label Create Folder
   * @param {string} input.bucketName — Bucket name to create folder in
   * @param {string} input.folderName — Folder name (will add trailing slash)
   * @returns {Promise} Folder creation confirmation
   */
  async createFolder(input) {
    const key = input.folderName.endsWith("/")
      ? input.folderName
      : `${input.folderName}/`;

    const params = {
      Bucket: input.bucketName,
      Key: key,
      Body: "",
      ContentType: "application/x-directory",
    };

    return await this.s3.putObject(params).promise();
  }

  /**
   * Initiates multipart upload for large files.
   * @function initiateMultipartUpload
   * @group Files
   * @label Initiate Multipart Upload
   * @param {string} input.bucketName — Target bucket name
   * @param {string} input.key — Object key for the upload
   * @param {string} [input.contentType] — MIME type of the file
   * @param {string} [input.acl] — Access control list for the file
   * @returns {Promise} Upload ID and other initialization details
   * @enumRef input.acl ACL_OPTIONS
   */
  async initiateMultipartUpload(input) {
    const params = {
      Bucket: input.bucketName,
      Key: input.key,
      ContentType: input.contentType,
      ACL: input.acl || "private",
    };

    return await this.s3.createMultipartUpload(params).promise();
  }

  /**
   * Sets lifecycle configuration for automatic object management.
   * @function setBucketLifecycle
   * @group Buckets
   * @label Set Bucket Lifecycle
   * @param {string} input.bucketName — Bucket name to configure
   * @param {Array} input.rules — Lifecycle rules array
   * @returns {Promise} Lifecycle configuration confirmation
   */
  async setBucketLifecycle(input) {
    const params = {
      Bucket: input.bucketName,
      LifecycleConfiguration: {
        Rules: input.rules,
      },
    };

    return await this.s3.putBucketLifecycleConfiguration(params).promise();
  }
}

module.exports = AwsS3ApiClient;
