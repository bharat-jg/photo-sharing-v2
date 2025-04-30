from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .models import Photo, Comment, Like
from .serializers import UserSerializer, PhotoSerializer, CommentSerializer

# Register user
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Photo feed & upload
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticatedOrReadOnly])
def photo_list_create(request):
    if request.method == 'GET':
        photos = Photo.objects.all().order_by('-created_at')
        serializer = PhotoSerializer(photos, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = PhotoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Photo detail
@api_view(['GET'])
@permission_classes([IsAuthenticatedOrReadOnly])
def photo_detail(request, pk):
    try:
        photo = Photo.objects.get(pk=pk)
    except Photo.DoesNotExist:
        return Response({"error": "Photo not found"}, status=404)
    
    serializer = PhotoSerializer(photo)
    return Response(serializer.data)

# Photo update & delete
@api_view(['PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def photo_update_delete(request, pk):
    try:
        photo = Photo.objects.get(pk=pk)
    except Photo.DoesNotExist:
        return Response({"error": "Photo not found"}, status=404)

    if photo.user != request.user:
        return Response({"error": "You can only modify your own posts"}, status=403)

    if request.method == 'PATCH':
        serializer = PhotoSerializer(photo, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    elif request.method == 'DELETE':
        photo.delete()
        return Response(status=204)

# Create comment
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def comment_create(request):
    serializer = CommentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


# Delete comment
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def comment_delete(request, pk):
    try:
        comment = Comment.objects.get(pk=pk)
    except Comment.DoesNotExist:
        return Response({"error": "Comment not found"}, status=404)

    # Check if the user is either the comment author or the post owner
    if comment.user != request.user and comment.photo.user != request.user:
        return Response({"error": "You can only delete your own comments or comments on your photos"}, status=403)

    comment.delete()
    return Response(status=204)


# Like/Unlike toggle
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_toggle(request, photo_id):
    try:
        photo = Photo.objects.get(id=photo_id)
    except Photo.DoesNotExist:
        return Response({"error": "Photo not found"}, status=404)
    
    like, created = Like.objects.get_or_create(user=request.user, photo=photo)
    if not created:
        like.delete()
        return Response({"status": "unliked"})
    return Response({"status": "liked"})
