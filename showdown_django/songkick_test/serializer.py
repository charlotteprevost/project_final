from rest_framework import serializers
from .models import Event


# DRF defines serializers as follows:

# "Serializers allow complex data such as querysets and model instances to be converted to 
# native Python datatypes that can then be easily rendered into JSON, XML or other content types. 
# Serializers also provide deserialization, allowing parsed data to be converted back into complex types, 
# after first validating the incoming data."

# Application will make a GET request to the Songkick web service. 
# Songkick will return a JSON response. 
# We need to save that response to the database.

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'