from rest_framework.routers import DefaultRouter
from .views import DeliveryAreaViewSet, BuildingViewSet, ClassroomViewSet

router = DefaultRouter()

router.register(r'areas', DeliveryAreaViewSet)
router.register(r'buildings', BuildingViewSet)
router.register(r'classrooms', ClassroomViewSet)

urlpatterns = router.urls