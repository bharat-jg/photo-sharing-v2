from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Photo, Comment, Like, Profile
from rest_framework.validators import UniqueValidator


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["profile_photo"]

# User Registration Serializer
class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "password", "profile", "email", "first_name", "last_name"]

    def create(self, validated_data):
        user = User(
            username=validated_data["username"],
            email=validated_data["email"]
        )
        user.set_password(validated_data["password"])  # HASH PASSWORD
        
        user.save()
        return user


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  

    class Meta:
        model = Comment
        fields = ["id", "user", "photo", "text", "created_at"]


class LikeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Like
        fields = ["id", "user", "photo", "created_at"]


class PhotoSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True) 
    comments = CommentSerializer(many=True, read_only=True)
    likes_count = serializers.SerializerMethodField()
    likes = serializers.SerializerMethodField()
    bookmarks = serializers.SerializerMethodField()  # ✅ NEW
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)

    class Meta:
        model = Photo
        fields = [
            "id",
            "user",
            "image",
            "caption",
            "created_at",
            "comments",
            "likes_count",
            "likes",
            "bookmarks",  # ✅ NEW
            "first_name",
            "last_name",
        ]

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_likes(self, obj):
        return obj.likes.values_list('user_id', flat=True)

    def get_bookmarks(self, obj):
        return obj.bookmarks.values_list('user_id', flat=True)



# User Profile Information Serializer 
# This serializer is used to show the user's profile information, including the number of posts they have made.
class UserProfileSerializer(serializers.ModelSerializer):
    posts_count = serializers.SerializerMethodField()

    # Writable fields
    bio = serializers.CharField(source='profile.bio', allow_blank=True, required=False)
    profile_photo = serializers.ImageField(source='profile.profile_photo', required=False)

    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    username = serializers.CharField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'first_name',
            'last_name',
            'email',
            'bio',
            'profile_photo',
            'posts_count',
        ]

    def get_posts_count(self, obj):
        return Photo.objects.filter(user=obj).count()

    def update(self, instance, validated_data):
        # Pop profile data first
        profile_data = validated_data.pop('profile', {})

        # Update User fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update related Profile fields
        profile = instance.profile
        for attr, value in profile_data.items():
            setattr(profile, attr, value)
        profile.save()

        return instance