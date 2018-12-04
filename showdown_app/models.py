from django.db import models
# from django.contrib.auth.models import User
# from django.db.models.signals import post_save
# from django.dispatch import receiver

# Create your models here.

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


# class Profile(models.Model):
# 	user = models.OneToOneField(User, on_delete=models.CASCADE)
# 	description = models.TextField(max_length=500, blank=True)
# 	location = models.CharField(max_length=50, blank=True)
# 	birth_date = models.DateField(null=True, blank=True)

# @receiver(post_save, sender=User)
# def create_user_profile(sender, instance, created, **kwargs):
# 	if created:
# 		Profile.objects.create(user=instance)

# @receiver(post_save, sender=User)
# def save_user_profile(sender, instance, **kwargs):
# 	instance.profile.save()