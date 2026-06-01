import React, { useState } from 'react';
import { X, CreditCard, History, CheckCircle2, FileText } from 'lucide-react';
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import moment from 'moment-jalaali';
import api from '../api';

const inputClass = "w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/15 outline-none focus:border-violet-500/50 focus:bg-white/[0.06] transition-all";
const labelClass = "block text-xs font-bold text-white/40 mb-2 uppercase tracking-wider";
const dateInputClass = "w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-violet-500/50 transition-all font-mono";

function ServiceManageModal({ service, onSuccess, onClose }) {
  const [activeTab, setActiveTab] = useState('renew');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [renewData, setRenewData] = useState({
    amount: service.sell_price || '',
    payment_date: new Date().toISOString().split('T')[0],
    new_end_date: '',
    notes: ''
  });

  const formatPrice = (v) => !v && v !== 0 ? '' : v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const handlePriceChange = (e) => {
    const raw = e.target.value.replace(/,/g, '');
    if (raw === '' || !isNaN(raw)) setRenewData({ ...renewData, amount: raw });
  };

  const handleRenewSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setMessage('');
    try {
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
      setMessage('success');
      setTimeout(() => { setLoading(false); onSuccess(); }, 1500);
    } catch {
      setMessage('error');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex justify-center items-center p-4">
      <div className="bg-[#13151f] rounded-2xl shadow-2xl shadow-black/60 w-full max-w-xl border border-white/[0.08] flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-white/[0.06] bg-white/[0.01] shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-base font-bold text-white">{service.title}</h2>
              <span className="text-[10px] bg-violet-500/10 text-violet-400 px-2 py-0.5 rounded-lg border border-violet-500/20 font-bold">
                {service.service_type_display}
              </span>
            </div>
            <p className="text-xs text-white/30">مشتری: <span className="text-white/60 font-bold">{service.customer_name}</span></p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.06] transition-all shrink-0">
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 mx-5 mt-4 bg-white/[0.03] rounded-xl border border-white/[0.06] shrink-0">
          {[
            { id: 'renew', label: 'ثبت تمدید', icon: <CreditCard size={14} /> },
            { id: 'history', label: 'تاریخچه', icon: <History size={14} /> },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-violet-500 text-white shadow-lg shadow-violet-900/30'
                  : 'text-white/30 hover:text-white/60'
              }`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="p-5 overflow-y-auto flex-grow">

          {/* Status message */}
          {message === 'success' && (
            <div className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold">
              <CheckCircle2 size={16} /> تمدید با موفقیت ثبت شد!
            </div>
          )}
          {message === 'error' && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              خطا در ثبت تمدید.
            </div>
          )}

          {/* Renew tab */}
          {activeTab === 'renew' && (
            <form onSubmit={handleRenewSubmit} className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-amber-500/5 rounded-xl border border-amber-500/10">
                <div className="w-1 h-8 bg-amber-500/40 rounded-full shrink-0" />
                <div>
                  <p className="text-xs text-white/30">انقضای فعلی</p>
                  <p className="text-sm font-mono font-bold text-amber-400" dir="ltr">
                    {moment(service.end_date, 'YYYY-MM-DD').format('jYYYY/jMM/jDD')}
                  </p>
                </div>
              </div>

              <div>
                <label className={labelClass}>مبلغ پرداخت (تومان)</label>
                <input type="text" required value={formatPrice(renewData.amount)} onChange={handlePriceChange}
                  dir="ltr" className={inputClass + " text-left font-mono"} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>تاریخ پرداخت</label>
                  <DatePicker calendar={persian} locale={persian_fa}
                    value={renewData.payment_date ? new DateObject({ date: renewData.payment_date, format: "YYYY-MM-DD", calendar: gregorian, locale: gregorian_en }) : ""}
                    onChange={(date) => setRenewData({ ...renewData, payment_date: date ? date.convert(gregorian, gregorian_en).format("YYYY-MM-DD") : "" })}
                    format="YYYY/MM/DD" containerClassName="w-full" inputClass={dateInputClass} />
                </div>
                <div>
                  <label className={labelClass + " text-rose-400"}>سررسید جدید *</label>
                  <DatePicker calendar={persian} locale={persian_fa}
                    value={renewData.new_end_date ? new DateObject({ date: renewData.new_end_date, format: "YYYY-MM-DD", calendar: gregorian, locale: gregorian_en }) : ""}
                    onChange={(date) => setRenewData({ ...renewData, new_end_date: date ? date.convert(gregorian, gregorian_en).format("YYYY-MM-DD") : "" })}
                    format="YYYY/MM/DD" containerClassName="w-full" inputClass={dateInputClass + " border-rose-500/20"} />
                </div>
              </div>

              <div>
                <label className={labelClass + " flex items-center gap-1"}><FileText size={12} /> توضیحات / شناسه پیگیری</label>
                <textarea value={renewData.notes} onChange={(e) => setRenewData({ ...renewData, notes: e.target.value })}
                  rows="2" className={inputClass + " resize-none"} />
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 transition-all shadow-lg shadow-violet-900/30 mt-2">
                {loading ? 'در حال ثبت...' : 'ثبت پرداخت و تمدید'}
              </button>
            </form>
          )}

          {/* History tab */}
          {activeTab === 'history' && (
            <div>
              {!service.renewals?.length ? (
                <div className="py-10 text-center">
                  <History size={28} className="mx-auto text-white/10 mb-3" />
                  <p className="text-white/20 text-sm">تاریخچه‌ای ثبت نشده است</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {service.renewals.map((r, idx) => (
                    <div key={idx} className="bg-white/[0.03] rounded-xl border border-white/[0.06] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-white/30">پرداخت:</span>
                            <span className="text-xs font-mono font-bold text-white/60" dir="ltr">
                              {moment(r.payment_date, 'YYYY-MM-DD').format('jYYYY/jMM/jDD')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-white/30">سررسید جدید:</span>
                            <span className="text-xs font-mono font-bold text-sky-400" dir="ltr">
                              {moment(r.new_end_date, 'YYYY-MM-DD').format('jYYYY/jMM/jDD')}
                            </span>
                          </div>
                          {r.notes && (
                            <p className="text-[11px] text-white/20 mt-1">{r.notes}</p>
                          )}
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-sm font-black text-emerald-400">
                            {Number(r.amount).toLocaleString()}
                          </p>
                          <p className="text-[10px] text-white/20">تومان</p>
                        </div>
                      </div>
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