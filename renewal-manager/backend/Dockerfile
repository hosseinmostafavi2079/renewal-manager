FROM python:3.11-slim

# تنظیم متغیرهای محیطی پایتون برای جلوگیری از نوشتن فایل‌های کش و بافرینگ
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# تعیین پوشه کاری اصلی داخل کانتینر
WORKDIR /app

# نصب ابزارهای مورد نیاز سیستم‌عامل برای کامپایل پکیج‌های دیتابیس
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# ارتقای پایپ و نصب نیازمندی‌های پایتون
RUN pip install --no-cache-dir --upgrade pip
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# کپی کردن کدها به داخل کانتینر
COPY . /app/

# پورت پیش‌فرض برای دسترسی به جنگو
EXPOSE 8000

# دستور پیش‌فرض برای اجرای سرور توسعه
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]