from django.http import HttpResponseRedirect, JsonResponse
# from .serializer import EventSerializer
from django.shortcuts import render
from django.conf import settings
from .forms import FindEvent

import requests

# Create your views here.


def get_event(request):
	# if this is a GET request we need to process the form data
	if request.method == 'GET':
		print(request)
		# create a form instance and populate it with data from the request:
		form = FindEvent(request.GET)
		# check whether it's valid:
		if form.is_valid():
			# process the data in form.cleaned_data as required
			artist = form.cleaned_data['artist']
			print('---------------------------------------- artist --------------------\n', artist)
			r = requests.get('https://api.songkick.com/api/3.0/events.json?apikey=' + settings.SONGKICK_API_KEY + '&artist_name=' + artist)
			json = list(r.json().values())
			print('---------------------------------------- json[0][''results''][''event''] --------------------\n', json[0]['results']['event'])

			# serializer = EventSerializer(data=json)
			# if serializer.is_valid():
			# 	events = serializer.save()
			events = json[0]['results']['event']
			print(JsonResponse({
				'Content-Type': 'application/json',
				'status': 200,
				'data': events},
				safe=False))

	   		# return JsonResponse({
				# 'Content-Type': 'application/json',
				# 'status': 200,
				# 'data': json},
				# safe=False)
			return render(request, 'events.html', {'events': events})

	# if a GET (or any other method) we'll create a blank form
	else:
		form = FindEvent()

	return render(request, 'index.html', {'form': form})

