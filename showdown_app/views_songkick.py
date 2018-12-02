from django.http import HttpResponseRedirect, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.forms.models import model_to_dict
from django.shortcuts import render
from django.conf import settings
from django.db.models import Q

from .models import Event

from django.views import View                                   ## Django View class

import requests
import json


# from .serializers import EventSerializer
from rest_framework import generics

# class EventListCreate(generics.ListCreateAPIView):
#     queryset = Event.objects.all()
#     serializer_class = EventSerializer

# Create your views here.
class Events(View):

	@csrf_exempt   					# CHEATING - DONT FORGET TO GET CORRECT CSRF-TOKENS/CORS HEADERS
	def get_events(request):

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
				event_to_add = Event(event_id=data["event_id"], venue=data["venue"], city=data["city"], datetime=data["datetime"], uri=data["uri"], going=data["going"], maybe=data["maybe"])
				print('---------------------------------------- event_to_add --------------------\n', event_to_add)
				event_to_add.save()
				print('')
				return JsonResponse({"created": model_to_dict(event_to_add)}, safe=False)
			except:
				return JsonResponse({"Error": "Invalid Data"}, safe=False)



class Event_Detail(View):

	# Make a get request and filter out events that are either "going" or "maybe"
	def get(self, request, pk):
		event_list = list(Event.objects.filter(Q(going__isnull=False) | Q(maybe__isnull=False)).values())
		return JsonResponse({'data': event_list}, safe=False)


	def put(self, request, pk):
		data = request.body.decode('utf-8')
		data = json.loads(data)

		try:
			edit_event = Event.objects.get(pk=pk)
			data_key = list(data.keys())

			for key in data_key:
				if key == 'going':
					edit_event.going = data[key]
				if key == 'maybe':
					edit_event.maybe = data[key]

			edit_event.save()

			data['id'] = edit_event.id

			return JsonResponse({'data': data}, safe=False)

		except Event.DoesNotExist:
			return JsonResponse({'error': 'Your event''s primary key doesn''t exist'}, safe=False)

		except:
			return JsonResponse({'error': 'Invalid Data'}, safe=False)


	def delete(self, request, pk):
		try:
			event_to_delete = Event.objects.get(pk=pk)
			event_to_delete.delete()

			return JsonResponse({'data': True}, safe=False)
		except:
			return JsonResponse({'error': 'Invalid Data'}, true=False)







