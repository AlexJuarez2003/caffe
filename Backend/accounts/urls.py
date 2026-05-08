from django.urls import path
from .views import (
        SignupView, CustomerSignUpView, ChefSignUpView, DeliverySignUpView, 
        LoginView, RefreshView, LogoutView, 
        UserProfileUpdateView, CustomerProfileUpdateView, ChefProfileUpdateView, DeliveryProfileUpdateView,
        DeleteAccountView
    )

urlpatterns = [
    # Register URLs
    path('signup/', SignupView.as_view(), name='signup'),
    path('signup/customer/', CustomerSignUpView.as_view(), name='signup-customer'),
    path('signup/chef/', ChefSignUpView.as_view(), name='signup-chef'),
    path('signup/delivery/', DeliverySignUpView.as_view(), name='signup-delivery'),
    
    # Auth URLs
    path('login/', LoginView.as_view(), name='login'),
    path('refresh/', RefreshView.as_view(), name='refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
    
    # Update URLs
    path('profile/', UserProfileUpdateView.as_view(), name='profile'),
    path('profile/customer/', CustomerProfileUpdateView.as_view(), name='profile-customer'),
    path('profile/chef/', ChefProfileUpdateView.as_view(), name='profile-chef'),
    path('profile/delivery/', DeliveryProfileUpdateView.as_view(), name='profile-delivery'),
    
    # Delete accounts
    path('profile/delete/', DeleteAccountView.as_view(), name='delete-profile'),    
]