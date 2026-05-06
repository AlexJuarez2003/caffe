from django.apps import AppConfig


class AccountsConfig(AppConfig):
    name = 'accounts'

class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'users'

    def ready(self):
        import accounts.signals