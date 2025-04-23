from django.urls import path
from .views import (
    RegisterView,
    PhotoListCreateView,
    CommentCreateView,
    CommentDeleteView,
    LikeToggleView,
    PhotoDetailView,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("photos/", PhotoListCreateView.as_view(), name="photo-list-create"),
    path("photos/<int:pk>/", PhotoDetailView.as_view(), name="photo-detail"),
    path("comments/", CommentCreateView.as_view(), name="comment-create"),
    path("comments/<int:pk>/", CommentDeleteView.as_view(), name="comment-delete"),
    path(
        "photos/<int:photo_id>/like-toggle/",
        LikeToggleView.as_view(),
        name="like-toggle",
    ), 
  
]
