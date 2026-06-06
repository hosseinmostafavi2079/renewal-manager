import React, { useState, useEffect } from 'react';
import { X, User, Building2, Phone, Mail, Bell } from 'lucide-react';
import api from '../api';

function CustomerForm({ customer, onSuccess, onClose }) {
  const [formData, setFormData] = useState({
    full_name: '', company: '', mobile: '', email: '', is_active: true, receive_alerts: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (customer) {
      setFormData({
        full_name: customer.full_name || '',
        company: customer.company || '',
        mobile: customer.mobile || '',
        email: customer.email || '',
        is_active: customer.is_active,
        receive_alerts: customer.receive_alerts ?? true,
      });
    }
  }, [customer]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    const request = customer
      ? api.put(`services/customers/${customer.id}/`, formData)
      : api.post('services/customers/', formData);
    request
      .then(() => { setLoading(false); if (onSuccess) onSuccess(); })
      .catch(() => { setLoading(false); setError('خطا در ثبت اطلاعات. لطفاً مقادیر را بررسی کنید.'); });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex justify-center items-center p-4">
      <div className="bg-[#13151f] rounded-2xl shadow-2xl shadow-black/60 w-full max-w-md border border-white/[0.08] overflow-hidden">

        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400">
              <User size={16} />
            </div>
            <h2 className="text-base font-bold text-white">
              {customer ? 'ویرایش مشتری' : 'مشتری جدید'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.06] transition-all">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 text-red-400 text-xs rounded-xl border border-red-500/20">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-white/40 mb-2 uppercase tracking-wider">نام و نام خانوادگی *</label>
            <div className="relative">
              <input type="text" name="full_name" required value={formData.full_name} onChange={handleChange}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-white/15 outline-none focus:border-violet-500/50 transition-all" />
              <User size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/20" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-white/40 mb-2 uppercase tracking-wider">نام شرکت / صنف</label>
            <div className="relative">
              <input type="text" name="company" value={formData.company} onChange={handleChange}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-white/15 outline-none focus:border-violet-500/50 transition-all" />
              <Building2 size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/20" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-white/40 mb-2 uppercase tracking-wider">شماره موبایل *</label>
            <div className="relative">
              <input type="text" name="mobile" required value={formData.mobile} onChange={handleChange} dir="ltr"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 pl-11 text-sm text-white placeholder-white/15 outline-none focus:border-violet-500/50 transition-all font-mono text-left" />
              <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-white/40 mb-2 uppercase tracking-wider">ایمیل</label>
            <div className="relative">
              <input type="email" name="email" value={formData.email} onChange={handleChange} dir="ltr"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 pl-11 text-sm text-white placeholder-white/15 outline-none focus:border-violet-500/50 transition-all font-mono text-left" />
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" />
            </div>
          </div>

          {/* Toggles */}
          <div className="flex gap-3 pt-1">
            <label className="flex-1 flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] cursor-pointer hover:bg-white/[0.05] transition-all">
              <div className={`w-9 h-5 rounded-full transition-colors relative ${formData.is_active ? 'bg-emerald-500' : 'bg-white/10'}`}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${formData.is_active ? 'right-0.5' : 'left-0.5'}`} />
              </div>
              <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="hidden" />
              <span className="text-xs text-white/50 font-medium">فعال</span>
            </label>
            <label className="flex-1 flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] cursor-pointer hover:bg-white/[0.05] transition-all">
              <div className={`w-9 h-5 rounded-full transition-colors relative ${formData.receive_alerts ? 'bg-violet-500' : 'bg-white/10'}`}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${formData.receive_alerts ? 'right-0.5' : 'left-0.5'}`} />
              </div>
              <input type="checkbox" name="receive_alerts" checked={formData.receive_alerts} onChange={handleChange} className="hidden" />
              <span className="text-xs text-white/50 font-medium">هشدار SMS</span>
            </label>
          </div>

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl text-sm font-bold text-white/40 bg-white/[0.04] border border-white/[0.06] hover:text-white/70 hover:bg-white/[0.06] transition-all">
              انصراف
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 transition-all shadow-lg shadow-violet-900/30">
              {loading ? 'در حال ثبت...' : 'ذخیره'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CustomerForm;