const axios = require('axios');
const { ClientCredentials } = require('simple-oauth2');

// Can be any API url from https://www.mongodb.com/docs/atlas/reference/api-resources-spec/v2/
const apiURL = 'https://cloud.mongodb.com/api/atlas/v2/';

const { MONGODB_ATLAS_CLIENT_ID, MONGODB_ATLAS_CLIENT_SECRET, MONGODB_ATLAS_BASE_URL} = process.env;

var baseUrl = "https://cloud.mongodb.com";

if(MONGODB_ATLAS_BASE_URL) {
  baseUrl = MONGODB_ATLAS_BASE_URL
}

// OAuth2 Client Configuration
const oauth2Config = {
  client: {
    id: MONGODB_ATLAS_CLIENT_ID,
    secret: MONGODB_ATLAS_CLIENT_SECRET,
  },
  auth: {
    tokenHost: baseUrl,
    tokenPath: '/oauth/token',
  },
};

console.log(oauth2Config);

// Create OAuth2 Client
const oauth2Client = new ClientCredentials(oauth2Config);

async function fetchWithOAuth2() {
  try {
    // Retrieve access token
    const tokenParams = {
    };
    const accessToken = await oauth2Client.getToken(tokenParams);

    // Make API Request
    const response = await axios.get(apiURL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.atlas.2023-01-01+json',
        "User-Agent": "SA-Auth-Example"
      },
    });

    console.log('Response data:', response.data);
  } catch (error) {
    console.error('Error during request:', error);
  }
}

fetchWithOAuth2();
