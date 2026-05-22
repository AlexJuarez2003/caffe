from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import DeliveryArea, Building, Classroom
from .serializers import DeliveryAreaSerializer, BuildingSerializer, ClassroomSerializer


# Generate CRUD Endpoints
class DeliveryAreaViewSet(viewsets.ModelViewSet):
    queryset = DeliveryArea.objects.all()
    serializer_class = DeliveryAreaSerializer
    permission_classes = [IsAuthenticated]


class BuildingViewSet(viewsets.ModelViewSet):
        
    serializer_class = BuildingSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Optimize the SQl request to the DB
        queryset = Building.objects.select_related('delivery_area').all()
        
        area_id = self.request.query_params.get('area_id')
        if area_id is not None:
            queryset = queryset.filter(delivery_area_id=area_id)
            
        return queryset


class ClassroomViewSet(viewsets.ModelViewSet):

    serializer_class = ClassroomSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = Classroom.objects.select_related('building', 'building__delivery_area').all()
        
        building_id = self.request.query_params.get('building_id')
        if building_id is not None:
            queryset = queryset.filter(building_id=building_id)
            
        return queryset