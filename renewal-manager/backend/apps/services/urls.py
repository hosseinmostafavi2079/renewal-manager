from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (CustomerViewSet, ServiceItemViewSet, 
                    AlertHistoryViewSet, DashboardStatsView, 
                    GatewaySettingViewSet, ServiceRenewalViewSet)

router = DefaultRouter()
router.register(r'customers', CustomerViewSet, basename='customer')
router.register(r'items', ServiceItemViewSet, basename='service-item')
router.register(r'alerts', AlertHistoryViewSet, basename='alert')
router.register(r'renewals', ServiceRenewalViewSet, basename='renewal')
router.register(r'settings', GatewaySettingViewSet, basename='setting')

urlpatterns = [
    path('dashboard/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('', include(router.urls)),
]