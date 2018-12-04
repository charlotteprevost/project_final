import importlib.util
spec = importlib.util.spec_from_file_location("secrets", "./secrets.py")
secrets = importlib.util.module_from_spec(spec)
spec.loader.exec_module(secrets)

from django.http import JsonResponse

from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator

from django.forms.models import model_to_dict
from django.db.models import Q

from .models import Event, ShowDownUser

from django.views import View                                   ## Django View class

import requests
import json


# from .serializers import EventSerializer
# from rest_framework import generics

# class EventListCreate(generics.ListCreateAPIView):
#     queryset = Event.objects.all()
#     serializer_class = EventSerializer

# Create your views here.

#######################################################################
####################### GET ALL ARTISTS EVENTS ######################## Taken from state in React
#######################################################################

def get_events(request):

	artist = request.GET.get('artist')

	r = requests.get('https://api.songkick.com/api/3.0/events.json?apikey=' + secrets.SONGKICK_API_KEY + '&artist_name=' + artist)

	events = list(r.json().values())

	return JsonResponse({
		'Content-Type': 'application/json',
		'status': 200,
		'data': events},
		safe=False)


#######################################################################
################## CREATE EVENT - Add to PostgreSQL ################### 
#######################################################################

# @method_decorator(ensure_csrf_cookie)
# @method_decorator(csrf_protect)
def add_event(request):
	print('---------------------------------------- request --------------------\n', request)		


	data = request.body.decode('utf-8')
	data = json.loads(data)
	print('---------------------------------------- data --------------------\n', data)		
	try:

		showdown_user = ShowDownUser.objects.get(spotify_id=data["spotify_id"])
		print('-------------------- showdown_user --------------------\n', showdown_user)

		event_id = data["event_id"], 
		print('-------------------- event_id --------------------\n', event_id)
		print('-------------------- type(event_id) --------------------\n', type(event_id))
		venue = data["venue"], 
		print('-------------------- venue --------------------\n', venue)
		print('-------------------- type(venue) --------------------\n', type(venue))
		city = data["city"], 
		print('-------------------- city --------------------\n', city)
		print('-------------------- type(city) --------------------\n', type(city))
		date = data["date"], 
		print('-------------------- date --------------------\n', date)
		print('-------------------- type(date) --------------------\n', type(date))
		uri = data["uri"], 
		print('-------------------- uri --------------------\n', uri)
		print('-------------------- type(uri) --------------------\n', type(uri))
		going = "going",
		print('-------------------- going --------------------\n', going)
		print('-------------------- type(going) --------------------\n', type(going))
		created_by = showdown_user

		event_to_add = Event(
			event_id = data["event_id"], 
			venue = data["venue"], 
			city = data["city"], 
			date = data["date"], 
			uri = data["uri"], 
			going = "going",
			created_by = showdown_user
		)
		print('-------------------- event_to_add --------------------\n', event_to_add)
		event_to_add.save()
		print('')
		return JsonResponse({"Created": event_to_add}, safe=False)
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







