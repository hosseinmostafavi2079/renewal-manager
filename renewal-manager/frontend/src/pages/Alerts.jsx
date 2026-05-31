import React, { useEffect, useState } from 'react';
import { BellRing, CheckCircle2, XCircle, Smartphone, MessageCircle } from 'lucide-react';
import api from '../api';

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('services/alerts/')
      .then(response => {
        setAlerts(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("خطا در دریافت هشدارها:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <BellRing size={20} className="text-purple-600" />
          تاریخچه ارسال هشدارها
        </h2>
        <p className="text-sm text-gray-500">لیست هشدارهایی که به صورت خودکار یا دستی از طریق ربات بله یا درگاه پیامک صادر شده‌اند.</p>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 py-10 animate-pulse">در حال بارگذاری تاریخچه...</p>
      ) : alerts.length === 0 ? (
        <div className="text-center bg-white p-10 rounded-2xl border border-gray-100">
          <p className="text-gray-500">تا کنون هیچ هشداری در سیستم ثبت نشده است.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map(alert => (
            <div key={alert.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full shrink-0 ${alert.is_successful ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  {alert.alert_type === 'sms' ? <Smartphone size={24} /> : <MessageCircle size={24} />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-900 text-sm">
                      {alert.alert_type === 'sms' ? 'ارسال پیامکی' : 'پیام‌رسان بله (Bale)'}
                    </span>
                    <span className="text-gray-300 text-xs">|</span>
                    <span className="text-gray-600 text-xs font-bold">سرویس آیدی: {alert.service}</span>
                  </div>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-xl mt-2 border border-gray-100">
                    {alert.message}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0 w-full md:w-auto mt-4 md:mt-0 border-t md:border-t-0 border-gray-100 pt-4 md:pt-0">
                <div className={`flex items-center gap-1 text-xs font-bold ${alert.is_successful ? 'text-green-600' : 'text-red-600'}`}>
                  {alert.is_successful ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                  {alert.is_successful ? 'ارسال موفق' : 'ارسال ناموفق'}
                </div>
                <div className="text-[10px] text-gray-400 font-mono" dir="ltr">
                  {new Date(alert.sent_at).toLocaleString('fa-IR')}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Alerts;