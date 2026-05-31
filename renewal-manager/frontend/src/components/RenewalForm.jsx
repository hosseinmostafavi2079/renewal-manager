import React, { useState } from 'react';
import api from '../api';

function RenewalForm({ serviceId, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    service: serviceId,
    amount: '',
    due_date: '',
    is_paid: false,
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    api.post('services/renewals/', formData)
      .then(response => {
        setLoading(false);
        if (onSuccess) onSuccess();
      })
      .catch(err => {
        setLoading(false);
        setError('خطا در ثبت رکورد مالی. لطفاً مقادیر را بررسی کنید.');
        console.error(err);
      });
  };

  return (
    <div className="mt-4 p-4 bg-gray-50 border border-gray-200">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-bold text-swiss-dark">ثبت تمدید جدید</h4>
        <button onClick={onCancel} className="text-xs text-gray-500 hover:text-red-500">لغو ✕</button>
      </div>

      {error && <div className="mb-3 text-xs text-red-600">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">مبلغ (تومان) *</label>
          <input
            type="number"
            name="amount"
            required
            value={formData.amount}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 text-sm outline-none focus:border-swiss-dark bg-white"
            placeholder="مثال: 1500000"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">تاریخ سررسید *</label>
          <input
            type="date"
            name="due_date"
            required
            value={formData.due_date}
            onChange={handleChange}
            dir="ltr"
            className="w-full border border-gray-300 p-2 text-sm outline-none focus:border-swiss-dark bg-white text-left"
          />
        </div>

        <div className="flex items-center mt-2">
          <input
            type="checkbox"
            name="is_paid"
            id={`is_paid_${serviceId}`}
            checked={formData.is_paid}
            onChange={handleChange}
            className="w-4 h-4 text-swiss-dark border-gray-300 rounded focus:ring-swiss-dark"
          />
          <label htmlFor={`is_paid_${serviceId}`} className="ml-2 mr-2 text-sm text-gray-700">
            این مبلغ قبلاً پرداخت شده است
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-swiss-dark text-white p-2 text-sm font-bold mt-2 hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? 'در حال ثبت...' : 'ذخیره رکورد'}
        </button>
      </form>
    </div>
  );
}

export default RenewalForm;