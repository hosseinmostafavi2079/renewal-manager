from django.db import models

class Customer(models.Model):
    full_name = models.CharField(max_length=255, verbose_name="نام و نام خانوادگی")
    company = models.CharField(max_length=255, blank=True, null=True, verbose_name="نام شرکت / صنف")
    mobile = models.CharField(max_length=15, unique=True, verbose_name="شماره موبایل")
    email = models.EmailField(blank=True, null=True, verbose_name="نشانی ایمیل")
    is_active = models.BooleanField(default=True, verbose_name="وضعیت (فعال/غیرفعال)")
    receive_alerts = models.BooleanField(default=True, verbose_name="ارسال خودکار پیامک هشدار") 
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "مشتری"
        verbose_name_plural = "مشتریان"

    def __str__(self):
        return f"{self.full_name} - {self.company or ''}"

class ServiceItem(models.Model):
    SERVICE_TYPES = (('domain', 'ثبت/تمدید دامنه'), ('server', 'سرور (اختصاصی/ابری)'), ('ssl', 'گواهینامه SSL'))
    PAYMENT_STATUS = (('pending', 'در انتظار تایید پرداخت'), ('paid', 'پرداخت شده / تسویه'))

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name="services", verbose_name="مشتری بهره‌بردار")
    service_type = models.CharField(max_length=20, choices=SERVICE_TYPES, verbose_name="نوع سرویس")
    title = models.CharField(max_length=255, verbose_name="عنوان سرویس یا دامنه")
    provider = models.CharField(max_length=255, verbose_name="کارگزار / ارائه‌دهنده مرجع")
    
    buy_price = models.DecimalField(max_digits=15, decimal_places=0, default=0, verbose_name="بهای تمام‌شده برای شما (تومان)")
    sell_price = models.DecimalField(max_digits=15, decimal_places=0, default=0, verbose_name="بهای فروش به مشتری (تومان)")
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default='pending', verbose_name="وضعیت پرداخت و فاکتور")
    
    start_date = models.DateField(verbose_name="تاریخ شروع / ثبت فاکتور")
    end_date = models.DateField(verbose_name="تاریخ سررسید / انقضا")
    description = models.TextField(blank=True, null=True, verbose_name="توضیحات تکمیلی") # فیلد جدید
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "سرویس"
        verbose_name_plural = "سرویس‌ها"
        ordering = ['end_date']

    def __str__(self):
        return f"{self.title} ({self.customer.full_name})"

class ServiceRenewal(models.Model):
    service = models.ForeignKey(ServiceItem, on_delete=models.CASCADE, related_name="renewals", verbose_name="سرویس مربوطه")
    amount = models.DecimalField(max_digits=15, decimal_places=0, verbose_name="مبلغ پرداختی (تومان)")
    payment_date = models.DateField(verbose_name="تاریخ پرداخت")
    new_end_date = models.DateField(verbose_name="سررسید جدید تخصیص یافته")
    notes = models.TextField(blank=True, null=True, verbose_name="توضیحات پرداخت") # فیلد جدید
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "تاریخچه تمدید"
        verbose_name_plural = "تاریخچه تمدیدها"
        ordering = ['-payment_date']

class AlertHistory(models.Model):
    ALERT_TYPES = (('sms', 'ارسال پیامکی (Kavenegar)'), ('bale', 'پیام‌رسان بله (Bale)'))
    service = models.ForeignKey(ServiceItem, on_delete=models.CASCADE, related_name="alerts", verbose_name="سرویس مربوطه")
    alert_type = models.CharField(max_length=10, choices=ALERT_TYPES, verbose_name="نوع هشدار")
    message = models.TextField(verbose_name="متن پیام ارسال شده")
    is_successful = models.BooleanField(default=True, verbose_name="وضعیت ارسال")
    sent_at = models.DateTimeField(auto_now_add=True, verbose_name="زمان ارسال")

    class Meta:
        verbose_name = "تاریخچه هشدار"
        verbose_name_plural = "تاریخچه هشدارها"

class GatewaySetting(models.Model):
    bale_bot_token = models.CharField(max_length=255, blank=True, null=True, verbose_name="توکن ربات بله")
    bale_chat_id = models.CharField(max_length=255, blank=True, null=True, verbose_name="شناسه کانال یا چت ادمین")
    kavenegar_api_url = models.CharField(max_length=255, default="https://api.kavenegar.com/v1", verbose_name="آدرس وب‌سرویس پیامک")
    kavenegar_secret_key = models.CharField(max_length=255, blank=True, null=True, verbose_name="کلید وب‌سرویس")
    kavenegar_pattern = models.CharField(max_length=255, default="rooydad-expiry-alert", verbose_name="کد قالب")
    kavenegar_sender = models.CharField(max_length=20, default="10008585", verbose_name="خط فرستنده")

    class Meta:
        verbose_name = "تنظیمات درگاه"
        verbose_name_plural = "تنظیمات درگاه‌ها"