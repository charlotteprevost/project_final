from django.conf.urls import url
from django.contrib import admin
from django.urls import include, path, re_path

from showdown_app.views_songkick import Events, Event_Detail
from showdown_app.views_spotify import auth, get_tokens, get_playlists, get_profile, playlists_tracks, get_artists
# from django.views.generic import TemplateView

urlpatterns = [
    url(r'^events/', Events.as_view()),                 # Songkick
    url(r'^events/<int:pk>/', Event_Detail.as_view()),  # SongKick
    url(r'^login/', auth),                              # Spotify authorization URL
    url(r'^tokens/', get_tokens),                       # Spotify get tokens
    url(r'^playlists/', get_playlists),                 # Spotify get playlists
    url(r'^profile/', get_profile),                     # Spotify get user profile
    url(r'^playlists-tracks/', playlists_tracks),       # Spotify get playlists, THEN songs THEN artists
    url(r'^artists/', get_artists),          				# Spotify get artist

]
