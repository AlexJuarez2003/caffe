from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser

from .models import DeliveryArea, Building, Classroom
from .serializers import DeliveryAreaSerializer, BuildingSerializer, ClassroomSerializer


# Generate CRUD Endpoints
class DeliveryAreaViewSet(viewsets.ModelViewSet):
    queryset = DeliveryArea.objects.all()
    serializer_class = DeliveryAreaSerializer
    # permission_classes = [IsAdminUser]


class BuildingViewSet(viewsets.ModelViewSet):
    
    # Optimize the SQl request to the DB
    queryset = Building.objects.select_related('delivery_area').all()
    
    serializer_class = BuildingSerializer
    # permission_classes = [IsAdminUser]


class ClassroomViewSet(viewsets.ModelViewSet):
    queryset = Classroom.objects.select_related('building', 'building__delivery_area').all()
    serializer_class = ClassroomSerializer
    # permission_classes = [IsAdminUser]