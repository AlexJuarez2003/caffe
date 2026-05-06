from rest_framework.viewsets import ModelViewSet
from .models import Ingredient, Product
from .serializers import IngredientSerializer, ProductWriteSerializer, ProductReadSerializer

class IngredientViewSet(ModelViewSet):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer
    
class ProductViewSet(ModelViewSet):
    queryset = Product.objects.all()
    
    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return ProductReadSerializer
        return ProductWriteSerializer