import importlib.util
spec = importlib.util.spec_from_file_location("secrets", "./secrets.py")
secrets = importlib.util.module_from_spec(spec)
spec.loader.exec_module(secrets)

from django.shortcuts import redirect
from requests.auth import HTTPBasicAuth
from django.views import View

from django.http import HttpResponse, JsonResponse
from django.template import loader

import requests
import base64
import urllib
import json

#################### CLIENT KEYS ####################

CLIENT_ID = secrets.SPOTIPY_CLIENT_ID
CLIENT_SECRET = secrets.SPOTIPY_CLIENT_SECRET

#################### SPOTIFY URLS ####################

SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize"
SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token"
SPOTIFY_API_BASE_URL = "https://api.spotify.com"
API_VERSION = "v1"
SPOTIFY_API_URL = "{}/{}".format(SPOTIFY_API_BASE_URL, API_VERSION)

#################### Server-side Parameters ####################

CLIENT_SIDE_URL = "http://127.0.0.1"
PORT = 3000
REDIRECT_URI = "{}:{}/playlists/".format(CLIENT_SIDE_URL, PORT)
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

#######################################################################
#################### PROMPT USER FOR AUTHORIZATION ####################
#######################################################################

def auth(self):

    #################### Spotify Authorization Code Flow - Step 1: Authorization ####################

    url_args = "&".join(["{}={}".format(key,urllib.parse.quote(val)) for key,val in auth_query_parameters.items()])
    print('-------------------- url_args --------------------\n', url_args)
    auth_url = "{}/?{}".format(SPOTIFY_AUTH_URL, url_args)
    print('-------------------- auth_url --------------------\n', auth_url)
    return redirect(auth_url)

#####################################################################################
################# REQUEST/REFRESH/SEND BACK TOKENS - GET PLAYLISTS ##################
#####################################################################################

def get_tokens(request):

    #################### Spotify Authorization Code Flow - Step 4: Requests Refresh and Access Tokens ####################

	auth_token = request.GET.get('code')
	print('-------------------- auth_token --------------------\n', auth_token)

	code_payload = {
		'grant_type': 'authorization_code',
		'code': str(auth_token),
		'redirect_uri': REDIRECT_URI,
	}
	print('-------------------- code_payload --------------------\n', code_payload)

	auth_str = bytes('{}:{}'.format(CLIENT_ID, CLIENT_SECRET), 'utf-8')
	b64_auth_str = base64.b64encode(auth_str).decode('utf-8')

	headers = {'Authorization': 'Basic {}'.format(b64_auth_str)}

	post_request = requests.post(SPOTIFY_TOKEN_URL, data=code_payload, headers=headers)

    #################### Spotify Authorization Code Flow - Step 5: Tokens are Returned to Application ####################

	response_data = json.loads(post_request.text)

	access_token = response_data["access_token"]
	refresh_token = response_data["refresh_token"]
	token_type = response_data["token_type"]
	expires_in = response_data["expires_in"]

	return JsonResponse({
		'Content-Type': 'application/json',
		'status': 200,
		'data': response_data
	}, safe=False)


def get_playlists(request):

	auth_token = request.GET.get('access_token')

    #################### Spotify Authorization Code Flow - Step 6: Use the Access Token to Access Spotify API ####################

	authorization_header = {"Authorization":"Bearer {}".format(access_token)}

	print('-------------------- authorization_header --------------------\n', authorization_header)

    #################### Get Profile Data ####################

	user_profile_api_endpoint = "{}/me".format(SPOTIFY_API_URL)

	profile_response = requests.get(user_profile_api_endpoint, headers=authorization_header)
	profile_data = json.loads(profile_response.text)

    #################### Get User Playlist Data ####################

	playlist_api_endpoint = "{}/playlists".format(profile_data["href"])
	playlists_response = requests.get(playlist_api_endpoint, headers=authorization_header)
	playlist_data = json.loads(playlists_response.text)

    #################### Combine Profile and Playlist Data to Display ####################

	# display_arr = [profile_data] + playlist_data["items"]

	print('-------------------- playlist_data -------------------- \n', playlist_data)

	return JsonResponse({
		'Content-Type': 'application/json',
		'status': 200,
		'data': playlist_data
		}, safe=False)










