import React, { useEffect, useState } from 'react';
import { Plus, Search, Calendar, AlertTriangle, Users, TrendingUp, Globe, Server, Shield } from 'lucide-react';
import api from '../api';
import ServiceForm from '../components/ServiceForm';
import CustomerForm from '../components/CustomerForm';
import moment from 'moment-jalaali';
import ServiceManageModal from '../components/ServiceManageModal';

function Dashboard() {
  const [stats, setStats] = useState({ customers_count: 0, active_services_count: 0, pending_services_count: 0, total_unpaid_amount: 0 });
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [manageService, setManageService] = useState(null);

  const fetchData = () => {
    setLoading(true);
    Promise.all([api.get('services/dashboard/'), api.get('services/items/')])
      .then(([statsRes, servicesRes]) => {
        setStats(statsRes.data); setServices(servicesRes.data); setLoading(false);
      }).catch(err => { console.error(err); setLoading(false); });
  };

  useEffect(() => { fetchData(); }, []);

  const handleSuccess = () => {
    setShowServiceForm(false); setShowCustomerForm(false); setManageService(null);
    fetchData();
  };

  // ساخت لینک تقویم گوگل با تمام جزئیات و باز کردن آن با یک کلیک
  const handleGoogleCalendar = (service) => {
    const date = new Date(service.end_date);
    const nextDate = new Date(date); nextDate.setDate(date.getDate() + 1);
    const format = (d) => d.toISOString().split('T')[0].replace(/-/g, '');
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('سررسید تمدید: ' + service.title)}&dates=${format(date)}/${format(nextDate)}&details=${encodeURIComponent('مشتری: ' + service.customer_name + '\nارائه‌دهنده: ' + service.provider + (service.description ? '\nتوضیحات: ' + service.description : ''))}`;
    window.open(url, '_blank');
  };

  const getServiceIcon = (type) => {
    switch(type) {
      case 'domain': return <Globe size={20} className="text-blue-500" />;
      case 'server': return <Server size={20} className="text-purple-500" />;
      case 'ssl': return <Shield size={20} className="text-green-500" />;
      default: return <Server size={20} className="text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between"><div className="flex justify-between items-start mb-4"><div className="bg-indigo-50 text-indigo-600 p-2 rounded-xl"><TrendingUp size={20} /></div></div><div><p className="text-xs text-gray-500 font-bold mb-1">میانگین سرمایه ناخالص (معوقه)</p><p className="text-2xl font-bold text-gray-900">{Number(stats.total_unpaid_amount).toLocaleString()} <span className="text-sm text-gray-400 font-normal">تومان</span></p></div></div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between"><div className="flex justify-between items-start mb-4"><div className="bg-blue-50 text-blue-600 p-2 rounded-xl"><Calendar size={20} /></div></div><div><p className="text-xs text-gray-500 font-bold mb-1">سرویس‌های در حال اجرا</p><p className="text-2xl font-bold text-gray-900">{stats.active_services_count}</p></div></div>
        <div className="bg-[#ff004f] rounded-2xl p-6 shadow-lg shadow-rose-200 flex flex-col justify-between text-white relative overflow-hidden"><div className="absolute top-0 left-0 w-full h-full bg-white opacity-5"></div><div className="flex justify-between items-start mb-4 relative z-10"><div className="bg-white/20 p-2 rounded-xl"><AlertTriangle size={20} /></div></div><div className="relative z-10"><p className="text-xs font-bold mb-1 opacity-90">اشتراک‌های در انتظار پرداخت</p><p className="text-3xl font-bold">{stats.pending_services_count}</p></div></div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between"><div className="flex justify-between items-start mb-4"><div className="bg-gray-50 text-gray-500 p-2 rounded-xl"><Users size={20} /></div></div><div><p className="text-xs text-gray-500 font-bold mb-1">مشتریان ثبت‌شده در سامانه</p><p className="text-2xl font-bold text-gray-900">{stats.customers_count}</p></div></div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex gap-3 w-full md:w-auto"><button onClick={() => setShowServiceForm(true)} className="flex-1 md:flex-none bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"><Plus size={18} /> افزودن سرویس جدید</button><button onClick={() => setShowCustomerForm(true)} className="flex-1 md:flex-none bg-white text-blue-600 border-2 border-blue-100 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-50 transition-all flex items-center justify-center gap-2"><Plus size={18} /> افزودن مشتری جدید</button></div>
        <div className="relative w-full md:w-96"><input type="text" placeholder="جستجو..." className="w-full border border-gray-300 rounded-xl p-2.5 pl-10 outline-none focus:border-blue-500 text-sm" /><Search className="absolute left-3 top-3 text-gray-400" size={18} /></div>
      </div>

      {showServiceForm && <ServiceForm onClose={() => setShowServiceForm(false)} onSuccess={handleSuccess} />}
      {showCustomerForm && <CustomerForm onClose={() => setShowCustomerForm(false)} onSuccess={handleSuccess} />}
      {manageService && <ServiceManageModal service={manageService} onClose={() => setManageService(null)} onSuccess={handleSuccess} />}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-50 bg-gray-50/50"><h3 className="font-bold text-gray-800 text-sm">لیست سرویس‌ها و دامنه‌ها</h3></div>
        {loading ? (<p className="text-center text-gray-500 py-10 animate-pulse">در حال دریافت اطلاعات...</p>) : services.length === 0 ? (<p className="text-center text-gray-500 py-10">هیچ سرویسی در سیستم یافت نشد.</p>) : (
          <div className="divide-y divide-gray-100">
            {services.map(service => (
              <div key={service.id} className="p-5 hover:bg-gray-50/80 transition-colors flex flex-col lg:flex-row items-center justify-between gap-6">
                
                <div className="flex items-center gap-4 w-full lg:w-1/4">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 shrink-0">{getServiceIcon(service.service_type)}</div>
                  <div><h4 className="font-bold text-gray-900 mb-1">{service.title}</h4><span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">{service.service_type_display}</span></div>
                </div>

                <div className="w-full lg:w-1/4 flex flex-col gap-1 text-sm">
                  <div className="flex justify-between lg:block"><span className="text-gray-400 lg:hidden text-xs">مشتری: </span><span className="font-bold text-gray-700">{service.customer_name}</span></div>
                  <div className="flex justify-between lg:block text-xs text-gray-500"><span className="text-gray-400 lg:hidden text-xs">کارگزار: </span><span>{service.provider}</span></div>
                </div>

                <div className="w-full lg:w-1/5 flex flex-col gap-1">
                  <div className="flex justify-between lg:block"><span className="text-xs text-gray-400">بهای فروش:</span><span className="font-bold text-gray-900 text-sm mr-1">{Number(service.sell_price).toLocaleString()} <span className="text-[10px] font-normal text-gray-400">تومان</span></span></div>
                  <div className="flex justify-between lg:block"><span className="text-xs text-gray-400">خرید:</span><span className="text-xs text-gray-500 mr-1">{Number(service.buy_price).toLocaleString()}</span></div>
                </div>

                <div className="w-full lg:w-1/4 flex flex-col items-end gap-3 text-sm">
                  <div className="flex w-full justify-between lg:justify-end items-center gap-4">
                    <div className="text-left" dir="ltr"><div className="font-mono text-gray-700 font-bold mb-1">{moment(service.end_date, 'YYYY-MM-DD').format('jYYYY/jMM/jDD')}</div><div className="text-[10px] text-gray-400 text-right">تاریخ انقضا (شمسی)</div></div>
                    <div><span className={`px-3 py-1.5 rounded-full text-xs font-bold ${service.payment_status === 'paid' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>{service.payment_status_display}</span></div>
                  </div>
                  
                  {/* دکمه‌های تقویم گوگل و مدیریت دقیقاً در دسترس */}
                  <div className="flex gap-2 w-full lg:w-auto mt-2">
                    <button onClick={() => handleGoogleCalendar(service)} className="p-2 bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="افزودن به تقویم گوگل">
                      <Calendar size={16} />
                    </button>
                    <button onClick={() => setManageService(service)} className="text-xs bg-white border border-purple-200 text-purple-700 hover:bg-purple-50 px-4 py-2 rounded-lg font-bold transition-all flex-grow">
                      مدیریت و تمدید
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;