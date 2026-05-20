from rest_framework import serializers
from .models import Ingredient, ProductIngredient, Meal, Drink, Dessert, Snack, Product
from django.db import transaction

# Serializer to register a new ingredient
class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = '__all__'
    
    def validate(self, data):
        if data.get("is_allergen") and not data.get("allergen_type"):
            raise serializers.ValidationError(
                {"allergen_type": "You must specify the type of allergen."}
            )
        return data
    
class ProductIngredientReadSerializer(serializers.ModelSerializer):
    ingredient_name = serializers.CharField(source='ingredient.name')
    extra_price = serializers.DecimalField(max_digits=6, decimal_places=2, source='ingredient.extra_price')

    class Meta:
        model = ProductIngredient
        fields = [
            'id',
            'ingredient',
            'ingredient_name',
            'quantity',
            'unit',
            'is_optional',
            'max_quantity',
            'min_quantity',
            'extra_price'
        ]
    
    def to_representation(self, instance):
        data = super().to_representation(instance)

        if data['max_quantity'] is None:
            data.pop('max_quantity')
        
        if data['min_quantity'] is None:
            data.pop('min_quantity')

        return data

class ProductIngredientWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductIngredient
        fields = ['ingredient', 'quantity', 'unit', 'is_optional', 'max_quantity', 'min_quantity']
       
class MealSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meal
        fields = ['preparation_time']
        
class DrinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Drink
        fields = ['volume']

class DessertSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dessert
        fields = ['size']
        
class SnackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Snack
        fields = ['size', 'is_packaged']

# Serializer for registering a new menu item
class ProductWriteSerializer(serializers.ModelSerializer):
    ingredients = ProductIngredientWriteSerializer(many=True, write_only=True, required=False)
    
    meal = MealSerializer(required=False, allow_null=True)
    drink = DrinkSerializer(required=False, allow_null=True)
    dessert = DessertSerializer(required=False, allow_null=True)
    snack = SnackSerializer(required=False, allow_null=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'product_type', 'stock', 'is_available', 'image_url',
            'ingredients',
            'meal', 'drink', 'dessert', 'snack'
        ]
        
    def validate(self, data):
        product_type = data.get('product_type')
        
        if product_type == 'meal' and not data.get('meal'):
            raise serializers.ValidationError('Meal data required')
        
        if product_type == 'drink' and not data.get('drink'):
            raise serializers.ValidationError('Drink data required')
        
        if product_type == 'dessert' and not data.get('dessert'):
            raise serializers.ValidationError('Dessert data required')
        
        if product_type == 'snack' and not data.get('snack'):
            raise serializers.ValidationError('Snack data required')
        
        return data
    
    @transaction.atomic
    def create(self, validated_data):
        ingredients_data = validated_data.pop('ingredients', [])
        
        meal_data = validated_data.pop('meal', None)
        drink_data = validated_data.pop('drink', None)
        dessert_data = validated_data.pop('dessert', None)
        snack_data = validated_data.pop('snack', None)
        
        product = Product.objects.create(**validated_data)
        
        for item in ingredients_data:
            ProductIngredient.objects.create(product=product, **item)
            
        if product.product_type == 'meal' and meal_data:
            Meal.objects.create(product=product, **meal_data)
            
        elif product.product_type == 'drink' and drink_data:
            Drink.objects.create(product=product, **drink_data)
            
        elif product.product_type == 'dessert' and dessert_data:
            Dessert.objects.create(product=product, **dessert_data)
            
        elif product.product_type == 'snack' and snack_data:
            Snack.objects.create(product=product, **snack_data)
            
        return product
    
    @transaction.atomic
    def update(self, instance, validated_data):
        ingredients_data = validated_data.pop('ingredients', None)
        
        meal_data = validated_data.pop('meal', None)
        drink_data = validated_data.pop('drink', None)
        dessert_data = validated_data.pop('dessert', None)
        snack_data = validated_data.pop('snack', None)
        
        old_type = instance.product_type
        new_type = validated_data.get('product_type', old_type)
        
        # Update basic fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Ingredients
        if ingredients_data is not None:
            instance.product_ingredients.all().delete()
            
            ProductIngredient.objects.bulk_create([
                ProductIngredient(
                    product=instance,
                    **item
                )
                for item in ingredients_data
            ])

        # Delete subtype only if type changes
        if old_type != new_type:
            Meal.objects.filter(product=instance).delete()
            Drink.objects.filter(product=instance).delete()
            Dessert.objects.filter(product=instance).delete()
            Snack.objects.filter(product=instance).delete()
        
        # Recreate subtype if provided
        if instance.product_type == 'meal' and meal_data:
            Meal.objects.create(product=instance, **meal_data)
        
        elif instance.product_type == 'drink' and drink_data:
            Drink.objects.create(product=instance, **drink_data)
            
        elif instance.product_type == 'dessert' and dessert_data:
            Dessert.objects.create(product=instance, **dessert_data)
        
        elif instance.product_type == 'snack' and snack_data:
            Snack.objects.create(product=instance, **snack_data)
        
        return instance

# Returns all the information about a product
class ProductDetailReadingSerializer(serializers.ModelSerializer):
    ingredients = ProductIngredientReadSerializer(
        source='product_ingredients',
        many=True
    )

    meal = MealSerializer(read_only=True)
    drink = DrinkSerializer(read_only=True)
    dessert = DessertSerializer(read_only=True)
    snack = SnackSerializer(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'description',
            'price',
            'product_type',
            'stock',
            'is_available',
            'ingredients',
            'meal',
            'drink',
            'dessert',
            'snack'
        ]
        
    def to_representation(self, instance):
        data = super().to_representation(instance)

        for field in ['meal', 'drink', 'dessert', 'snack']:
            if data[field] is None:
                data.pop(field)

        return data

# Return only the product list for the MENU
class ProductListReadingSerializer(serializers.ModelSerializer):
    
    meal = MealSerializer(read_only=True)
    drink = DrinkSerializer(read_only=True)
    dessert = DessertSerializer(read_only=True)
    snack = SnackSerializer(read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'description',
            'price',
            'product_type',
            'stock',
            'meal',
            'drink',
            'dessert',
            'snack',
        ]
    
    def to_representation(self, instance):
        
        data = super().to_representation(instance)
        
        for field in ['meal', 'drink', 'dessert', 'snack']:
            if data[field] is None:
                data.pop(field)
            
        return data