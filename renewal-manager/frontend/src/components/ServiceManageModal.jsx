import React, { useState } from 'react';
import { X, CreditCard, History, CheckCircle2, FileText } from 'lucide-react';
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import moment from 'moment-jalaali';
import api from '../api';

function ServiceManageModal({ service, onSuccess, onClose }) {
  const [activeTab, setActiveTab] = useState('renew');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [renewData, setRenewData] = useState({
    amount: service.sell_price || '',
    payment_date: new Date().toISOString().split('T')[0],
    new_end_date: '',
    notes: '' // فیلد یادداشت
  });

  const formatPrice = (value) => {
    if (!value && value !== 0) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handlePriceChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, '');
    if (rawValue === '' || !isNaN(rawValue)) { setRenewData({ ...renewData, amount: rawValue }); }
  };

  const handleRenewSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setMessage('');

    try {
      // استفاده از Promise.all برای اجرای همزمان و رفع باگ آپدیت نشدن لیست اصلی
      await Promise.all([
        api.post('services/renewals/', {
          service: service.id,
          amount: renewData.amount || 0,
          payment_date: renewData.payment_date,
          new_end_date: renewData.new_end_date,
          notes: renewData.notes
        }),
        api.patch(`services/items/${service.id}/`, {
          end_date: renewData.new_end_date,
          payment_status: 'paid'
        })
      ]);

      setMessage('تمدید با موفقیت ثبت و داشبورد بروزرسانی شد!');
      setTimeout(() => {
        setLoading(false);
        onSuccess(); // این دستور باعث رفرش زنده داشبورد می‌شود
      }, 1500);

    } catch (err) {
      console.error(err);
      setMessage('خطا در ثبت تمدید.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col h-[85vh] md:h-auto md:max-h-[90vh]">
        <div className="flex justify-between items-start p-5 border-b border-gray-100 bg-gray-50/50 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1"><h2 className="text-xl font-bold text-gray-900">{service.title}</h2><span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{service.service_type_display}</span></div>
            <p className="text-sm text-gray-500">مشتری: <span className="font-bold text-gray-700">{service.customer_name}</span></p>
          </div>
          <button onClick={onClose} className="p-2 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-red-500"><X size={18} /></button>
        </div>

        <div className="flex border-b border-gray-100 px-5 pt-3 shrink-0">
          <button onClick={() => setActiveTab('renew')} className={`pb-3 px-4 text-sm font-bold border-b-2 flex items-center gap-2 ${activeTab === 'renew' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500'}`}><CreditCard size={16} /> ثبت پرداخت و تمدید</button>
          <button onClick={() => setActiveTab('history')} className={`pb-3 px-4 text-sm font-bold border-b-2 flex items-center gap-2 ${activeTab === 'history' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500'}`}><History size={16} /> تاریخچه پرداخت‌ها</button>
        </div>

        <div className="p-6 overflow-y-auto flex-grow bg-white">
          {message && <div className={`mb-6 p-4 rounded-xl text-sm font-bold flex items-center gap-2 ${message.includes('موفقیت') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}><CheckCircle2 size={18} /> {message}</div>}

          {activeTab === 'renew' && (
            <form onSubmit={handleRenewSubmit} className="space-y-5">
              <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl text-sm text-orange-800 mb-6">انقضای فعلی: <span className="font-bold font-mono ml-1" dir="ltr">{moment(service.end_date, 'YYYY-MM-DD').format('jYYYY/jMM/jDD')}</span></div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">مبلغ پرداخت شده (تومان)</label>
                <input type="text" required value={formatPrice(renewData.amount)} onChange={handlePriceChange} dir="ltr" className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:border-purple-500 font-mono text-left" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">تاریخ پرداخت</label>
                  <DatePicker calendar={persian} locale={persian_fa} value={renewData.payment_date ? new DateObject({ date: renewData.payment_date, format: "YYYY-MM-DD", calendar: gregorian, locale: gregorian_en }) : ""} onChange={(date) => setRenewData({ ...renewData, payment_date: date ? date.convert(gregorian, gregorian_en).format("YYYY-MM-DD") : "" })} format="YYYY/MM/DD" containerClassName="w-full" inputClass="w-full border border-gray-300 rounded-xl p-3 text-sm text-left font-mono" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-rose-600 mb-1.5">سررسید جدید تخصیص یافته *</label>
                  <DatePicker calendar={persian} locale={persian_fa} value={renewData.new_end_date ? new DateObject({ date: renewData.new_end_date, format: "YYYY-MM-DD", calendar: gregorian, locale: gregorian_en }) : ""} onChange={(date) => setRenewData({ ...renewData, new_end_date: date ? date.convert(gregorian, gregorian_en).format("YYYY-MM-DD") : "" })} format="YYYY/MM/DD" containerClassName="w-full" inputClass="w-full border-2 border-rose-200 bg-rose-50 rounded-xl p-3 text-sm text-left font-mono" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1"><FileText size={14}/> توضیحات یا شناسه پیگیری پرداخت</label>
                <textarea value={renewData.notes} onChange={(e) => setRenewData({...renewData, notes: e.target.value})} rows="2" className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:border-purple-500 text-sm"></textarea>
              </div>

              <button type="submit" disabled={loading} className="w-full py-3 mt-4 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 disabled:opacity-50">{loading ? 'در حال ثبت...' : 'ثبت پرداخت و تمدید سرویس'}</button>
            </form>
          )}

          {activeTab === 'history' && (
            <div>
              {(!service.renewals || service.renewals.length === 0) ? (
                <div className="text-center py-10 text-gray-400 border-2 border-dashed border-gray-100 rounded-2xl"><History size={32} className="mx-auto mb-3 opacity-50" /><p>تا کنون تاریخچه پرداختی برای این سرویس ثبت نشده است.</p></div>
              ) : (
                <div className="space-y-3">
                  {service.renewals.map((r, idx) => (
                    <div key={idx} className="bg-gray-50 border border-gray-100 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                      <div>
                        <span className="block text-xs text-gray-500 mb-1">تاریخ پرداخت: <span className="font-bold text-gray-800 font-mono" dir="ltr">{moment(r.payment_date, 'YYYY-MM-DD').format('jYYYY/jMM/jDD')}</span></span>
                        <span className="block text-xs text-gray-500 mb-1">ارتقا سررسید تا: <span className="font-bold text-blue-600 font-mono" dir="ltr">{moment(r.new_end_date, 'YYYY-MM-DD').format('jYYYY/jMM/jDD')}</span></span>
                        {r.notes && <span className="block text-[11px] text-gray-400 mt-2">یادداشت: {r.notes}</span>}
                      </div>
                      <div className="text-left font-bold text-green-600">{Number(r.amount).toLocaleString()} <span className="text-[10px] font-normal text-gray-400">تومان</span></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ServiceManageModal;