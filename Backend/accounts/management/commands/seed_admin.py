from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from accounts.serializers import UserSignUpSerializer
import getpass

User = get_user_model()

class Command(BaseCommand):
    help = 'Crea un administrador solicitando datos por consola'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.WARNING("=== Crear administrador ==="))

        # Pedir datos
        first_name = input("Nombre: ")
        last_name = input("Apellido: ")
        email = input("Email: ")
        phone_number = input("Telefono: ")
        password = getpass.getpass("Password: ")

        # Preparar datos
        data = {
            "first_name": first_name,
            "last_name": last_name,
            "email": email,
            "password": password,
            "phone_number": phone_number,
        }

        # Usar serializer
        serializer = UserSignUpSerializer(data=data)

        if serializer.is_valid():
            serializer.save(role="Administrador")
            self.stdout.write(self.style.SUCCESS("Administrador creado correctamente"))
        else:
            self.stdout.write(self.style.ERROR("Error al crear el administrador"))
            self.stdout.write(str(serializer.errors))