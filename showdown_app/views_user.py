from django.http import JsonResponse
from .models import ShowDownUser
import json


# from .serializers import EventSerializer
# from rest_framework import generics

# class EventListCreate(generics.ListCreateAPIView):
#     queryset = Event.objects.all()
#     serializer_class = EventSerializer

# Create your views here.

#######################################################################
######################### GET OR CREATE USER ##########################
#######################################################################

def get_or_create_user(request):

	data = request.body.decode('utf-8')
	data = json.loads(data)

	try:
		obj, created = ShowDownUser.objects.get_or_create( 			# If ShowDownUser doesn't already exist, create it
			spotify_display_name = data["spotify_display_name"],
			spotify_id= data["spotify_id"],
		)

		# obj.save()

		print('---------------------------------------- obj --------------------\n', obj)		

		return JsonResponse({"data": "Success!"}, safe=False)
	except: 
		return JsonResponse({"Error": "Invalid Data"}, safe=False)



