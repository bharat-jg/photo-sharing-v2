from django.urls import path
from .views import (
    delete_profile_photo,
    register_user,
    photo_list_create,
    photo_detail,
    comment_create,
    comment_delete,
    like_toggle,
    photo_update_delete, current_user_profile, password_reset_request, password_reset_confirm, photo_feed, change_password,
    save_toggle,
    saved_photos,
    update_profile_photo,
)

urlpatterns = [
    # authentication
    path("register/", register_user, name="register"),
    path('password-reset-confirm/<uidb64>/<token>/', password_reset_confirm, name='password_reset_confirm'),
    path('password-reset/', password_reset_request, name='password_reset'),
    
    # photos
    path("photos/", photo_list_create, name="photo-list-create"),
    path("photos/feed/", photo_feed, name="photo-feed"),
    path("photos/<int:pk>/", photo_detail, name="photo-detail"),
    path("photos/<int:pk>/edit/", photo_update_delete, name="photo-update-delete"),
    
    # comments
    path("comments/", comment_create, name="comment-create"),
    path("comments/<int:pk>/", comment_delete, name="comment-delete"),
    
    # likes
    path("photos/<int:photo_id>/like-toggle/", like_toggle, name="like-toggle"),
    
    # profile
    path('profile/me/', current_user_profile, name="current-user-profile"), 
    path('auth/change-password/', change_password, name="change-password"), 
    path('profile/update-photo/', update_profile_photo, name='update_profile_photo'),
    path('profile/delete-photo/', delete_profile_photo, name='delete_profile_photo'),

    # bookmarks
    path("photos/<int:photo_id>/save-toggle/", save_toggle, name="save-toggle"),
    path("photos/saved/", saved_photos, name="saved-photos"),
]
