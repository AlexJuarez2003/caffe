from rest_framework.viewsets import ModelViewSet
from .models import Ingredient, Product
from .serializers import (
        IngredientSerializer, 
        ProductWriteSerializer, 
        ProductDetailReadingSerializer, 
        ProductListReadingSerializer
    )


class IngredientViewSet(ModelViewSet):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer


class ProductViewSet(ModelViewSet):

    def get_queryset(self):

        if self.action == 'list':
            return Product.objects.filter(is_available=True)

        return Product.objects.prefetch_related(
            'product_ingredients__ingredient'
        ).select_related(
            'meal',
            'drink',
            'dessert',
            'snack'
        )

    def get_serializer_class(self):

        if self.action == 'list':
            return ProductListReadingSerializer

        if self.action == 'retrieve':
            return ProductDetailReadingSerializer

        return ProductWriteSerializer