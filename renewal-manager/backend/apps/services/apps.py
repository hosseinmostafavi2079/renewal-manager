from django.apps import AppConfig

class ServicesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    # چون پوشه apps را در تنظیمات به sys.path اضافه کردیم، نام اپلیکیشن فقط services است
    name = 'services' 
    verbose_name = 'مدیریت سرویس‌ها و تمدیدها'