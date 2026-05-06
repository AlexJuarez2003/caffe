from django.db import models

class Ingredient(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    
    is_allergen = models.BooleanField(default=False)
    allergen_type = models.CharField(max_length=50, blank=True)
    
    unit = models.CharField(max_length=20) # ml, g, piece
    base_quantity = models.DecimalField(max_digits=8, decimal_places=2)
    
    calories = models.FloatField(default=0)
    protein = models.FloatField(default=0)
    carbohydrates = models.FloatField(default=0)
    fat = models.FloatField(default=0)
    
    extra_price = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    stock = models.DecimalField(max_digits=10, decimal_places=2)
    
    def __str__(self):
        return self.name


class Product(models.Model):
    PRODUCT_TYPE_CHOICES = (
        ('meal', 'Meal'),
        ('drink', 'Drink'),
        ('dessert', 'Dessert'),
        ('snack', 'Snack')
    )
    
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    image_url = models.URLField(blank=True)
    
    product_type = models.CharField(max_length=10, choices=PRODUCT_TYPE_CHOICES)
    
    ingredients = models.ManyToManyField(Ingredient, through='ProductIngredient', related_name='products')
    
    stock = models.PositiveIntegerField(default=0)
    is_available = models.BooleanField(default=True)
    
    def __str__(self):
        return self.name


class ProductIngredient(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product_ingredients')
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    
    is_optional = models.BooleanField(default=False)
    quantity = models.FloatField()
    max_quantity = models.FloatField(null=True, blank=True)
    
    unit = models.CharField(max_length=20)
    
    def __str__(self):
        return f"{self.product.name} - {self.ingredient.name}"    


class Meal(models.Model):
    product = models.OneToOneField(Product, on_delete=models.CASCADE, related_name='meal')
    preparation_time = models.PositiveIntegerField(help_text='Minutos')
    
    
class Drink(models.Model):
    product = models.OneToOneField(Product, on_delete=models.CASCADE, related_name='drink')
    volume = models.PositiveIntegerField(help_text='ml')
    
    
class Dessert(models.Model):
    product = models.OneToOneField(Product, on_delete=models.CASCADE, related_name='dessert')
    size = models.CharField(max_length=20)
    

class Snack(models.Model):
    product = models.OneToOneField(Product, on_delete=models.CASCADE, related_name='snack')
    size = models.CharField(max_length=20)
    is_packaged = models.BooleanField(default=False)
    
