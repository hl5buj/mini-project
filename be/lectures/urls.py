from rest_framework.routers import DefaultRouter
from .views import LectureViewSet

app_name = 'lectures'

router = DefaultRouter()
router.register('', LectureViewSet, basename='lecture')

urlpatterns = router.urls
