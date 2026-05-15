from rest_framework.viewsets import ModelViewSet
from .models import Ingredient, Product
from .serializers import IngredientSerializer, ProductWriteSerializer, ProductReadSerializer

from rest_framework import status
from rest_framework.response import Response

class IngredientViewSet(ModelViewSet):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer
    
class ProductViewSet(ModelViewSet):
    queryset = Product.objects.all()
    
    '''
    queryset = Product.objects.prefetch_related(
        'product_ingredients__ingredient'
    ).select_related(
        'meal',
        'drink',
        'dessert',
        'snack'
    )
    '''

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return ProductReadSerializer
        return ProductWriteSerializer
    
    '''
    def create(self, request, *args, **kwargs):
        serializer = ProductWriteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        product = serializer.save()

        read_serializer = ProductReadSerializer(product)

        return Response(
            read_serializer.data,
            status=status.HTTP_201_CREATED
        )

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)

        instance = self.get_object()

        serializer = ProductWriteSerializer(
            instance,
            data=request.data,
            partial=partial
        )

        serializer.is_valid(raise_exception=True)

        product = serializer.save()

        read_serializer = ProductReadSerializer(product)

        return Response(read_serializer.data)
        '''