from django.db import models
# from django.contrib.auth.models import User
# from django.db.models.signals import post_save
# from django.dispatch import receiver

# Create your models here.

class Event(models.Model):
	event_id = models.IntegerField()
	venue = models.CharField(max_length=128)
	city = models.CharField(max_length=128)
	datetime = models.DateTimeField()
	uri = models.CharField(max_length=264)
	# users_going = models.ForeignKey(User, on_delete=models.CASCADE, related_name='events', default=None)

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