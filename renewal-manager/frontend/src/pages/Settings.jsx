import React, { useEffect, useState } from 'react';
import { Settings as SettingsIcon, Save, MessageCircle, Smartphone, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import api from '../api';

const InputField = ({ label, name, value, onChange, type = 'text', placeholder = '', dir = 'rtl', hint }) => {
  const [showPwd, setShowPwd] = useState(false);
  const isPassword = type === 'password';
  return (
    <div>
      <label className="block text-xs font-bold text-white/40 mb-2 uppercase tracking-wider">{label}</label>
      <div className="relative">
        <input
          type={isPassword && !showPwd ? 'password' : 'text'}
          name={name}
          value={value || ''}
          onChange={onChange}
          dir={dir}
          placeholder={placeholder}
          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/15 outline-none focus:border-violet-500/50 focus:bg-white/[0.06] transition-all font-mono"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPwd(!showPwd)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
          >
            {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {hint && <p className="text-white/20 text-[11px] mt-1.5">{hint}</p>}
    </div>
  );
};

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
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('services/settings/')
      .then(res => {
        if (res.data?.length > 0) {
          setFormData(res.data[0]);
          setSettingId(res.data[0].id);
        }
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const req = settingId
      ? api.put(`services/settings/${settingId}/`, formData)
      : api.post('services/settings/', formData);

    req.then(res => {
      setLoading(false);
      setSettingId(res.data.id);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }).catch(() => {
      setLoading(false);
      setError('خطا در ذخیره تنظیمات.');
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-white">تنظیمات درگاه</h2>
        <p className="text-white/30 text-sm mt-1">پیکربندی پیامک کاوه‌نگار و ربات بله برای هشدارهای خودکار</p>
      </div>

      {/* Success / Error banners */}
      {saved && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold">
          <CheckCircle2 size={18} />
          تنظیمات با موفقیت ذخیره شد.
        </div>
      )}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Bale card */}
          <div className="bg-[#13151f] rounded-2xl border border-white/[0.06] p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/[0.06]">
              <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400">
                <MessageCircle size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">پیام‌رسان بله</h3>
                <p className="text-xs text-white/30 mt-0.5">Bale Bot Integration</p>
              </div>
            </div>
            <div className="space-y-4">
              <InputField
                label="توکن ربات بله"
                name="bale_bot_token"
                value={formData.bale_bot_token}
                onChange={handleChange}
                type="password"
                dir="ltr"
                placeholder="123456789:ABCDEF..."
              />
              <InputField
                label="شناسه کانال / چت ادمین"
                name="bale_chat_id"
                value={formData.bale_chat_id}
                onChange={handleChange}
                dir="ltr"
                placeholder="875634592"
              />
              <div className="bg-sky-500/5 rounded-xl p-3 border border-sky-500/10">
                <p className="text-xs text-sky-300/50 leading-relaxed">پس از اتصال موفق، ربات هشدارهای سررسید و وضعیت تمدیدها را به صورت خودکار ارسال می‌کند.</p>
              </div>
            </div>
          </div>

          {/* Kavenegar card */}
          <div className="bg-[#13151f] rounded-2xl border border-white/[0.06] p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/[0.06]">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                <Smartphone size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">کاوه‌نگار</h3>
                <p className="text-xs text-white/30 mt-0.5">Kavenegar SMS API</p>
              </div>
            </div>
            <div className="space-y-4">
              <InputField
                label="آدرس وب‌سرویس"
                name="kavenegar_api_url"
                value={formData.kavenegar_api_url}
                onChange={handleChange}
                dir="ltr"
              />
              <InputField
                label="کلید API"
                name="kavenegar_secret_key"
                value={formData.kavenegar_secret_key}
                onChange={handleChange}
                type="password"
                dir="ltr"
                placeholder="کلید سرویس از پنل کاوه‌نگار"
              />
              <div className="grid grid-cols-2 gap-3">
                <InputField
                  label="کد قالب"
                  name="kavenegar_pattern"
                  value={formData.kavenegar_pattern}
                  onChange={handleChange}
                  dir="ltr"
                />
                <InputField
                  label="خط فرستنده"
                  name="kavenegar_sender"
                  value={formData.kavenegar_sender}
                  onChange={handleChange}
                  dir="ltr"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 transition-all shadow-lg shadow-violet-900/30"
          >
            <Save size={16} />
            {loading ? 'در حال ذخیره...' : 'ذخیره تنظیمات'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Settings;