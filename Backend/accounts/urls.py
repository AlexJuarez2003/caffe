from django.urls import path
from .views import SignupView, LoginView, ProfileView, RefreshView, LogoutVIew, UserProfileUpdateView

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('refresh/', RefreshView.as_view(), name='refresh'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('logout/', LogoutVIew.as_view(), name='logout'),
    path('profile/update/', UserProfileUpdateView.as_view(), name='profile-update'),
]