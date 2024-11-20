const axios = require('axios');
const { ClientCredentials } = require('simple-oauth2');

// Can be any API url from https://www.mongodb.com/docs/atlas/reference/api-resources-spec/v2/
const apiURL = '/api/atlas/v2/';

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
    tokenPath: '/api/oauth/token',
  },
};

// Create OAuth2 Client
const oauth2Client = new ClientCredentials(oauth2Config);

async function fetchWithOAuth2() {
  try {
    // Retrieve access token
    const tokenParams = {
    };
    const tokenResponse = await oauth2Client.getToken(tokenParams);
    const accessToken = tokenResponse.token.access_token;
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.atlas.2023-01-01+json',
      "User-Agent": "SA-Auth-Example"
    }
    // Make API Request
    const response = await axios.get(baseUrl + apiURL, {
      headers: headers
    });

    console.log('Response data:', response.data);
  } catch (error) {
    console.error('Error during request:', error.message);
  }
}

fetchWithOAuth2();
