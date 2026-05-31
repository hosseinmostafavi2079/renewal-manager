import React, { useEffect, useState } from 'react';
import { Plus, Search, Building2, Phone, Mail, Edit, Trash2 } from 'lucide-react';
import api from '../api';
import CustomerForm from '../components/CustomerForm';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchCustomers = () => {
    setLoading(true);
    api.get('services/customers/')
      .then(response => {
        setCustomers(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("خطا در دریافت مشتریان:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSuccess = () => {
    setShowModal(false);
    fetchCustomers();
  };

  return (
    <div className="space-y-6">
      
      {/* نوار ابزار (جستجو و دکمه افزودن) */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <button 
          onClick={() => setShowModal(true)}
          className="bg-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-purple-700 transition-all flex items-center gap-2 w-full md:w-auto justify-center"
        >
          <Plus size={18} />
          افزودن مشتری جدید
        </button>

        <div className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="جستجو بر اساس عنوان سرویس، نام مشتری..." 
            className="w-full border border-gray-300 rounded-xl p-2.5 pl-10 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm"
          />
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        </div>
      </div>

      {/* مودال افزودن */}
      {showModal && <CustomerForm onClose={() => setShowModal(false)} onSuccess={handleSuccess} />}

      {/* گرید کارت‌های مشتریان */}
      {loading ? (
        <p className="text-center text-gray-500 mt-10 animate-pulse">در حال دریافت لیست مشتریان...</p>
      ) : customers.length === 0 ? (
        <div className="text-center bg-white p-10 rounded-2xl border border-gray-100">
          <p className="text-gray-500">هیچ مشتری‌ای در سیستم ثبت نشده است.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map(customer => (
            <div key={customer.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-6 flex flex-col h-full">
              
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${customer.is_active ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                  {customer.is_active ? 'فعال' : 'غیرفعال'}
                </span>
              </div>

              <div className="text-center mb-6 flex-grow">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{customer.full_name}</h3>
                {customer.company && (
                  <div className="flex items-center justify-center gap-1.5 text-gray-500 text-sm">
                    <Building2 size={16} />
                    <span>{customer.company}</span>
                  </div>
                )}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
                  <Phone size={16} className="text-gray-400" />
                  <span dir="ltr" className="font-mono">{customer.mobile}</span>
                </div>
                {customer.email && (
                  <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
                    <Mail size={16} className="text-gray-400" />
                    <span dir="ltr" className="font-mono">{customer.email}</span>
                  </div>
                )}
              </div>

              {/* فوتر کارت */}
              <div className="border-t border-gray-100 pt-4 flex justify-between items-center mt-auto">
                <div className="flex gap-2">
                  <button className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                    <Edit size={16} />
                  </button>
                  <button className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="text-left">
                  <span className="block text-[10px] text-gray-400 mb-0.5">تعداد اشتراک‌ها:</span>
                  {/* این عدد در فاز بعدی از بک‌اند واقعی خوانده می‌شود */}
                  <span className="text-sm font-bold text-gray-800">بررسی سرویس‌ها</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Customers;