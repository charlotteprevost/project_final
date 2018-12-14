from django.conf.urls import url
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.generic import TemplateView

from showdown_app.views_events_songkick import get_events, add_event, edit_event, delete_event, get_user_events
from showdown_app.views_spotify import auth, get_tokens, get_playlists, get_profile, playlists_tracks, get_artists
from showdown_app.views_user import get_or_create_user

urlpatterns = [
    path('backend/events/<int:pk>/edit/', edit_event),          # PostgreSQL
    path('backend/events/<int:pk>/delete/', delete_event),      # PostgreSQL
    url(r'^backend/events/', get_events),                       # Songkick
    url(r'^backend/calendar/', get_user_events),                # PostgreSQL
    url(r'^backend/event-new/', add_event),                     # PostgreSQL
    url(r'^backend/register/', get_or_create_user),             # PostgreSQL    
    url(r'^backend/login/', auth),                              # Spotify authorization URL
    url(r'^backend/tokens/', get_tokens),                       # Spotify get tokens
    url(r'^backend/playlists/', get_playlists),                 # Spotify get playlists
    url(r'^backend/profile/', get_profile),                     # Spotify get user profile
    url(r'^backend/playlists-tracks/', playlists_tracks),       # Spotify get playlists, THEN songs THEN artists
    url(r'^backend/artists/', get_artists),                     # Spotify get artist
    re_path('.*', TemplateView.as_view(template_name='index.html'))

]
