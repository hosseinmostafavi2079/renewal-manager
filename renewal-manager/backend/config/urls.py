from django.contrib import admin
from django.urls import path, include

# این خط احتمالاً در کد شما جا افتاده بود:
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # مسیرهای احراز هویت اختصاصی
    path('api/v1/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/v1/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # مسیر روت APIها که به ماژول services متصل می‌شود
    path('api/v1/services/', include('services.urls')), 
]