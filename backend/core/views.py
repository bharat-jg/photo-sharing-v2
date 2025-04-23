from django.shortcuts import render

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .models import Photo, Comment, Like
from .serializers import (
    UserSerializer,
    PhotoSerializer,
    CommentSerializer,
    LikeSerializer,
)


# Register a user
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]


# Photo feed and photo upload
class PhotoListCreateView(generics.ListCreateAPIView):
    queryset = Photo.objects.all().order_by("-created_at")
    serializer_class = PhotoSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# Photo detail
class PhotoDetailView(generics.RetrieveAPIView):
    queryset = Photo.objects.all()
    serializer_class = PhotoSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


# Comment creation
class CommentCreateView(generics.CreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# Comment deletion
class CommentDeleteView(generics.DestroyAPIView):
    queryset = Comment.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        comment = self.get_object()
        if comment.user != request.user:
            return Response(
                {"error": "You can only delete your own comments"}, status=403
            )
        return super().delete(request, *args, **kwargs)


# Like/Unlike toggle
class LikeToggleView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, photo_id):
        photo = Photo.objects.get(id=photo_id)
        like, created = Like.objects.get_or_create(user=request.user, photo=photo)
        if not created:
            like.delete()
            return Response({"status": "unliked"})
        return Response({"status": "liked"})

