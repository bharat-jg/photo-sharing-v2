from django.db import models
from django.contrib.auth.models import User
from cloudinary.models import CloudinaryField

from django.db.models.signals import post_save
from django.dispatch import receiver

# The Profile model represents a user's profile, including their bio and profile photo.
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

# The Photo model represents a photo uploaded by a user.
class Photo(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="photos")
    caption = models.TextField(blank=True)
    image = CloudinaryField("image")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Photo by {self.user.username}"

# The Comment model represents a comment made by a user on a photo.
class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    photo = models.ForeignKey(Photo, on_delete=models.CASCADE, related_name="comments")
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.user.username} on Photo {self.photo.id}"

# The Like model represents a like made by a user on a photo.
class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="likes")
    photo = models.ForeignKey(Photo, on_delete=models.CASCADE, related_name="likes")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "photo")  # One like per user per photo

    def __str__(self):
        return f"{self.user.username} liked Photo {self.photo.id}"

# The Bookmark model represents a saved photo by a user.
class Bookmark(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookmarks')
    photo = models.ForeignKey('Photo', on_delete=models.CASCADE, related_name='bookmarks')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'photo')
        constraints = [
            models.UniqueConstraint(fields=['user', 'photo'], name='unique_user_bookmark')
        ]

    def __str__(self):
        return f"{self.user.username} bookmarked {self.photo.id}"
