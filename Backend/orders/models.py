from django.db import models
from accounts.models import Customer, Delivery
from menu.models import Product, Ingredient
from logistics.models import DeliveryArea
from decimal import Decimal


class Order(models.Model):

    STATUS_CHOICES = (
        ('pending', 'Pendiente'),
        ('preparing', 'En preparación'),
        ('ready', 'Listo'),
        ('delivering', 'En camino'),
        ('delivered', 'Entregado'),
        ('cancelled', 'Cancelado'),
    )

    PAYMENT_CHOICES = (
        ('cash', 'Efectivo'),
        ('card', 'Tarjeta'),
        ('transfer', 'Transferencia'),
    )

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='orders', null=True, blank=True)
    reference = models.CharField(max_length=20, unique=True, blank=True)
    date = models.DateField(auto_now_add=True)
    time = models.TimeField(auto_now_add=True)
    total = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_CHOICES, default='cash')
    details = models.TextField(blank=True, null=True)
    is_in_store = models.BooleanField(default=False)

    def generate_reference(self):
        return f"ORD-{self.date.strftime('%Y%m%d')}-{self.id:04d}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if not self.reference:
            self.reference = self.generate_reference()
            super().save(update_fields=['reference'])

    def recalculate_total(self):
        self.total = sum(item.subtotal for item in self.items.all())
        self.save(update_fields=['total'])

    def __str__(self):
        return f"{self.reference} - {self.customer.user.email}"


class OrderItem(models.Model):

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, related_name='order_items')
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=6, decimal_places=2)
    notes = models.CharField(max_length=120, blank=True, null=True)

    @property
    def subtotal(self):
        extras_total = sum(
            (
                ingredient.extra_price
                for ingredient in self.ingredients.filter(action='extra')
            ),
            Decimal('0.00')
        )
        return (self.unit_price + extras_total) * self.quantity

    def __str__(self):
        return f"{self.product.name} x{self.quantity} — {self.order.reference}"


class OrderItemIngredient(models.Model):

    ACTION_CHOICES = (
        ('normal', 'Normal'),
        ('removed', 'Removido'),
        ('extra', 'Extra'),
        ('modified', 'Modificado'),
    )

    order_item = models.ForeignKey(OrderItem, on_delete=models.CASCADE, related_name='ingredients')
    ingredient = models.ForeignKey(Ingredient, on_delete=models.SET_NULL, null=True, related_name='order_ingredients')
    quantity = models.PositiveIntegerField(default=1)
    extra_price = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    action = models.CharField(max_length=10, choices=ACTION_CHOICES, default='normal')

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['order_item', 'ingredient', 'action'],
                name='unique_order_item_ingredient_action'
            )
        ]

    def __str__(self):
        return f"{self.ingredient.name} ({self.action}) — {self.order_item}"


class DeliveryLocation(models.Model):

    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='delivery_location')
    delivery = models.ForeignKey(Delivery, on_delete=models.SET_NULL, null=True, blank=True, related_name='deliveries')
    classroom = models.ForeignKey('logistics.Classroom', on_delete=models.SET_NULL, null=True, blank=True, related_name='deliveries')
    delivery_area = models.ForeignKey('logistics.DeliveryArea', on_delete=models.SET_NULL, null=True, blank=True, related_name='location_deliveries')
    reference = models.CharField(max_length=120, blank=True, null=True)
    custom_location = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"Entrega — {self.order.reference}"