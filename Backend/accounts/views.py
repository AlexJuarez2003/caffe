from rest_framework import generics
from .models import User
from .serializers import UserSignUpSerializer, LoginSerializer, UserUpdateSerializer

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework import status

from rest_framework_simplejwt.tokens import RefreshToken

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


# Automatically handles POST request
class SignupView(generics.CreateAPIView):
    
    # Define the set of data base for instrospection
    queryset = User.objects.all()
    
    serializer_class = UserSignUpSerializer
    

class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer
    
    def post(self, request, *args, **kwargs):
        
        # Run serializer
        response = super().post(request, *args, **kwargs)
        
        # Obtain data generated from the serializer 
        data = response.data
        
        access = data.get("access")
        refresh = data.get("refresh")
        
        # Return only 'user'
        new_response = Response({
            "user": data.get("user")
        }, status=status.HTTP_200_OK)
        
        # Send access token via cookie
        new_response.set_cookie(
            key="access",
            value=access,
            httponly=True,
            secure=False,
            samesite="Lax"
        )
        
        # Send refresh token via cookie too
        new_response.set_cookie(
            key="refresh",
            value=refresh,
            httponly=True,
            secure=False,
            samesite="Lax"
        )
        
        return new_response
    

class RefreshView(TokenRefreshView):
                
    def post(self, request):
        refresh_token = request.COOKIES.get('refresh')
        
        if not refresh_token:
            return Response({'error': 'No refresh token provided'}, status=401)
        
        try:
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)
            
            response = Response({'message': 'Token refreshed'}, status=200)
            response.set_cookie(
                key='access',
                value=access_token,
                httponly=True,
                secure=False,
                samesite='Lax'
            )
            
            return response
            
        except:
            return Response({'error': 'Invalid refresh token'}, status=401)
        

class LogoutVIew(APIView):
    
    def post(self, request):
        response = Response({'message': 'Logged out'})
        
        response.delete_cookie('access')
        response.delete_cookie('refresh')
        
        return response
    
    
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        return Response({
            "email": request.user.email,
            "first_name": request.user.first_name,
            "last_name": request.user.last_name,
            "creation_date": request.user.creation_date,
            "phone_number": request.user.phone_number,
            "role": request.user.role
        })
        
class UserProfileUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = UserUpdateSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user