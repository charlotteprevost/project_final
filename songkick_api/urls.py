from django.conf.urls import url
from . import views_songkick


urlpatterns = [
    url('api/showdown/', views_songkick.EventListCreate.as_view() ),
]