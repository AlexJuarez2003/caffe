from django.db import models
from accounts.models import Customer
from menu.models import Product, Ingredient
from decimal import Decimal

class ShoppingCart(models.Model):
    
    customer = models.OneToOneField(Customer, on_delete=models.CASCADE, related_name='shopping_cart')

    @property
    def total(self):
        return sum(item.subtotal for item in self.items.all())


class ShoppingCartItem(models.Model):
    
    shopping_cart = models.ForeignKey(ShoppingCart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='cart_items')
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=6, decimal_places=2)
    notes = models.CharField(max_length=120, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    @property
    def subtotal(self):

        extras_total = sum(
            (
                cart_ingredient.extra_price * cart_ingredient.quantity
                for cart_ingredient in self.cart_ingredients.filter(action='extra')
            ),
            Decimal('0.00')
        )
        
        return (self.unit_price + extras_total) * self.quantity


class CartItemIngredient(models.Model):
    
    cart_item = models.ForeignKey(ShoppingCartItem, on_delete=models.CASCADE, related_name='cart_ingredients')
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE, related_name='cart_item_ingredients')
    
    ACTION_CHOICES = (
        ('normal', 'Normal'),
        ('remover', 'Remover'),
        ('extra', 'Extra')
    )
    
    action = models.CharField(max_length=10, choices=ACTION_CHOICES)
    quantity = models.PositiveIntegerField(default=1)
    extra_price = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['cart_item', 'ingredient', 'action'],
                name='unique_cart_item_ingredient_action'
            )
        ]