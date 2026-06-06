import os
from pathlib import Path
import sys

# مسیر اصلی پروژه
BASE_DIR = Path(__file__).resolve().parent.parent

# تزریق پوشه apps به مسیرهای سیستم جهت پیاده‌سازی معماری ماژولار (Plug-and-Play)
sys.path.insert(0, os.path.join(BASE_DIR, 'apps'))

# تنظیمات امنیتی اولیه
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'django-insecure-local-development-key-2026')
DEBUG = int(os.environ.get('DEBUG', 1)) == 1
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '*').split(',')

# اپلیکیشن‌های نصب شده
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # پکیج‌های جانبی فرانت‌بک
    'rest_framework',
    'corsheaders',
    
    'services.apps.ServicesConfig',

]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', # باید بالاترین جای ممکن باشد
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# اتصال به دیتابیس پایدار PostgreSQL از طریق متغیرهای کانتینر داکر
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME', 'renewal_db'),
        'USER': os.environ.get('DB_USER', 'renewal_user'),
        'PASSWORD': os.environ.get('DB_PASSWORD', 'renewal_secure_password_2026'),
        'HOST': os.environ.get('DB_HOST', 'db'),
        'PORT': os.environ.get('DB_PORT', '5432'),
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# تنظیمات زبان و زمان
LANGUAGE_CODE = 'fa-ir'
TIME_ZONE = 'Asia/Tehran'
USE_I18N = True
USE_TZ = True

# تنظیمات فایل‌های استاتیک
STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# تنظیمات اولیه CORS برای ارتباط راحت با فرانت‌اند مینیمال در آینده
CORS_ALLOW_ALL_ORIGINS = True

# تنظیمات امنیتی DRF و JWT
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    )
}

from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'AUTH_HEADER_TYPES': ('Bearer',),
}