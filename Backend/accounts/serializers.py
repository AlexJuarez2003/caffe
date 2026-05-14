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
    
    def validate(self, attrs):
        
        # Generate tokens
        data = super().validate(attrs)
        
        user = self.user
        
        profile_data = None
        
        # Role based profile data
        if user.role == "Cliente":
            customer = Customer.objects.get(user=user)
            
            profile_data = {
                "department": customer.department,
                "control_number": customer.control_number
            }
        
        elif user.role == "Cocinero":
            chef = Chef.objects.get(user=user)
            
            profile_data = {
                "shift": chef.shift
            }
        
        elif user.role == "Repartidor":
            delivery = Delivery.objects.get(user=user)
            
            profile_data = {
                "delivery_area": delivery.delivery_area,
                "is_available": delivery.is_available
            }
        
        # Add user data to response
        data["user"] = {
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "phone_number": user.phone_number,
            "creation_date": user.creation_date,
            "role": user.role,
            "profile": profile_data
        }

        return data

# UPDATE CLASSES

class UserUpdateSerializer(serializers.ModelSerializer):
    
    email = serializers.EmailField(required=False)
    
    password = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=True
    )
    
    class Meta:
        model = User
        fields = ['email', 'phone_number', 'first_name', 'last_name', 'password', 'creation_date']
    
    def update(self, instance, validated_data):
        
        password = validated_data.pop('password', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        instance.save()

        return instance


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
    
    def to_representation(self, instance):
        return {
            "user": {
                "creation_date": instance.user.creation_date,
                "email": instance.user.email,
                "first_name": instance.user.first_name,
                "last_name": instance.user.last_name,
                "phone_number": instance.user.phone_number,
                "profile": {
                    "control_number": instance.control_number,
                    "department": instance.department
                }
            }
        }


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
