from django.conf.urls import url
from django.contrib import admin
from django.urls import include, path, re_path

from showdown_app.views_songkick import get_events, add_event, Event_Detail
from showdown_app.views_spotify import auth, get_tokens, get_playlists, get_profile, playlists_tracks, get_artists
from showdown_app.views_user import get_or_create_user
# from django.views.generic import TemplateView

urlpatterns = [
    url(r'^events/', get_events),                 		# Songkick
    url(r'^event-new/', add_event),                 	# Songkick
    url(r'^events/<int:pk>/', Event_Detail.as_view()),  # SongKick
    url(r'^register/', get_or_create_user),             # Spotify authorization URL    
    url(r'^login/', auth),                              # Spotify authorization URL
    url(r'^tokens/', get_tokens),                       # Spotify get tokens
    url(r'^playlists/', get_playlists),                 # Spotify get playlists
    url(r'^profile/', get_profile),                     # Spotify get user profile
    url(r'^playlists-tracks/', playlists_tracks),       # Spotify get playlists, THEN songs THEN artists
    url(r'^artists/', get_artists),          			# Spotify get artist

]
