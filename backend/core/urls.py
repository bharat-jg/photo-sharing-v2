from django.urls import path
from .views import (
    register_user,
    photo_list_create,
    photo_detail,
    comment_create,
    comment_delete,
    like_toggle,
    photo_update_delete,
)

urlpatterns = [
    path("register/", register_user, name="register"),
    path("photos/", photo_list_create, name="photo-list-create"),
    path("photos/<int:pk>/", photo_detail, name="photo-detail"),
    path("photos/<int:pk>/edit/", photo_update_delete, name="photo-update-delete"),
    path("comments/", comment_create, name="comment-create"),
    path("comments/<int:pk>/", comment_delete, name="comment-delete"),
    path("photos/<int:photo_id>/like-toggle/", like_toggle, name="like-toggle"),
]
