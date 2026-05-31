import React, { useEffect, useState } from 'react';
import { Settings as SettingsIcon, Save, MessageCircle, Smartphone } from 'lucide-react';
import api from '../api';

function Settings() {
  const [formData, setFormData] = useState({
    bale_bot_token: '',
    bale_chat_id: '',
    kavenegar_api_url: 'https://api.kavenegar.com/v1',
    kavenegar_secret_key: '',
    kavenegar_pattern: 'rooydad-expiry-alert',
    kavenegar_sender: '10008585'
  });
  const [settingId, setSettingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    // گرفتن تنظیمات قبلی از بک‌اند
    api.get('services/settings/')
      .then(res => {
        if (res.data && res.data.length > 0) {
          setFormData(res.data[0]);
          setSettingId(res.data[0].id);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    const request = settingId 
      ? api.put(`services/settings/${settingId}/`, formData) 
      : api.post('services/settings/', formData);

    request.then(res => {
      setLoading(false);
      setSettingId(res.data.id);
      setMessage({ text: 'تنظیمات با موفقیت ذخیره شد.', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }).catch(err => {
      setLoading(false);
      setMessage({ text: 'خطا در ذخیره تنظیمات.', type: 'error' });
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <SettingsIcon size={20} className="text-purple-600" />
          تنظیمات درگاه و خودکارسازی (Reminders Gateway)
        </h2>
        <p className="text-sm text-gray-500">اطلاعات اتصال به درگاه پیامکی و ربات پیام‌رسان بله را در این بخش وارد کنید.</p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl text-sm font-bold ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* کارت تنظیمات بله */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-base font-bold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
              <MessageCircle size={18} className="text-blue-500" />
              پیام‌رسان بله (Bale Bot Integration)
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">توکن ربات بله (Bot Token API)</label>
                <input type="password" name="bale_bot_token" value={formData.bale_bot_token || ''} onChange={handleChange} dir="ltr" className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:border-purple-500 font-mono text-sm" placeholder="123456789:ABCDEF..." />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">شناسه کانال یا چت ادمین (Chat ID)</label>
                <input type="text" name="bale_chat_id" value={formData.bale_chat_id || ''} onChange={handleChange} dir="ltr" className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:border-purple-500 font-mono text-sm" placeholder="875634592" />
              </div>
              <div className="bg-blue-50 p-3 rounded-xl flex items-start gap-2 mt-4 border border-blue-100">
                <div className="text-blue-500 mt-0.5">ℹ️</div>
                <p className="text-xs text-blue-800 leading-relaxed">در صورت اتصال موفق، ربات پیام تبریک تمدید، سررسید فاکتور و وضعیت انقضای دامنه‌ها را به صورت خودکار ارسال می‌کند.</p>
              </div>
            </div>
          </div>

          {/* کارت تنظیمات کاوه‌نگار */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-base font-bold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
              <Smartphone size={18} className="text-orange-500" />
              درگاه پیامکی (Kavenegar SMS API)
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">آدرس وب‌سرویس پیامک (API URL)</label>
                <input type="text" name="kavenegar_api_url" value={formData.kavenegar_api_url || ''} onChange={handleChange} dir="ltr" className="w-full border border-gray-300 bg-gray-50 rounded-xl p-3 outline-none focus:border-purple-500 font-mono text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">کلید وب‌سرویس (API Secret Key)</label>
                <input type="password" name="kavenegar_secret_key" value={formData.kavenegar_secret_key || ''} onChange={handleChange} dir="ltr" className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:border-purple-500 font-mono text-sm" placeholder="......................" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">کد قالب (Pattern)</label>
                  <input type="text" name="kavenegar_pattern" value={formData.kavenegar_pattern || ''} onChange={handleChange} dir="ltr" className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:border-purple-500 font-mono text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">خط فرستنده پیامک</label>
                  <input type="text" name="kavenegar_sender" value={formData.kavenegar_sender || ''} onChange={handleChange} dir="ltr" className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:border-purple-500 font-mono text-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={loading} className="bg-purple-600 text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-purple-700 transition-all flex items-center gap-2 disabled:opacity-50 shadow-md">
            <Save size={18} />
            {loading ? 'در حال ذخیره‌سازی...' : 'ذخیره تنظیمات کلی'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Settings;