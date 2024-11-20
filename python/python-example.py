import os
from requests_oauthlib import OAuth2Session
from pprint import pprint

# Constants
# trunk-ignore(bandit/B105)
token_url = "/api/oauth/token"
api_url = "/api/atlas/v2/"
client_id = os.environ["MONGODB_ATLAS_CLIENT_ID"]
client_secret = os.environ["MONGODB_ATLAS_CLIENT_SECRET"]

# Base URL for MongoDB Atlas (can be overridden by environment variable)
base_url = os.getenv("MONGODB_ATLAS_BASE_URL", "https://cloud.mongodb.com")

# Setup OAuth2 session
def get_oauth2_session():
    # OAuth2Session handles token fetching and refreshing
    session = OAuth2Session(client_id=client_id)
    session.fetch_token(
        token_url=base_url+token_url,
        client_id=client_id,
        client_secret=client_secret,
        grant_type="client_credentials"
    )

    return session

# Fetch data from Atlas API
def fetch_data():
    session = get_oauth2_session()  # This now includes the token in the session
    headers = {
        'Accept': 'application/vnd.atlas.2023-01-01+json'  # Update date to desired API version
    }
    # `session.get()` automatically sends the access token
    response = session.get(base_url + api_url, headers=headers)
    response.raise_for_status()  # Raise error for bad responses
    return response.json()

if __name__ == "__main__":
    try:
        data = fetch_data()
        pprint(data)
    except Exception as e:
        print(f"Error: {e}")
