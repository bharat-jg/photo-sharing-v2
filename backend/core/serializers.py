from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Photo, Comment, Like, Profile


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["profile_photo"]


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "password", "profile"]

    def create(self, validated_data):
        user = User(username=validated_data["username"])
        user.set_password(validated_data["password"])  # HASH PASSWORD
        user.save()
        return user


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  # Show who commented

    class Meta:
        model = Comment
        fields = ["id", "user", "photo", "text", "created_at"]


class LikeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Like
        fields = ["id", "user", "photo", "created_at"]


class PhotoSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  # Show uploader info
    comments = CommentSerializer(many=True, read_only=True)
    likes_count = serializers.SerializerMethodField()
    likes = serializers.SerializerMethodField()

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
        ]

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_likes(self, obj):
        return obj.likes.values_list('user_id', flat=True)
