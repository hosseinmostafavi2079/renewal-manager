import React, { useState, useEffect } from 'react';
import { X, Globe, Server, Shield, DollarSign, Calendar, FileText } from 'lucide-react';
import api from '../api';
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";

function ServiceForm({ onSuccess, onClose }) {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    customer: '', service_type: 'server', title: '', provider: '',
    buy_price: '', sell_price: '', payment_status: 'pending',
    start_date: '', end_date: '', description: '' // فیلد توضیحات اضافه شد
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('services/customers/').then(res => setCustomers(res.data.filter(c => c.is_active))).catch(err => console.error(err));
  }, []);

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

  // توابع فرمت‌بندی 3 رقم 3 رقم
  const formatPrice = (value) => {
    if (!value && value !== 0) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  const handlePriceChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, '');
    if (rawValue === '' || !isNaN(rawValue)) { setFormData({ ...formData, [e.target.name]: rawValue }); }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    const dataToSend = { ...formData, buy_price: formData.buy_price || 0, sell_price: formData.sell_price || 0 };
    api.post('services/items/', dataToSend)
      .then(() => { setLoading(false); if (onSuccess) onSuccess(); })
      .catch(err => { setLoading(false); setError('خطا در ثبت سرویس. لطفاً فیلدها را بررسی کنید.'); });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-5 border-b border-gray-100 shrink-0"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-600"></div><h2 className="text-lg font-bold text-gray-800">افزودن سرویس جدید</h2></div><button onClick={onClose} className="text-gray-400 hover:text-red-500"><X size={20} /></button></div>

        <div className="overflow-y-auto p-6 flex-grow">
          {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>}
          <form id="service-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">مشتری بهره‌بردار *</label>
                <select name="customer" required value={formData.customer} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:border-blue-500 text-sm">
                  <option value="">انتخاب مشتری...</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">نوع سرویس *</label>
                <div className="grid grid-cols-3 gap-2">
                  <label className={`cursor-pointer border rounded-xl p-2 text-center text-xs font-bold ${formData.service_type === 'domain' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500'}`}><input type="radio" name="service_type" value="domain" className="hidden" onChange={handleChange} checked={formData.service_type === 'domain'} /><Globe size={16} className="mx-auto mb-1" /> دامنه</label>
                  <label className={`cursor-pointer border rounded-xl p-2 text-center text-xs font-bold ${formData.service_type === 'server' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500'}`}><input type="radio" name="service_type" value="server" className="hidden" onChange={handleChange} checked={formData.service_type === 'server'} /><Server size={16} className="mx-auto mb-1" /> سرور</label>
                  <label className={`cursor-pointer border rounded-xl p-2 text-center text-xs font-bold ${formData.service_type === 'ssl' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500'}`}><input type="radio" name="service_type" value="ssl" className="hidden" onChange={handleChange} checked={formData.service_type === 'ssl'} /><Shield size={16} className="mx-auto mb-1" /> SSL</label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">عنوان سرویس *</label><input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:border-blue-500 text-sm" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">کارگزار مرجع *</label><input type="text" name="provider" required value={formData.provider} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:border-blue-500 text-sm" /></div>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2"><DollarSign size={16}/> اطلاعات مالی</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">بهای تمام‌شده (تومان)</label>
                  <input type="text" name="buy_price" value={formatPrice(formData.buy_price)} onChange={handlePriceChange} dir="ltr" className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-green-500 text-sm font-mono text-left" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">بهای فروش به مشتری</label>
                  <input type="text" name="sell_price" value={formatPrice(formData.sell_price)} onChange={handlePriceChange} dir="ltr" className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-green-500 text-sm font-mono text-left" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">وضعیت پرداخت</label>
                  <select name="payment_status" value={formData.payment_status} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-blue-500 text-sm"><option value="pending">در انتظار پرداخت</option><option value="paid">تسویه شده</option></select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1"><Calendar size={14}/> تاریخ فاکتور *</label>
                <DatePicker calendar={persian} locale={persian_fa} value={formData.start_date ? new DateObject({ date: formData.start_date, format: "YYYY-MM-DD", calendar: gregorian, locale: gregorian_en }) : ""} onChange={(date) => setFormData({ ...formData, start_date: date ? date.convert(gregorian, gregorian_en).format("YYYY-MM-DD") : "" })} format="YYYY/MM/DD" containerClassName="w-full" inputClass="w-full border border-gray-300 rounded-xl p-3 text-sm text-left font-mono" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1 text-rose-600"><Calendar size={14}/> سررسید / انقضا *</label>
                <DatePicker calendar={persian} locale={persian_fa} value={formData.end_date ? new DateObject({ date: formData.end_date, format: "YYYY-MM-DD", calendar: gregorian, locale: gregorian_en }) : ""} onChange={(date) => setFormData({ ...formData, end_date: date ? date.convert(gregorian, gregorian_en).format("YYYY-MM-DD") : "" })} format="YYYY/MM/DD" containerClassName="w-full" inputClass="w-full border border-gray-300 rounded-xl p-3 text-sm text-left font-mono bg-rose-50" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1"><FileText size={14}/> توضیحات تکمیلی (اختیاری)</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="2" placeholder="یادداشت‌ها..." className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:border-blue-500 text-sm"></textarea>
            </div>
          </form>
        </div>

        <div className="p-5 border-t border-gray-100 flex gap-3 shrink-0 bg-white">
          <button type="button" onClick={onClose} className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold">انصراف</button>
          <button type="submit" form="service-form" disabled={loading} className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold disabled:opacity-50">{loading ? 'در حال ثبت...' : 'ثبت سرویس'}</button>
        </div>
      </div>
    </div>
  );
}

export default ServiceForm;