const amazonS3Client = require("./amazonS3");

const clients = {};

const clientConstructors = {
  amazonS3: () => {
    new amazonS3Client({
      accessKeyId: "sample_accessKeyId",
      secretAccessKey: process.env.AWS_SECRET_KEY,
      region: "eu-west-1",
    });
  },
};

const createClient = async (provider) => {
  return clientConstructors[provider]();
};

const getIntegrationClient = async (provider) => {
  clients[provider] = clients[provider] || (await createClient(provider));
  return clients[provider];
};

module.exports = getIntegrationClient;
