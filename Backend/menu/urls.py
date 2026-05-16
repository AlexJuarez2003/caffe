from rest_framework.routers import DefaultRouter
from .views import IngredientViewSet, ProductViewSet

router = DefaultRouter()
router.register(r'ingredients', IngredientViewSet)
router.register(r'products', ProductViewSet, basename='products')

urlpatterns = router.urls