from django.contrib.auth.models import AbstractUser
from django.db import models
from logistics.models import DeliveryArea

class User(AbstractUser):
    username = None # Disable default username
    
    email = models.EmailField(unique=True) # unique field
    
    creation_date = models.DateTimeField(auto_now_add=True)
    
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    
    ROLE_CHOICES = (
        ('admin', 'Administrador'),
        ('chef', 'Cocinero'),
        ('delivery', 'Repartidor'),
        ('customer', 'Cliente'),
    )
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')
    
    # Set email for authentication
    USERNAME_FIELD = 'email'
    
    # No additional field required for login
    REQUIRED_FIELDS = []
    
    def __str__(self):
        return self.email


class Chef(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='chef')
    
    SHIFT_CHOICES = (
        ('morning', 'Matutino'),
        ('evening', 'Vespertino'),
    )
    
    shift = models.CharField(max_length=20, choices=SHIFT_CHOICES, default='morning')
    
    def __str__(self):
        return f"{self.user.email} - Chef"


class Delivery(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='delivery')
    delivery_area = models.ForeignKey(DeliveryArea, on_delete=models.SET_NULL, null=True, related_name='deliveries')
    
    is_available = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.user.email} - Delivery"