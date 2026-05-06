from django.db import models


class DeliveryArea(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    estimated_time = models.PositiveIntegerField(help_text="Estimated time in minutes")
    
    def __str__(self):
        return self.name
    
class Building(models.Model):
    delivery_area = models.ForeignKey(DeliveryArea, on_delete=models.SET_NULL, null=True, related_name='buildings')
    
    name = models.CharField(max_length=50)
    
    def __str__(self):
        return self.name
    
class Classroom(models.Model):
    building = models.ForeignKey(Building, on_delete=models.CASCADE, related_name='classrooms')
    
    name = models.CharField(max_length=20)
    floor = models.PositiveIntegerField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.name} - {self.building.name}"