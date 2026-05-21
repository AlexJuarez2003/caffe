from django.apps import AppConfig

class ShoppingCartConfig(AppConfig):

    default_auto_field = 'django.db.models.BigAutoField'
    name = 'shopping_cart'

    def ready(self):
        import shopping_cart.signals