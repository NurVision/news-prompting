from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # Qo'shimcha maydonlar
    bio = models.TextField(blank=True, null=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    # Istasangiz boshqa maydonlar ham qo'shishingiz mumkin

    def __str__(self):
        return self.username

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone = models.CharField(max_length=20, blank=True)
    address = models.CharField(max_length=255, blank=True)
    website = models.URLField(blank=True)
    # Istasangiz boshqa maydonlar ham qo'shishingiz mumkin

    def __str__(self):
        return f"{self.user.username} profili"
