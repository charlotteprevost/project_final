"""showdown_django URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""


from django.contrib import admin
# from django.urls import path
from django.conf.urls import include, url

from songkick_api.views_songkick import get_event, add_event
from songkick_api.views_spotipy import index, callback

urlpatterns = [
    # path('admin/', admin.site.urls),
	# path('', get_event),
    # url(r'^', include('spotify_proxy.urls'),  name='spotify_proxy'),
    # url(r'^$', 'songkick_test.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^callback/q/', callback),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^getEvents/', get_event),
    url(r'^addEvent/', add_event),
    url(r'^', index),
]