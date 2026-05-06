from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User, Chef, Delivery

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        if instance.role == 'chef':
            Chef.objects.create(user=instance)
        elif instance.role == 'delivery':
            Delivery.objects.create(user=instance)