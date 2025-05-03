from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import LimitOffsetPagination
from django.contrib.auth.models import User
from .models import Photo, Comment, Like
from .serializers import UserSerializer, PhotoSerializer, CommentSerializer, UserProfileSerializer
from django.db.models import Count
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.core.mail import send_mail
from django.conf import settings
from django.http import JsonResponse

# Register user
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
def photo_feed(request):
    photos = Photo.objects.all().order_by('-created_at')
    paginator = LimitOffsetPagination()
    paginated_photos = paginator.paginate_queryset(photos, request)
    serializer = PhotoSerializer(paginated_photos, many=True)
    return paginator.get_paginated_response(serializer.data)


# Photo feed and create
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticatedOrReadOnly])
def photo_list_create(request):
    if request.method == 'GET':
        user_id = request.GET.get('user_id')
        sort_by = request.GET.get('sort_by', 'recent')  # default to 'recent'

        if user_id:
            photos = Photo.objects.filter(user__id=user_id)
        else:
            photos = Photo.objects.all()

        # Sorting logic
        if sort_by == 'recent':
            photos = photos.order_by('-created_at')
        elif sort_by == 'oldest':
            photos = photos.order_by('created_at')
        elif sort_by == 'popular':
            photos = photos.annotate(like_count=Count('likes')).order_by('-like_count', '-created_at')

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
    
    serializer = PhotoSerializer(photo, context={'request': request})
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


# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def current_user_profile(request):
#     serializer = UserProfileSerializer(request.user)
#     return Response(serializer.data)

@api_view(['POST'])
@permission_classes([AllowAny])  
def password_reset_request(request):
    email = request.data.get('email')
    if not email:
        return JsonResponse({'error': 'Email is required'}, status=400)

    try:
        user = User.objects.get(email=email)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        frontend_base = "http://localhost:5173"  # or your deployed frontend URL
        reset_url = f"{frontend_base}/reset-password/{uid}/{token}/"

        send_mail(
            subject='Password Reset Request',
            message=f"Click the link to reset your password:\n{reset_url}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
        )
    except User.DoesNotExist:
        pass  # Don't reveal if the user exists

    return JsonResponse({'message': 'If an account with that email exists, a reset link has been sent.'})


@api_view(['POST'])
@permission_classes([AllowAny])  
def password_reset_confirm(request, uidb64, token):
    new_password = request.data.get('password')
    if not new_password:
        return JsonResponse({'error': 'Password is required'}, status=400)

    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)

        if default_token_generator.check_token(user, token):
            user.set_password(new_password)
            user.save()
            return JsonResponse({'message': 'Password reset successful'})
        else:
            return JsonResponse({'error': 'Invalid or expired token'}, status=400)

    except (User.DoesNotExist, ValueError, TypeError):
        return JsonResponse({'error': 'Invalid request'}, status=400)


@api_view(['GET', 'PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def current_user_profile(request):
    user = request.user

    if request.method == 'GET':
        serializer = UserProfileSerializer(user)
        return Response(serializer.data)

    elif request.method in ['PUT', 'PATCH']:
        serializer = UserProfileSerializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Change password in Profile Page 
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user
    data = request.data
    current_password = data.get("current_password")
    new_password = data.get("new_password")

    if not user.check_password(current_password):
        return Response({"detail": "Current password is incorrect"}, status=400)

    user.set_password(new_password)
    user.save()
    return Response({"detail": "Password updated successfully"})
