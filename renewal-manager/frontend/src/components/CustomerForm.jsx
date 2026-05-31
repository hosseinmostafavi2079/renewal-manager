import React, { useState, useEffect } from 'react';
import { X, User, Building2, Phone, Mail } from 'lucide-react';
import api from '../api';

function CustomerForm({ customer, onSuccess, onClose }) {
  const [formData, setFormData] = useState({
    full_name: '', company: '', mobile: '', email: '', is_active: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // لود کردن اطلاعات مشتری در صورت ویرایش
  useEffect(() => {
    if (customer) {
      setFormData({
        full_name: customer.full_name || '', company: customer.company || '',
        mobile: customer.mobile || '', email: customer.email || '', is_active: customer.is_active,
      });
    }
  }, [customer]);

  const handleChange = (e) => {
    const value = e.target.type === 'radio' ? e.target.value === 'true' : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true); setError('');

    // تشخیص اینکه ثبت جدید است یا ویرایش
    const request = customer 
      ? api.put(`services/customers/${customer.id}/`, formData)
      : api.post('services/customers/', formData);

    request.then(() => {
      setLoading(false);
      if (onSuccess) onSuccess();
    }).catch(err => {
      setLoading(false);
      setError('خطا در ثبت اطلاعات. لطفاً مقادیر را بررسی کنید.');
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-600"></div>
            <h2 className="text-lg font-bold text-gray-800">{customer ? 'ویرایش مشتری' : 'افزودن مشتری جدید'}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>}

          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">نام و نام خانوادگی *</label><div className="relative"><input type="text" name="full_name" required value={formData.full_name} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 pr-10 outline-none focus:border-purple-500 focus:ring-1 text-sm" /><User className="absolute right-3 top-3 text-gray-400" size={18} /></div></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">نام شرکت / صنف</label><div className="relative"><input type="text" name="company" value={formData.company} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 pr-10 outline-none focus:border-purple-500 focus:ring-1 text-sm" /><Building2 className="absolute right-3 top-3 text-gray-400" size={18} /></div></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">شماره موبایل *</label><div className="relative"><input type="text" name="mobile" required value={formData.mobile} onChange={handleChange} dir="ltr" className="w-full border border-gray-300 rounded-xl p-3 pl-10 text-left outline-none focus:border-purple-500 focus:ring-1 text-sm font-mono" /><Phone className="absolute left-3 top-3 text-gray-400" size={18} /></div></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">نشانی ایمیل</label><div className="relative"><input type="email" name="email" value={formData.email} onChange={handleChange} dir="ltr" className="w-full border border-gray-300 rounded-xl p-3 pl-10 text-left outline-none focus:border-purple-500 focus:ring-1 text-sm font-mono" /><Mail className="absolute left-3 top-3 text-gray-400" size={18} /></div></div>

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50">انصراف</button>
            <button type="submit" disabled={loading} className="flex-1 py-3 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 disabled:opacity-50">{loading ? 'در حال ثبت...' : 'ذخیره اطلاعات'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CustomerForm;