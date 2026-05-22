from rest_framework import serializers
from .models import Order, OrderItem, OrderItemIngredient, DeliveryLocation
from menu.models import Product, Ingredient
from shopping_cart.models import ShoppingCartItem


class OrderItemIngredientSerializer(serializers.ModelSerializer):
    ingredient_name = serializers.CharField(source='ingredient.name', read_only=True)

    class Meta:
        model = OrderItemIngredient
        fields = ['id', 'ingredient', 'ingredient_name', 'quantity', 'extra_price', 'action']


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    ingredients = OrderItemIngredientSerializer(many=True, read_only=True)
    subtotal = serializers.DecimalField(max_digits=8, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'unit_price', 'notes', 'subtotal', 'ingredients']


class DeliveryLocationSerializer(serializers.ModelSerializer):
    classroom_name = serializers.CharField(source='classroom.name', read_only=True)
    building_name = serializers.CharField(source='classroom.building.name', read_only=True)
    area_name = serializers.CharField(source='delivery_area.name', read_only=True)

    class Meta:
        model = DeliveryLocation
        fields = ['id', 'delivery', 'classroom', 'classroom_name', 'building_name', 'delivery_area', 'area_name', 'reference', 'custom_location']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    delivery_location = DeliveryLocationSerializer(read_only=True)
    customer_email = serializers.EmailField(source='customer.user.email', read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'reference', 'customer_email', 'date', 'time', 'total', 'status', 'payment_method', 'details', 'items', 'delivery_location']



class DeliveryLocationWriteSerializer(serializers.Serializer):
    classroom = serializers.IntegerField(required=False, allow_null=True)
    delivery_area = serializers.IntegerField(required=False, allow_null=True)
    reference = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    custom_location = serializers.CharField(required=False, allow_null=True, allow_blank=True)


class OrderItemWriteSerializer(serializers.Serializer):
    product = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)
    notes = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    ingredients = serializers.ListField(
        child=serializers.DictField(), required=False, default=list
    )


class OrderFromCartSerializer(serializers.Serializer):
    cart_item_ids = serializers.ListField(
        child=serializers.IntegerField(), min_length=1
    )
    payment_method = serializers.ChoiceField(choices=['cash', 'card', 'transfer'])
    details = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    delivery_location = DeliveryLocationWriteSerializer(required=False, allow_null=True)

    def validate_cart_item_ids(self, ids):
        customer = self.context['request'].user.customer
        items = ShoppingCartItem.objects.filter(id__in=ids, shopping_cart__customer=customer)
        if items.count() != len(ids):
            raise serializers.ValidationError("Uno o más items no pertenecen a tu carrito.")
        return ids


class OrderFromMenuSerializer(serializers.Serializer):
    items = OrderItemWriteSerializer(many=True, min_length=1)
    payment_method = serializers.ChoiceField(choices=['cash', 'card', 'transfer'])
    details = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    delivery_location = DeliveryLocationWriteSerializer(required=False, allow_null=True)