import importlib.util
spec = importlib.util.spec_from_file_location("secrets", "./secrets.py")
secrets = importlib.util.module_from_spec(spec)
spec.loader.exec_module(secrets)

from django.shortcuts import redirect
from requests.auth import HTTPBasicAuth
import requests
import base64
import urllib
import json
# import six


# Client Keys
CLIENT_ID = secrets.SPOTIPY_CLIENT_ID
CLIENT_SECRET = secrets.SPOTIPY_CLIENT_SECRET

# Spotify URLS
SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize"
SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token"
SPOTIFY_API_BASE_URL = "https://api.spotify.com"
API_VERSION = "v1"
SPOTIFY_API_URL = "{}/{}".format(SPOTIFY_API_BASE_URL, API_VERSION)


# Server-side Parameters
CLIENT_SIDE_URL = "http://127.0.0.1"
PORT = 8000
REDIRECT_URI = "{}:{}/callback/q/".format(CLIENT_SIDE_URL, PORT)
SCOPE = "playlist-modify-public playlist-modify-private"
STATE = ""
SHOW_DIALOG_bool = True
SHOW_DIALOG_str = str(SHOW_DIALOG_bool).lower()


auth_query_parameters = {
    "response_type": "code",
    "redirect_uri": REDIRECT_URI,
    "scope": SCOPE,
    "state": STATE,
    "show_dialog": SHOW_DIALOG_str,
    "client_id": CLIENT_ID
}


def index(self):
    # Auth Step 1: Authorization
    url_args = "&".join(["{}={}".format(key,urllib.parse.quote(val)) for key,val in auth_query_parameters.items()])
    print('-------------------- url_args --------------------\n', url_args)
    auth_url = "{}/?{}".format(SPOTIFY_AUTH_URL, url_args)
    print('-------------------- auth_url --------------------\n', auth_url)
    return redirect(auth_url)


def callback(request):

	print('-------------------- beginning of callback --------------------')

	# Auth Step 4: Requests refresh and access tokens
	auth_token = request.GET.get('code')
	# auth_token = request.args['code']

	print('-------------------- auth_token --------------------\n', auth_token)
	print('-------------------- CLIENT_ID --------------------\n', CLIENT_ID)
	code_payload = {
		'grant_type': 'authorization_code',
		'code': str(auth_token),
		'redirect_uri': REDIRECT_URI,
		# 'client_id': CLIENT_ID,
		# 'client_secret': CLIENT_SECRET
	}

	print('-------------------- code_payload --------------------\n', code_payload)


	# auth_header = base64.b64encode(six.text_type(CLIENT_ID + ':' + CLIENT_SECRET).encode('ascii'))
	# headers = {'Authorization': 'Basic %s' % auth_header.decode('ascii')}

	# auth = {
	# 	'client_id': CLIENT_ID,
	# 	'client_secret': CLIENT_SECRET
	# }

	# auth = {CLIENT_ID, CLIENT_SECRET}

	auth_str = '{}:{}'.format(CLIENT_ID, CLIENT_SECRET)
	b64_auth_str = base64.b64encode(auth_str.encode()).decode()

	print('-------------------- b64_auth_str --------------------\n', b64_auth_str)


	headers = {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Authorization': 'Basic {}'.format(b64_auth_str)
	}

	# print('-------------------- headers --------------------\n', headers)

	# post_request = requests.post(SPOTIFY_TOKEN_URL, data=code_payload, headers=headers)
	post_request = requests.post(SPOTIFY_TOKEN_URL, data=code_payload)

	print('-------------------- post_request --------------------\n', post_request)

	# Auth Step 5: Tokens are Returned to Application
	response_data = json.loads(post_request.text)
	print('-------------------- response_data --------------------\n', response_data)

	access_token = response_data["access_token"]
	refresh_token = response_data["refresh_token"]
	token_type = response_data["token_type"]
	expires_in = response_data["expires_in"]

	# Auth Step 6: Use the access token to access Spotify API
	authorization_header = {"Authorization":"Bearer {}".format(access_token)}

	# Get profile data
	user_profile_api_endpoint = "{}/me".format(SPOTIFY_API_URL)
	profile_response = requests.get(user_profile_api_endpoint, headers=authorization_header, catch_response=True)
	profile_data = json.loads(profile_response.text)

	# Get user playlist data
	playlist_api_endpoint = "{}/playlists".format(profile_data["href"])
	playlists_response = requests.get(playlist_api_endpoint, headers=authorization_header, catch_response=True)
	playlist_data = json.loads(playlists_response.text)

	# Combine profile and playlist data to display
	display_arr = [profile_data] + playlist_data["items"]
	return render_template("spotify_index.html",sorted_array=display_arr)