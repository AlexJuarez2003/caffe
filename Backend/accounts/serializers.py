from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password
from .models import User, Chef, Customer, Delivery
from rest_framework import serializers


# REGISTRATION CLASSES

class UserSignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'password']
        
        # Do not return password, only enter it
        extra_kwargs = {
            'password': {'write_only': True},
        }
    
    # Pending
    def validate_email(self, value):
        # regex=r'^\d{10}$'
        
        return value
    
    def validate_password(self, value):
        try:
            # Apply rules from validation defined in settings.py
            validate_password(value)
            
        except DjangoValidationError as e:
            raise serializers.ValidationError(e.messages)
        
        return value
    
    def create(self, validated_data):
        
        return User.objects.create_user(**validated_data)


class CustomerSignUpSerializer(serializers.ModelSerializer):
    
    user = UserSignUpSerializer()
    
    class Meta:
        model = Customer
        fields = ['department', 'control_number', 'user']
        
        extra_kwargs = {
            'department': {'required': False},
            'control_number': {'required': False},
        }
    
    def create(self, validated_data):
        
        user_data = validated_data.pop('user')
        
        # Create user
        user_serializer = UserSignUpSerializer(data=user_data)
        user_serializer.is_valid(raise_exception=True)
        
        user = user_serializer.save()
        
        user.role = 'Cliente'
        user.save(update_fields=['role'])
        
        # Create customer profile        
        customer = Customer.objects.create(user=user, **validated_data)
        
        return customer


class ChefSignUpSerializer(serializers.ModelSerializer):
    
    user = UserSignUpSerializer()
    
    class Meta:
        model = Chef
        fields = ['shift', 'role']
    
    def create(self, validated_data):
        
        user_data = validated_data.pop('user')
        
        user_serializer = UserSignUpSerializer(data=user_data)
        user_serializer.is_valid(raise_exception=True)
        
        user = user_serializer.save()
        
        user.role = 'Cocinero'
        user.save(update_fields=['role'])
        
        chef = Chef.objects.create(user=user, **validated_data)
        
        return chef


class DeliverySignUpSerializer(serializers.ModelSerializer):
    
    user = UserSignUpSerializer()
    
    class Meta:
        model = Delivery
        fields = ['delivery_area', 'is_available', 'user']
        
    def create(self, validated_data):
        
        user_data = validated_data.pop('user')
        
        user_serializer = UserSignUpSerializer(data=user_data)
        user_serializer.is_valid(raise_exception=True)
        
        user = user_serializer.save()
        
        user.role = 'Repartidor'
        user.save(update_fields=['role'])
        
        delivery = Delivery.objects.create(user=user, **validated_data)
        
        return delivery


# AUTHENTICATION CLASSE
class LoginSerializer(TokenObtainPairSerializer):
    
    pass


# UPDATE CLASSES

class UserUpdateSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ['phone_number', 'first_name', 'last_name']


# Mixin to update basic data in each role
class UserNestedUpdateMixin:
    
    def update_user(self, instance, user_data):
        
        # Checks user existence in request
        if user_data:
            serializer = UserUpdateSerializer(
                instance.user, # Use vinculated user
                data=user_data,
                partial=True # Allows partial update
            )

            # Run serializer validations 
            serializer.is_valid(raise_exception=True)
            
            serializer.save()


class CustomerUpdateSerializer(UserNestedUpdateMixin, serializers.ModelSerializer):
    
    # Define the JSON structure 
    user = UserUpdateSerializer()
    
    class Meta:
        model = Customer
        fields = ['control_number', 'department', 'user']
    
    def update(self, instance, validated_data):
        
        user_data = validated_data.pop('user', None)
        
        # Update customer
        super().update(instance, validated_data)
        
        # Update user
        self.update_user(instance, user_data)
        
        return instance


class ChefUpdateSerializer(UserNestedUpdateMixin, serializers.ModelSerializer):
    
    user = UserUpdateSerializer()
    
    class Meta:
        model = Chef
        fields = ['shift', 'user']
        
    def update(self, instance, validated_data):
        
        user_data = validated_data.pop('user', None)
        
        super().update(instance, validated_data)
        
        self.update_user(instance, user_data)
            
        return instance


class DeliveryUpdateSerializer(UserNestedUpdateMixin, serializers.ModelSerializer):
    
    user = UserUpdateSerializer()
    
    class Meta:
        model = Delivery
        fields = ['delivery_area', 'is_available', 'user']
    
    def update(self, instance, validated_data):
        
        user_data = validated_data.pop('user', None)
        
        super().update(instance, validated_data)
        
        self.update_user(instance, user_data)
        
        return instance
