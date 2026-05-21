from django.db.models.signals import post_save
from django.dispatch import receiver

from accounts.models import Customer
from .models import ShoppingCart


@receiver(post_save, sender=Customer)
def create_shopping_cart(sender, instance, created, **kwargs):

    if created:
        ShoppingCart.objects.create(customer=instance)