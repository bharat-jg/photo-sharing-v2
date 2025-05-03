from django.db import models
from django.contrib.auth.models import User
from cloudinary.models import CloudinaryField

from django.db.models.signals import post_save
from django.dispatch import receiver


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    bio = models.TextField(blank=True)
    profile_photo = CloudinaryField("profile_photo", blank=True, null=True)

    def __str__(self):
        return f"Profile of {self.user.username}"


# Auto-create or update profile when User is saved
@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
    instance.profile.save()


class Photo(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="photos")
    caption = models.TextField(blank=True)
    image = CloudinaryField("image")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Photo by {self.user.username}"


class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    photo = models.ForeignKey(Photo, on_delete=models.CASCADE, related_name="comments")
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.user.username} on Photo {self.photo.id}"


class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="likes")
    photo = models.ForeignKey(Photo, on_delete=models.CASCADE, related_name="likes")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "photo")  # One like per user per photo

    def __str__(self):
        return f"{self.user.username} liked Photo {self.photo.id}"
