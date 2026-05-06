from django.core.exceptions import ValidationError as DjangoValidationError
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from .models import User, Chef

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UserSignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'password']
        
        # Do not return password, only enter it
        extra_kwargs = {
            'password': {'write_only': True},
        }
        
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
        email = validated_data['email']
        password = validated_data['password']
            
        # Register user in database
        user = User(
            email = email,
            password = password,
        )
        
        user.full_clean()
        
        # Do not save the password in plain text
        user.set_password(password)
        user.save()
        
        return user
    

class LoginSerializer(TokenObtainPairSerializer):
    
    # Explicitly define the email field
    email = serializers.EmailField()
    
    # It's executed with a POST request upon login
    def validate(self, attrs): # attrs contains the customer data
        
        # Get the email and assign it to the username for JWT
        attrs['username'] = attrs.get('email')
        
        # SimpleJWT do:
        '''
        User authentication
        Verify password
        Check if it's active
        Generates:
            access token 
            refresh token
        '''
        data = super().validate(attrs)
        
        return data
    
class UserUpdateSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ['phone_number', 'first_name', 'last_name']
    
    def update(self, instance, validated_data):
        
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        
        instance.save()
        
        return instance