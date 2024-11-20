import os
from requests_oauthlib import OAuth2Session
import requests

# Constants
token_path = "/api/oauth/token"
api_url = "/api/atlas/v2/"
client_id = os.environ["MONGODB_ATLAS_CLIENT_ID"]
client_secret = os.environ["MONGODB_ATLAS_CLIENT_SECRET"]
base_url = os.getenv("MONGODB_ATLAS_BASE_URL", "https://cloud.mongodb.com")

def get_access_token():
    oauth = OAuth2Session(client_id=client_id)
    token_url = f"{base_url}{token_path}"
    token = oauth.fetch_token(
        token_url=token_url,
        client_id=client_id,
        client_secret=client_secret,
        grant_type="client_credentials"
    )
    return token['access_token']

def fetch_data():
    access_token = get_access_token()
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Accept": "application/vnd.atlas.2023-01-01+json"
    }

    response = requests.get(f"{base_url}{api_url}", headers=headers)
    response.raise_for_status()

    return response.json()

if __name__ == "__main__":
    try:
        data = fetch_data()
        print(data)
    except Exception as e:
        print(f"Error: {e}")
