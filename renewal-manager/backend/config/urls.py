from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # مسیر روت APIها که به ماژول services متصل می‌شود
    path('api/v1/services/', include('services.urls')), 
]