from django.urls import path
from .views import RegisterAPIView, ProfileMeAPIView

app_name = 'users'

urlpatterns = [
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('me/', ProfileMeAPIView.as_view(), name='profile-me'),
]

