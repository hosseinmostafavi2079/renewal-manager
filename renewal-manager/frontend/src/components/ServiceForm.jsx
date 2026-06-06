import React, { useState, useEffect } from 'react';
import { X, Globe, Server, Shield, DollarSign, Calendar, FileText } from 'lucide-react';
import api from '../api';
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";

const inputClass = "w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/15 outline-none focus:border-violet-500/50 focus:bg-white/[0.06] transition-all";
const labelClass = "block text-xs font-bold text-white/40 mb-2 uppercase tracking-wider";
const dateInputClass = "w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-violet-500/50 transition-all font-mono";

function ServiceForm({ onSuccess, onClose }) {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    customer: '', service_type: 'server', title: '', provider: '',
    buy_price: '', sell_price: '', payment_status: 'pending',
    start_date: '', end_date: '', description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('services/customers/')
      .then(res => setCustomers(res.data.filter(c => c.is_active)));
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const formatPrice = (v) => !v && v !== 0 ? '' : v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const handlePriceChange = (e) => {
    const raw = e.target.value.replace(/,/g, '');
    if (raw === '' || !isNaN(raw)) setFormData({ ...formData, [e.target.name]: raw });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    const data = { ...formData, buy_price: formData.buy_price || 0, sell_price: formData.sell_price || 0 };
    api.post('services/items/', data)
      .then(() => { setLoading(false); if (onSuccess) onSuccess(); })
      .catch(() => { setLoading(false); setError('خطا در ثبت سرویس. لطفاً فیلدها را بررسی کنید.'); });
  };

  const serviceTypes = [
    { value: 'domain', label: 'دامنه', icon: <Globe size={16} /> },
    { value: 'server', label: 'سرور', icon: <Server size={16} /> },
    { value: 'ssl', label: 'SSL', icon: <Shield size={16} /> },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex justify-center items-center p-4">
      <div className="bg-[#13151f] rounded-2xl shadow-2xl shadow-black/60 w-full max-w-2xl border border-white/[0.08] flex flex-col max-h-[90vh]">

        <div className="flex justify-between items-center p-5 border-b border-white/[0.06] shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
              <Server size={16} />
            </div>
            <h2 className="text-base font-bold text-white">افزودن سرویس جدید</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.06] transition-all">
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto p-5 flex-grow">
          {error && <div className="mb-4 p-3 bg-red-500/10 text-red-400 text-xs rounded-xl border border-red-500/20">{error}</div>}

          <form id="service-form" onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>مشتری *</label>
                <select name="customer" required value={formData.customer} onChange={handleChange}
                  className={inputClass + " cursor-pointer"}>
                  <option value="" className="bg-[#13151f]">انتخاب مشتری...</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id} className="bg-[#13151f]">{c.full_name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>نوع سرویس *</label>
                <div className="grid grid-cols-3 gap-2">
                  {serviceTypes.map(t => (
                    <label key={t.value} className={`cursor-pointer rounded-xl p-2.5 text-center text-xs font-bold border transition-all flex flex-col items-center gap-1.5 ${
                      formData.service_type === t.value
                        ? 'border-violet-500/40 bg-violet-500/10 text-violet-400'
                        : 'border-white/[0.08] bg-white/[0.03] text-white/30 hover:text-white/60 hover:border-white/20'
                    }`}>
                      <input type="radio" name="service_type" value={t.value} className="hidden" onChange={handleChange} checked={formData.service_type === t.value} />
                      {t.icon}
                      {t.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>عنوان سرویس *</label>
                <input type="text" name="title" required value={formData.title} onChange={handleChange} className={inputClass} placeholder="مثال: example.com" />
              </div>
              <div>
                <label className={labelClass}>کارگزار مرجع *</label>
                <input type="text" name="provider" required value={formData.provider} onChange={handleChange} className={inputClass} placeholder="مثال: Arvan Cloud" />
              </div>
            </div>

            <div className="p-4 bg-white/[0.02] rounded-xl border border-white/[0.06]">
              <p className="text-xs font-bold text-white/30 mb-4 flex items-center gap-2 uppercase tracking-wider"><DollarSign size={13} /> اطلاعات مالی</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>بهای تمام‌شده</label>
                  <input type="text" name="buy_price" value={formatPrice(formData.buy_price)} onChange={handlePriceChange} dir="ltr" className={inputClass + " text-left"} placeholder="0" />
                </div>
                <div>
                  <label className={labelClass}>بهای فروش</label>
                  <input type="text" name="sell_price" value={formatPrice(formData.sell_price)} onChange={handlePriceChange} dir="ltr" className={inputClass + " text-left"} placeholder="0" />
                </div>
                <div>
                  <label className={labelClass}>وضعیت پرداخت</label>
                  <select name="payment_status" value={formData.payment_status} onChange={handleChange} className={inputClass + " cursor-pointer"}>
                    <option value="pending" className="bg-[#13151f]">در انتظار پرداخت</option>
                    <option value="paid" className="bg-[#13151f]">تسویه شده</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass + " flex items-center gap-1"}><Calendar size={12} /> تاریخ فاکتور *</label>
                <DatePicker calendar={persian} locale={persian_fa}
                  value={formData.start_date ? new DateObject({ date: formData.start_date, format: "YYYY-MM-DD", calendar: gregorian, locale: gregorian_en }) : ""}
                  onChange={(date) => setFormData({ ...formData, start_date: date ? date.convert(gregorian, gregorian_en).format("YYYY-MM-DD") : "" })}
                  format="YYYY/MM/DD" containerClassName="w-full" inputClass={dateInputClass} />
              </div>
              <div>
                <label className={labelClass + " flex items-center gap-1 text-rose-400"}><Calendar size={12} /> سررسید / انقضا *</label>
                <DatePicker calendar={persian} locale={persian_fa}
                  value={formData.end_date ? new DateObject({ date: formData.end_date, format: "YYYY-MM-DD", calendar: gregorian, locale: gregorian_en }) : ""}
                  onChange={(date) => setFormData({ ...formData, end_date: date ? date.convert(gregorian, gregorian_en).format("YYYY-MM-DD") : "" })}
                  format="YYYY/MM/DD" containerClassName="w-full" inputClass={dateInputClass + " border-rose-500/20"} />
              </div>
            </div>

            <div>
              <label className={labelClass + " flex items-center gap-1"}><FileText size={12} /> توضیحات (اختیاری)</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="2"
                className={inputClass + " resize-none"} placeholder="یادداشت‌ها..." />
            </div>
          </form>
        </div>

        <div className="p-5 border-t border-white/[0.06] flex gap-3 shrink-0">
          <button type="button" onClick={onClose}
            className="flex-1 py-3 rounded-xl text-sm font-bold text-white/40 bg-white/[0.04] border border-white/[0.06] hover:text-white/70 hover:bg-white/[0.06] transition-all">
            انصراف
          </button>
          <button type="submit" form="service-form" disabled={loading}
            className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 transition-all shadow-lg shadow-violet-900/30">
            {loading ? 'در حال ثبت...' : 'ثبت سرویس'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ServiceForm;