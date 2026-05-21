from rest_framework.generics import RetrieveAPIView, CreateAPIView, UpdateAPIView, DestroyAPIView
from rest_framework.permissions import IsAuthenticated
from .models import ShoppingCart, ShoppingCartItem
from .serializers import ShoppingCartReadingSerializer, ShoppingCartItemWritingSerializer


class ShoppingCartAPIView(RetrieveAPIView):

    serializer_class = ShoppingCartReadingSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):

        return (
            ShoppingCart.objects
            .prefetch_related(
                'items__product',
                'items__cart_ingredients__ingredient'
            )
            .get(customer=self.request.user.customer)
        )


class ShoppingCartItemCreateAPIView(CreateAPIView):
    
    serializer_class = ShoppingCartItemWritingSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        
        shopping_cart = self.request.user.customer.shopping_cart
        
        serializer.save(
            shopping_cart=shopping_cart
        )

class ShoppingCartItemUpdateAPIView(UpdateAPIView):
    
    serializer_class = ShoppingCartItemWritingSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        
        return ShoppingCartItem.objects.filter(
            shopping_cart__customer = self.request.user.customer
        ).prefetch_related(
            'cart_ingredients__ingredient'
        )


class ShoppingCartItemDestroyAPIView(DestroyAPIView):
    
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        
        return ShoppingCartItem.objects.filter(
            shopping_cart__customer = self.request.user.customer
        )