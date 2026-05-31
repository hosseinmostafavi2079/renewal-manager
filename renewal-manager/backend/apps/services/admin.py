from django.contrib import admin
from .models import Customer, ServiceItem, AlertHistory, GatewaySetting

class ServiceInline(admin.TabularInline):
    model = ServiceItem
    extra = 1

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'company', 'mobile', 'is_active')
    search_fields = ('full_name', 'mobile', 'company')
    list_filter = ('is_active',)
    inlines = [ServiceInline]

@admin.register(ServiceItem)
class ServiceItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'service_type', 'customer', 'end_date', 'payment_status')
    list_filter = ('service_type', 'payment_status')
    search_fields = ('title', 'customer__full_name', 'provider')

@admin.register(AlertHistory)
class AlertHistoryAdmin(admin.ModelAdmin):
    list_display = ('service', 'alert_type', 'is_successful', 'sent_at')
    list_filter = ('alert_type', 'is_successful')

@admin.register(GatewaySetting)
class GatewaySettingAdmin(admin.ModelAdmin):
    list_display = ('kavenegar_sender', 'bale_chat_id')
    
    def has_add_permission(self, request):
        # فقط اجازه ساخت یک رکورد تنظیمات را می‌دهد
        if self.model.objects.exists():
            return False
        return super().has_add_permission(request)