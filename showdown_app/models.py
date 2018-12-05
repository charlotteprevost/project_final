from django.db import models

class ShowDownUser(models.Model):
	spotify_display_name = models.CharField(max_length=128)
	spotify_id = models.CharField(max_length=128)
	spotify_image = models.CharField(max_length=264)


	def __str__(self):
		return self.spotify_display_name + ' | ' + self.spotify_id 


class Event(models.Model):
	event_id = models.IntegerField()
	venue = models.CharField(max_length=264)
	display_name = models.CharField(max_length=264)
	city = models.CharField(max_length=128)
	date = models.DateField()
	uri = models.CharField(max_length=264)
	going = models.CharField(max_length=64)
	created_by = models.ForeignKey(ShowDownUser, on_delete=models.CASCADE, related_name='events', default=None)

	def __str__(self):
		return self.venue + ', ' + self.city 
