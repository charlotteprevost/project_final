from django.db import models

# Create your models here.

class Event(models.Model):
	# type = models.CharField(max_length=15)
	event_id = models.IntegerField()
	artist_id = models.IntegerField()
	artist = models.CharField(max_length=128)
	venue = models.CharField(max_length=128)
	city = models.CharField(max_length=128)
	datetime = models.DateTimeField()
	uri = models.CharField(max_length=128)
	# users_going = models.ForeignKey(User, on_delete=models.CASCADE, related_name='events', default=None)

	def __str__(self):
		return self.venue + ', ' + self.city + ' | ' + self.artist + ' | Going:' + self.users_going
