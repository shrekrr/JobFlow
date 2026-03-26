require("dotenv").config();

const azureConfig = {
  endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  deployment: process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o",
  apiVersion: process.env.AZURE_OPENAI_API_VERSION || "2024-08-01-preview",
};

function getCompletionUrl() {
  return `${azureConfig.endpoint}/openai/deployments/${azureConfig.deployment}/chat/completions?api-version=${azureConfig.apiVersion}`;
}

module.exports = { azureConfig, getCompletionUrl };