from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from .models import Order, OrderItem, OrderItemIngredient, DeliveryLocation
from .serializers import (
    OrderSerializer,
    OrderFromCartSerializer,
    OrderFromMenuSerializer,
)
from shopping_cart.models import ShoppingCartItem
from logistics.models import Classroom, DeliveryArea
from menu.models import Product, Ingredient
from accounts.models import Delivery


def crear_delivery_location(order, location_data):
    if not location_data:
        return

    classroom_id = location_data.get('classroom')
    delivery_area_id = location_data.get('delivery_area')

    DeliveryLocation.objects.create(
        order=order,
        classroom_id=classroom_id,
        delivery_area_id=delivery_area_id,
        reference=location_data.get('reference'),
        custom_location=location_data.get('custom_location'),
    )


def crear_order_item(order, product, quantity, unit_price, notes, ingredients_data):
    item = OrderItem.objects.create(
        order=order,
        product=product,
        quantity=quantity,
        unit_price=unit_price,
        notes=notes,
    )

    for ing_data in ingredients_data:
        ingredient_id = ing_data.get('ingredient')
        action = ing_data.get('action', 'normal')
        ing_quantity = ing_data.get('quantity', 1)

        try:
            ingredient = Ingredient.objects.get(id=ingredient_id)
            extra_price = ingredient.extra_price if action == 'extra' else 0

            OrderItemIngredient.objects.create(
                order_item=item,
                ingredient=ingredient,
                action=action,
                quantity=ing_quantity,
                extra_price=extra_price,
            )
        except Ingredient.DoesNotExist:
            pass

    return item


class OrderFromCartView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        serializer = OrderFromCartSerializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        customer = request.user.customer

        # Crear pedido
        order = Order.objects.create(
            customer=customer,
            payment_method=data['payment_method'],
            details=data.get('details'),
        )

        # Copiar items del carrito
        cart_items = ShoppingCartItem.objects.filter(
            id__in=data['cart_item_ids']
        ).prefetch_related('cart_ingredients__ingredient')

        for cart_item in cart_items:
            ingredients_data = [
                {
                    'ingredient': ci.ingredient.id,
                    'action': ci.action,
                    'quantity': ci.quantity,
                }
                for ci in cart_item.cart_ingredients.all()
            ]

            crear_order_item(
                order=order,
                product=cart_item.product,
                quantity=cart_item.quantity,
                unit_price=cart_item.unit_price,
                notes=cart_item.notes,
                ingredients_data=ingredients_data,
            )

            # Eliminar item del carrito
            cart_item.delete()

        # Crear ubicación de entrega
        crear_delivery_location(order, data.get('delivery_location'))

        # Calcular total
        order.recalculate_total()

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class OrderFromMenuView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        serializer = OrderFromMenuSerializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        customer = request.user.customer

        order = Order.objects.create(
            customer=customer,
            payment_method=data['payment_method'],
            details=data.get('details'),
        )

        for item_data in data['items']:
            try:
                product = Product.objects.get(id=item_data['product'])
            except Product.DoesNotExist:
                return Response(
                    {'error': f"Producto {item_data['product']} no encontrado."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            crear_order_item(
                order=order,
                product=product,
                quantity=item_data['quantity'],
                unit_price=product.price,
                notes=item_data.get('notes'),
                ingredients_data=item_data.get('ingredients', []),
            )

        crear_delivery_location(order, data.get('delivery_location'))

        order.recalculate_total()

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class OrderListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        customer = request.user.customer
        orders = Order.objects.filter(
            customer=customer
        ).prefetch_related(
            'items__ingredients__ingredient',
            'delivery_location'
        ).order_by('-date', '-time')

        return Response(OrderSerializer(orders, many=True).data)


class OrderDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            order = Order.objects.prefetch_related(
                'items__ingredients__ingredient',
                'delivery_location'
            ).get(pk=pk, customer=request.user.customer)
        except Order.DoesNotExist:
            return Response({'error': 'Pedido no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        return Response(OrderSerializer(order).data)

'''
class OrderStatusUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            order = Order.objects.get(pk=pk)
        except Order.DoesNotExist:
            return Response({'error': 'Pedido no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get('status')
        valid_statuses = [s[0] for s in Order.STATUS_CHOICES]

        if new_status not in valid_statuses:
            return Response({'error': 'Estado inválido.'}, status=status.HTTP_400_BAD_REQUEST)

        order.status = new_status
        order.save(update_fields=['status'])

        return Response(OrderSerializer(order).data)
'''

class OrderListByRoleView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        role = request.user.role

        if role == "Cocinero":
            orders = Order.objects.filter(
                status__in=["pending", "preparing"]
            ).prefetch_related(
                "items__ingredients__ingredient",
                "delivery_location"
            ).order_by("date", "time")

        elif role == "Repartidor":
            orders = Order.objects.filter(
                status="ready"
            ).prefetch_related(
                "items__ingredients__ingredient",
                "delivery_location"
            ).order_by("date", "time")

        elif role == "Administrador":
            orders = Order.objects.all().prefetch_related(
                "items__ingredients__ingredient",
                "delivery_location"
            ).order_by("-date", "-time")

        else:
            return Response(
                {"error": "No tienes permiso para ver pedidos."},
                status=status.HTTP_403_FORBIDDEN
            )

        return Response(OrderSerializer(orders, many=True).data)


class OrderStatusUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    VALID_TRANSITIONS = {
        "Cocinero": {
            "pending": "preparing",
            "preparing": "ready",
        },
        "Repartidor": {
            "ready": "delivering",
            "delivering": "delivered",
        },
        "Administrador": {
            "pending": "preparing",
            "preparing": "ready",
            "ready": "delivering",
            "delivering": "delivered",
            # "pending": "cancelled",
        },
    }

    def patch(self, request, pk):
        try:
            order = Order.objects.get(pk=pk)
        except Order.DoesNotExist:
            return Response({"error": "Pedido no encontrado."}, status=status.HTTP_404_NOT_FOUND)

        role = request.user.role
        new_status = request.data.get("status")

        transitions = self.VALID_TRANSITIONS.get(role, {})

        if order.status not in transitions:
            return Response(
                {"error": f"No puedes cambiar el estado de un pedido '{order.status}'."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if new_status != transitions[order.status]:
            return Response(
                {"error": f"Transición inválida: '{order.status}' → '{new_status}'."},
                status=status.HTTP_400_BAD_REQUEST
            )

        order.status = new_status
        order.save(update_fields=["status"])
        
        if new_status == "delivering" and role == "Repartidor":
            try:
                delivery = Delivery.objects.get(user=request.user)
                if hasattr(order, 'delivery_location') and order.delivery_location:
                    order.delivery_location.delivery = delivery
                    order.delivery_location.save(update_fields=["delivery"])
            except Delivery.DoesNotExist:
                pass

        return Response(OrderSerializer(order).data)

class InStoreSaleView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        role = request.user.role
        if role not in ["Cocinero", "Administrador"]:
            return Response({"error": "No tienes permiso."}, status=status.HTTP_403_FORBIDDEN)

        items_data = request.data.get("items", [])
        if not items_data:
            return Response({"error": "Se requiere al menos un producto."}, status=status.HTTP_400_BAD_REQUEST)

        customer = getattr(request.user, 'customer', None)

        order = Order.objects.create(
            customer=customer,
            payment_method="cash",
            status="delivered",
            is_in_store=True,
        )

        for item_data in items_data:
            try:
                product = Product.objects.get(id=item_data["product"])
            except Product.DoesNotExist:
                return Response(
                    {"error": f"Producto {item_data['product']} no encontrado."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            crear_order_item(
                order=order,
                product=product,
                quantity=item_data["quantity"],
                unit_price=product.price,
                notes=None,
                ingredients_data=[],
            )

        order.recalculate_total()
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
    
class DeliveryHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "Repartidor":
            return Response({"error": "No tienes permiso."}, status=status.HTTP_403_FORBIDDEN)

        try:
            delivery = Delivery.objects.get(user=request.user)
        except Delivery.DoesNotExist:
            return Response({"error": "Repartidor no encontrado."}, status=status.HTTP_404_NOT_FOUND)

        orders = Order.objects.filter(
            status="delivered",
            delivery_location__delivery=delivery
        ).prefetch_related(
            "items__ingredients__ingredient",
            "delivery_location"
        ).order_by("-date", "-time")

        return Response(OrderSerializer(orders, many=True).data)