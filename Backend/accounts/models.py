from django.contrib.auth.models import BaseUserManager
from django.contrib.auth.models import AbstractUser
from logistics.models import DeliveryArea
from django.db import models

# Customize manager behaivor
class CustomUserManager(BaseUserManager):

    def create_user(self, email, password=None, **extra_fields):

        # Email required
        if not email:
            raise ValueError('The email field is required')

        # Normalize email domain
        email = self.normalize_email(email)

        # Create object in memory with additional data
        user = self.model(
            email=email,
            **extra_fields
        )

        # Encrypt the password
        user.set_password(password)

        # Save to the database
        user.save(using=self._db)

        return user

    # Method to create a superuser
    def create_superuser(self, email, password=None, **extra_fields):

        # Add permissions
        extra_fields.setdefault('is_staff', True) # Allows login in /admin
        extra_fields.setdefault('is_superuser', True) # Grant database permissions

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    username = None # Disable default username
    
    email = models.EmailField(unique=True) # unique field
    
    creation_date = models.DateTimeField(auto_now_add=True)
    
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    
    ROLE_CHOICES = (
        ('Administrador', 'Administrador'),
        ('Cocinero', 'Cocinero'),
        ('Repartidor', 'Repartidor'),
        ('Cliente', 'Cliente'),
    )
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='Cliente')
    
    # Set email for authentication
    USERNAME_FIELD = 'email'
    
    # No additional field required for login
    REQUIRED_FIELDS = []
    
    # Use custom logic to interact with the DB
    objects = CustomUserManager()
    
    def __str__(self):
        return self.email


class Chef(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='chef')
    
    SHIFT_CHOICES = (
        ('matutino', 'Matutino'),
        ('vespertino', 'Vespertino'),
    )
    
    shift = models.CharField(max_length=20, choices=SHIFT_CHOICES, default='Matutino')
    
    def __str__(self):
        return f"{self.user.email} - Chef"


class Delivery(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='delivery')
    delivery_area = models.ForeignKey(DeliveryArea, on_delete=models.SET_NULL, null=True, related_name='deliveries')
    
    is_available = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.user.email} - Delivery"


class Customer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='customer')
    
    department = models.CharField(max_length=50, blank=True, null=True)
    control_number = models.CharField(max_length=20, blank=True, null=True)
    
    def __str__(self):
        return f"{self.user.email} - Customer"