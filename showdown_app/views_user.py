from django.http import JsonResponse
from .models import ShowDownUser
import json

#######################################################################
######################### GET OR CREATE USER ##########################
#######################################################################

def get_or_create_user(request):

	data = request.body.decode('utf-8')
	data = json.loads(data)

	print('-------------------- data --------------------\n', data)
	
	try:
		obj, created = ShowDownUser.objects.get_or_create( 			# If ShowDownUser doesn't already exist, create it
			spotify_display_name = data["spotify_display_name"],
			spotify_id = data["spotify_id"],
			spotify_image = data["spotify_image"],
		)

		# obj.save()

		print('-------------------- obj --------------------\n', obj)		

		return JsonResponse({"data": "Success!"}, safe=False)
	except: 
		return JsonResponse({"Error": "Invalid Data"}, safe=False)



