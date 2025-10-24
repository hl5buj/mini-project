from rest_framework.routers import DefaultRouter
from .views import MediaFileViewSet

app_name = 'media_files'

router = DefaultRouter()
router.register('', MediaFileViewSet, basename='mediafile')

urlpatterns = router.urls
