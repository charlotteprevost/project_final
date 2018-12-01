from django.http import HttpResponseRedirect, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.forms.models import model_to_dict
from django.shortcuts import render
from django.conf import settings

from .models import Event

import requests
import json


from .serializers import EventSerializer
from rest_framework import generics

class EventListCreate(generics.ListCreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer



# Create your views here.

@csrf_exempt   					# CHEATING - DONT FORGET TO GET CORRECT CSRF-TOKENS/CORS HEADERS
def get_event(request):

	if request.method == 'POST':
		data = request.body.decode('utf-8')
		data = json.loads(data) 

		r = requests.get('https://api.songkick.com/api/3.0/events.json?apikey=' + settings.SONGKICK_API_KEY + '&artist_name=' + data['artist'])

		events = list(r.json().values())

		return JsonResponse({
			'Content-Type': 'application/json',
			'status': 200,
			'data': events},
			safe=False)


@csrf_exempt   					# CHEATING - DONT FORGET TO GET CORRECT CSRF-TOKENS/CORS HEADERS
def add_event(request):

	if request.method == 'POST':
		data = request.body.decode('utf-8')
		data = json.loads(data)
		print('---------------------------------------- data --------------------\n', data)		
		try:
			event_to_add = Event(event_id=data["event_id"], venue=data["venue"], city=data["city"], datetime=data["datetime"], uri=data["uri"])
			print('---------------------------------------- event_to_add --------------------\n', event_to_add)
			event_to_add.save()
			print('')
			return JsonResponse({"created": model_to_dict(event_to_add)}, safe=False)
		except:
			return JsonResponse({"Error": "Invalid Data"}, safe=False)






