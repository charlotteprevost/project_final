import importlib.util
spec = importlib.util.spec_from_file_location('secrets', './secrets.py')
secrets = importlib.util.module_from_spec(spec)
spec.loader.exec_module(secrets)

from django.http import JsonResponse

from django.forms.models import model_to_dict
from django.db.models import Q

from .models import Event, ShowDownUser

from django.views import View                                   ## Django View class

import requests
import json

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
######## CREATE EVENT (for User Calendar) - Add to PostgreSQL ######### 
#######################################################################

def add_event(request):

	data = request.body.decode('utf-8')
	data = json.loads(data)

	try:
		showdown_user = ShowDownUser.objects.get(spotify_id=data['spotify_id'])

		event_to_add = Event.objects.get_or_create(
			event_id = data['event_id'],
			display_name = data['display_name'],
			venue = data['venue'], 
			city = data['city'], 
			date = data['date'], 
			uri = data['uri'], 
			going = 'going',
			created_by = showdown_user
		)
		print('-------------------- event_to_add --------------------\n', event_to_add)

		return JsonResponse({'data': model_to_dict(event_to_add)}, safe=False)
	except:
		return JsonResponse({'Error': 'Invalid Data from add_event'}, safe=False)


#######################################################################
###################### GET EVENTS from Calendar #######################
#######################################################################

def get_user_events(request):

	data = request.body.decode('utf-8')
	data = json.loads(data)
	print('-------------------- data --------------------\n', data)

	showdown_user = ShowDownUser.objects.get(spotify_id=data['spotify_id'])

	event_list = list(Event.objects.filter(
		(Q(going='going') | Q(going='maybe')),
		created_by=showdown_user).values())
	return JsonResponse({'data': event_list}, safe=False)


#######################################################################
######################### EDIT EVENT STATUS ###########################
#######################################################################

def edit_event(request, pk):
	data = request.body.decode('utf-8')
	data = json.loads(data)
	print('-------------------- data --------------------\n', data)

	try:
		event_to_edit = Event.objects.get(pk = pk)
		data_key = list(data.keys())

		for key in data_key:
			if key == 'going':
				event_to_edit.going = data[key]

		event_to_edit.save()

		data['id'] = event_to_edit.id

		return JsonResponse({'data': data}, safe=False)

	except Event.DoesNotExist:
		return JsonResponse({'error': 'Your event''s primary key doesn''t exist'}, safe=False)

	except:
		return JsonResponse({'error': 'Invalid Data'}, safe=False)


#######################################################################
#################### DELETE EVENT FROM CALENDAR #######################
#######################################################################

def delete_event(request, pk):
	try:
		event_to_delete = Event.objects.get(pk=pk)
		event_to_delete.delete()

		return JsonResponse({'data': True}, safe=False)
	except:
		return JsonResponse({'error': 'Invalid Data'}, true=False)







