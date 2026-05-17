from rest_framework import serializers
from .models import ShoppingCart, ShoppingCartItem, CartItemIngredient
from menu.serializers import IngredientSerializer


class CartItemIngredientReadingSerializer(serializers.ModelSerializer):
    
    ingredient = IngredientSerializer(read_only=True)
    
    class Meta:
        model = CartItemIngredient
        fields = [
            'id',
            'ingredient',
            'action',
            'quantity',
            'extra_price'
        ]


class ShoppingCartItemReadingSerializer(serializers.ModelSerializer):
    
    ingredients = CartItemIngredientReadingSerializer(
        many=True,
        read_only=True,
        source='cart_ingredients'
    )
    
    subtotal = serializers.DecimalField(
        max_digits=6,
        decimal_places=2,
        read_only=True
    )
    
    class Meta:
        model = ShoppingCartItem
        fields = [
            'id',
            'product',
            'quantity',
            'unit_price',
            'extras_total',
            'subtotal',
            'notes',
            'ingredients',
            'created_at',
            'updated_at',
        ]


class ShoppingCartReadingSerializer(serializers.ModelSerializer):
    
    items = ShoppingCartItemReadingSerializer(
        many=True,
        read_only=True
    )
    
    total = serializers.DecimalField(
        max_digits=6, 
        decimal_places=2,
        read_only=True
    )
    
    class Meta:
        model = ShoppingCart
        fields = [
            'total',
            'items'
        ]


class CartItemIngredientWritingSerializable(serializers.ModelSerializer):
    
    class Meta:
        model = CartItemIngredient
        fields = [
            'ingredient',
            'action',
            'quantity'
        ]

class ShoppingCartItemWritingSerializer(serializers.ModelSerializer):
    
    ingredients = CartItemIngredientWritingSerializable(
        many=True,
        required=False
    )
    
    class Meta:
        model = ShoppingCartItem
        fields = [
            'product',
            'quantity',
            'notes',
            'ingredients'
        ]
    
    def create(self, validated_data):
        
        ingredients_data = validated_data.pop('ingredients', [])
        
        product = validated_data['product']
        
        item = ShoppingCartItem.objects.create(
            unit_price=product.price,
            **validated_data
        )
        
        for ingredient_data in ingredients_data:
            
            ingredient = ingredient_data['ingredient']
            
            extra_price = (
                ingredient.extra_price
                if ingredient_data['action'] == 'extra'
                else 0
            )
            
            CartItemIngredient.objects.create(
                cart_item=item,
                extra_price=extra_price,
                **ingredient_data
            )
        
        return item
    
    
    def update(self, instance, validated_data):

        ingredients_data = validated_data.pop(
            'ingredients',
            []
        )

        instance.quantity = validated_data.get(
            'quantity',
            instance.quantity
        )

        instance.notes = validated_data.get(
            'notes',
            instance.notes
        )

        instance.save()

        # Remove previous ingredients
        instance.cart_ingredients.all().delete()

        # Recreate ingredients
        for ingredient_data in ingredients_data:

            ingredient = ingredient_data['ingredient']

            extra_price = (
                ingredient.extra_price
                if ingredient_data['action'] == 'extra'
                else 0
            )

            CartItemIngredient.objects.create(
                cart_item=instance,
                extra_price=extra_price,
                **ingredient_data
            )

        return instance