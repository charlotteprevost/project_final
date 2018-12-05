from django.conf.urls import url
from django.contrib import admin
from django.urls import include, re_path

# For deployment
from django.views.generic import TemplateView

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    # url(r'^', include('showdown_app.urls')),
    re_path('.*', TemplateView.as_view(template_name='index.html')),
]
