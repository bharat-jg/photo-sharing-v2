from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User
from core.models import Photo, Comment, Like, Bookmark
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core import mail
from unittest.mock import patch
import cloudinary.uploader

class AuthenticationTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('register')
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'TestPass123!',
            'first_name': 'Test',
            'last_name': 'User'
        }

    def test_user_registration(self):
        response = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='testuser').exists())

class PhotoTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='TestPass123!')
        self.client.force_authenticate(user=self.user)
        
        # Create a test photo
        self.photo = Photo.objects.create(
            user=self.user,
            caption='Test photo',
            image='test_image.jpg'
        )
        self.photo_url = reverse('photo-detail', args=[self.photo.id])

    # @patch('cloudinary.uploader.upload')
    # def test_create_photo(self, mock_upload):
    #     # Mock cloudinary upload response
    #     mock_upload.return_value = {
    #         'secure_url': 'https://res.cloudinary.com/test/image/upload/test.jpg',
    #         'public_id': 'test_public_id'
    #     }
        
    #     url = reverse('photo-list-create')
    #     data = {
    #         'caption': 'New test photo',
    #         'image': SimpleUploadedFile(
    #             name='test.jpg',
    #             content=b'file_content',
    #             content_type='image/jpeg'
    #         )
    #     }
    #     response = self.client.post(url, data, format='multipart')
    #     self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_photo_feed(self):
        url = reverse('photo-feed')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class CommentTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='TestPass123!')
        self.client.force_authenticate(user=self.user)
        
        self.photo = Photo.objects.create(
            user=self.user,
            caption='Test photo',
            image='test_image.jpg'
        )

    def test_create_comment(self):
        url = reverse('comment-create')
        data = {
            'photo': self.photo.id,
            'text': 'Test comment'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

class LikeTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='TestPass123!')
        self.client.force_authenticate(user=self.user)
        
        self.photo = Photo.objects.create(
            user=self.user,
            caption='Test photo',
            image='test_image.jpg'
        )

    def test_like_toggle(self):
        url = reverse('like-toggle', args=[self.photo.id])
        # Test liking
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'liked')
        
        # Test unliking
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'unliked')

class BookmarkTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='TestPass123!')
        self.client.force_authenticate(user=self.user)
        
        self.photo = Photo.objects.create(
            user=self.user,
            caption='Test photo',
            image='test_image.jpg'
        )

    def test_save_toggle(self):
        url = reverse('save-toggle', args=[self.photo.id])
        # Test saving
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'saved')
        
        # Test unsaving
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'unsaved')

class PasswordResetTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='TestPass123!'
        )

    # def test_password_reset_request(self):
        # Update URL name to match urls.py
        url = reverse('password_reset_request')  # Changed from 'password-reset-request'
        data = {'email': 'test@example.com'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(mail.outbox), 1)

class ProfileTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='TestPass123!')
        self.client.force_authenticate(user=self.user)

    def test_update_profile(self):
        url = reverse('current-user-profile')
        data = {
            'first_name': 'Updated',
            'last_name': 'Name'
        }
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, 'Updated')