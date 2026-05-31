from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum
from django.utils import timezone
from .models import Customer, ServiceItem, AlertHistory, GatewaySetting
from .serializers import (CustomerSerializer, ServiceItemSerializer, 
                          AlertHistorySerializer, GatewaySettingSerializer)
from .models import ServiceRenewal
from .serializers import ServiceRenewalSerializer

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all().order_by('-created_at')
    serializer_class = CustomerSerializer

class ServiceItemViewSet(viewsets.ModelViewSet):
    queryset = ServiceItem.objects.all().order_by('end_date') # مرتب‌سازی بر اساس نزدیک‌ترین انقضا
    serializer_class = ServiceItemSerializer

class AlertHistoryViewSet(viewsets.ModelViewSet):
    queryset = AlertHistory.objects.all().order_by('-sent_at')
    serializer_class = AlertHistorySerializer

class DashboardStatsView(APIView):
    def get(self, request):
        today = timezone.now().date()
        
        # محاسبات داشبورد بر اساس معماری جدید
        customers_count = Customer.objects.filter(is_active=True).count()
        active_services = ServiceItem.objects.filter(end_date__gte=today).count()
        pending_services = ServiceItem.objects.filter(payment_status='pending').count()
        
        # محاسبه مجموع بدهی فاکتورهای پرداخت نشده (از فیلد sell_price)
        total_unpaid_dict = ServiceItem.objects.filter(payment_status='pending').aggregate(Sum('sell_price'))
        total_unpaid = total_unpaid_dict['sell_price__sum'] or 0
        
        return Response({
            'customers_count': customers_count,
            'active_services_count': active_services,
            'pending_services_count': pending_services,
            'total_unpaid_amount': total_unpaid
        })

class GatewaySettingViewSet(viewsets.ModelViewSet):
    queryset = GatewaySetting.objects.all()
    serializer_class = GatewaySettingSerializer

class ServiceRenewalViewSet(viewsets.ModelViewSet):
    queryset = ServiceRenewal.objects.all().order_by('-payment_date')
    serializer_class = ServiceRenewalSerializer