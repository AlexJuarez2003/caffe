from rest_framework import serializers
from .models import DeliveryArea, Building, Classroom

# Complete CRUD serializer
class DeliveryAreaSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = DeliveryArea
        fields = '__all__'


class BuildingSerializer(serializers.ModelSerializer):
    
    # Add custom field to JSON response
    delivery_area_name = serializers.CharField(
        source = 'delivery_area.name',
        read_only = True
    )
    
    class Meta:
        model = Building
        fields = '__all__'


class ClassroomSerializer(serializers.ModelSerializer):
    building_name = serializers.CharField(
        source = 'building.name',
        read_only = True
    )
    
    class Meta:
        model = Classroom
        fields = '__all__'