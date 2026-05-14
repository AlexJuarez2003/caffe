import json
from pathlib import Path

from django.core.management.base import BaseCommand
from django.db import transaction

from logistics.models import (
    DeliveryArea,
    Building,
    Classroom
)


class Command(BaseCommand):
    help = "Carga infraestructura desde infrastructure.json"

    @transaction.atomic
    def handle(self, *args, **kwargs):

        # Ruta:
        # logistics/management/commands/seed_infrastructure.py
        # Subimos hasta logistics/
        base_dir = Path(__file__).resolve().parent.parent.parent

        json_path = base_dir / "seed_data" / "infrastructure.json"

        if not json_path.exists():
            self.stdout.write(
                self.style.ERROR(
                    f"No se encontró el archivo: {json_path}"
                )
            )
            return

        with open(json_path, "r", encoding="utf-8") as file:
            data = json.load(file)

        delivery_areas_data = data.get("delivery_areas", [])

        for area_data in delivery_areas_data:

            delivery_area, created = DeliveryArea.objects.get_or_create(
                name=area_data["name"],
                defaults={
                    "description": area_data.get("description"),
                    "estimated_time": area_data.get("estimated_time", 10),
                    "is_active": True
                }
            )

            # Actualizar datos si ya existe
            if not created:
                delivery_area.description = area_data.get("description")
                delivery_area.estimated_time = area_data.get(
                    "estimated_time",
                    delivery_area.estimated_time
                )
                delivery_area.is_active = True
                delivery_area.save()

            self.stdout.write(
                self.style.SUCCESS(
                    f"Área procesada: {delivery_area.name}"
                )
            )

            buildings_data = area_data.get("buildings", [])

            for building_data in buildings_data:

                building, _ = Building.objects.get_or_create(
                    name=building_data["name"],
                    delivery_area=delivery_area
                )

                self.stdout.write(
                    f"  └── Edificio: {building.name}"
                )

                classrooms_data = building_data.get("classrooms", [])

                for classroom_data in classrooms_data:

                    classroom, classroom_created = (
                        Classroom.objects.get_or_create(
                            name=classroom_data["name"],
                            building=building,
                            defaults={
                                "floor": classroom_data.get("floor")
                            }
                        )
                    )

                    # Actualizar piso si ya existe
                    if not classroom_created:
                        classroom.floor = classroom_data.get(
                            "floor",
                            classroom.floor
                        )
                        classroom.save()

                    self.stdout.write(
                        f"       └── Salón: {classroom.name}"
                    )

        self.stdout.write(
            self.style.SUCCESS(
                "\nInfraestructura cargada correctamente."
            )
        )