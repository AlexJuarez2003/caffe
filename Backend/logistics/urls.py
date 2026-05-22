from rest_framework.routers import DefaultRouter
from .views import DeliveryAreaViewSet, BuildingViewSet, ClassroomViewSet

router = DefaultRouter()

router.register(r'areas', DeliveryAreaViewSet)
router.register(r'buildings', BuildingViewSet, basename='building')
router.register(r'classrooms', ClassroomViewSet, basename='classroom')

urlpatterns = router.urls