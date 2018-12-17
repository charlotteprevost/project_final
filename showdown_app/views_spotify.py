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

# CLIENT_SIDE_URL = "http://127.0.0.1"
# PORT = 3000
# REDIRECT_URI = "{}:{}/home/".format(CLIENT_SIDE_URL, PORT)
CLIENT_SIDE_URL = "https://show-down.herokuapp.com"
REDIRECT_URI = "{}/home/".format(CLIENT_SIDE_URL)
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

#####################################################################################
########################### PROMPT USER FOR AUTHORIZATION ###########################
#####################################################################################

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
	print('-------------------- request --------------------\n', request)

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

	print('-------------------- response_data --------------------\n', response_data)
	return JsonResponse({
		'Content-Type': 'application/json',
		'Accept': 'application/json',
		'status': 200,
		'data': response_data
	}, safe=False)


#####################################################################################
########################### GET SPOTIFY USER'S PLAYLISTS ############################
#####################################################################################

def get_playlists(request):

	access_token = request.GET.get('access_token')
	
    #################### Spotify Authorization Code Flow - Step 6: Use the Access Token to Access Spotify API ####################

	authorization_header = {"Authorization":"Bearer {}".format(access_token)}

    #################### Get Profile Data ####################

	user_profile_api_endpoint = "{}/me".format(SPOTIFY_API_URL)

	profile_response = requests.get(user_profile_api_endpoint, headers=authorization_header)
	profile_data = json.loads(profile_response.text)

    #################### Get User Playlist Data ####################

	playlist_api_endpoint = "{}/playlists/?limit=50".format(profile_data["href"])
	playlists_response = requests.get(playlist_api_endpoint, headers=authorization_header)
	playlist_data = json.loads(playlists_response.text)
	playlist_data = sorted(playlist_data["items"], key=lambda playlist: playlist["name"])

	return JsonResponse({
		'Content-Type': 'application/json',
		'Accept': 'application/json',
		'status': 200,
		'data': playlist_data
		}, safe=False)


#####################################################################################
########################## GET SPOTIFY USER PROFILE DETAILS #########################
#####################################################################################

def get_profile(request):

	access_token = request.GET.get('access_token')
	
    #################### Spotify Authorization Code Flow - Step 6: Use the Access Token to Access Spotify API ####################

	authorization_header = {"Authorization":"Bearer {}".format(access_token)}

    #################### Get Profile Data ####################

	user_profile_api_endpoint = "{}/me".format(SPOTIFY_API_URL)

	profile_response = requests.get(user_profile_api_endpoint, headers=authorization_header)
	profile_data = json.loads(profile_response.text)

	return JsonResponse({
		'Content-Type': 'application/json',
		'Accept': 'application/json',
		'status': 200,
		'data': profile_data
		}, safe=False)


#####################################################################################
############################# GET USER PLAYLISTS TRACKS #############################
#####################################################################################

def playlists_tracks(request):

	access_token = request.GET.get('access_token')
	
    #################### Spotify Authorization Code Flow - Step 6: Use the Access Token to Access Spotify API ####################

	authorization_header = {"Authorization":"Bearer {}".format(access_token)}

    #################### Get Profile Data ####################

	user_profile_api_endpoint = "{}/me".format(SPOTIFY_API_URL)

	profile_response = requests.get(user_profile_api_endpoint, headers=authorization_header)
	profile_data = json.loads(profile_response.text)

    #################### Get User Playlist Data ####################

	playlist_api_endpoint = "{}/playlists/?limit=50".format(profile_data["href"])
	playlists_response = requests.get(playlist_api_endpoint, headers=authorization_header)
	playlist_data = json.loads(playlists_response.text)
	playlist_data = sorted(playlist_data["items"], key=lambda playlist: playlist["name"])

	playlists_api_endpoints = []
	for playlist in playlist_data:
		playlists_api_endpoints.append(playlist["href"])

	playlists_tracks = []
	for playlist_href in playlists_api_endpoints:
		playlist_tracks_response = requests.get("{}/tracks?fields=items(track(name, href, artists(name, href, id)))".format(playlist_href), headers=authorization_header)
		playlists_tracks_data = json.loads(playlist_tracks_response.text)
		playlists_tracks.append(playlists_tracks_data)

	return JsonResponse({
		'Content-Type': 'application/json',
		'Accept': 'application/json',
		'status': 200,
		'data': playlists_tracks
		}, safe=False)


#####################################################################################
########################### GET USER'S ARTISTS' DATA ###########################
#####################################################################################

def get_artists(request):

	access_token = request.GET.get('access_token')
	artists_ids = request.GET.get('ids')
	authorization_header = {"Authorization":"Bearer {}".format(access_token)}
	artists_api_endpoint = "{}/artists?ids={}".format(SPOTIFY_API_URL, artists_ids)
	artists_response = requests.get(artists_api_endpoint, headers=authorization_header)
	artists_data = json.loads(artists_response.text)

	return JsonResponse({
		'Content-Type': 'application/json',
		'Accept': 'application/json',
		'status': 200,
		'data': artists_data
		}, safe=False)












