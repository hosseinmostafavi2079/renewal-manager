from rest_framework import serializers
from .models import Customer, ServiceItem, ServiceRenewal, AlertHistory, GatewaySetting

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'

# سریالایزر جدید برای تاریخچه
class ServiceRenewalSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceRenewal
        fields = '__all__'

class ServiceItemSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.full_name', read_only=True)
    service_type_display = serializers.CharField(source='get_service_type_display', read_only=True)
    payment_status_display = serializers.CharField(source='get_payment_status_display', read_only=True)
    
    # متصل کردن تاریخچه‌ها به کارت سرویس (فقط خواندنی)
    renewals = ServiceRenewalSerializer(many=True, read_only=True)

    class Meta:
        model = ServiceItem
        fields = '__all__'

class AlertHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = AlertHistory
        fields = '__all__'

class GatewaySettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = GatewaySetting
        fields = '__all__'