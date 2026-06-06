import React, { useEffect, useState } from 'react';
import {
  Plus, Calendar, AlertTriangle, Users, TrendingUp,
  Globe, Server, Shield, CreditCard, Clock, ChevronLeft,
  Zap, ArrowUpRight
} from 'lucide-react';
import api from '../api';
import ServiceForm from '../components/ServiceForm';
import CustomerForm from '../components/CustomerForm';
import moment from 'moment-jalaali';
import ServiceManageModal from '../components/ServiceManageModal';

const StatCard = ({ icon, label, value, unit, accent, gradient }) => (
  <div className={`relative overflow-hidden rounded-2xl p-5 ${gradient} border border-white/[0.06]`}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
    <div className="relative">
      <div className={`inline-flex p-2.5 rounded-xl ${accent} mb-4`}>
        {icon}
      </div>
      <p className="text-white/40 text-xs font-medium mb-1">{label}</p>
      <div className="flex items-end gap-2">
        <p className="text-2xl font-black text-white tracking-tight">{value}</p>
        {unit && <p className="text-white/30 text-xs mb-1">{unit}</p>}
      </div>
    </div>
  </div>
);

const ServiceTypeIcon = ({ type }) => {
  const icons = {
    domain: { icon: <Globe size={16} />, bg: 'bg-sky-500/10', text: 'text-sky-400' },
    server: { icon: <Server size={16} />, bg: 'bg-violet-500/10', text: 'text-violet-400' },
    ssl: { icon: <Shield size={16} />, bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  };
  const s = icons[type] || icons.server;
  return (
    <div className={`p-2.5 rounded-xl ${s.bg} ${s.text}`}>{s.icon}</div>
  );
};

const getDaysLeft = (endDate) => {
  const today = moment();
  const end = moment(endDate, 'YYYY-MM-DD');
  return end.diff(today, 'days');
};

const DaysLeftBadge = ({ endDate }) => {
  const days = getDaysLeft(endDate);
  if (days < 0) return (
    <span className="px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 text-[11px] font-bold border border-red-500/20">منقضی شده</span>
  );
  if (days <= 7) return (
    <span className="px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 text-[11px] font-bold border border-red-500/20 animate-pulse">{days} روز</span>
  );
  if (days <= 30) return (
    <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 text-[11px] font-bold border border-amber-500/20">{days} روز</span>
  );
  return (
    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-[11px] font-bold border border-emerald-500/20">{days} روز</span>
  );
};

function Dashboard() {
  const [stats, setStats] = useState({ customers_count: 0, active_services_count: 0, pending_services_count: 0, total_unpaid_amount: 0 });
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [manageService, setManageService] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = () => {
    setLoading(true);
    Promise.all([api.get('services/dashboard/'), api.get('services/items/')])
      .then(([statsRes, servicesRes]) => {
        setStats(statsRes.data);
        setServices(servicesRes.data);
        setLoading(false);
      }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleSuccess = () => {
    setShowServiceForm(false);
    setShowCustomerForm(false);
    setManageService(null);
    fetchData();
  };

  const handleGoogleCalendar = (service) => {
    const date = new Date(service.end_date);
    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + 1);
    const format = (d) => d.toISOString().split('T')[0].replace(/-/g, '');
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('سررسید تمدید: ' + service.title)}&dates=${format(date)}/${format(nextDate)}&details=${encodeURIComponent('مشتری: ' + service.customer_name)}`;
    window.open(url, '_blank');
  };

  const filtered = services.filter(s =>
    s.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.provider?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white">داشبورد سرویس‌ها</h2>
          <p className="text-white/30 text-sm mt-1">مدیریت، تمدید و پیگیری سرویس‌های زیرساختی</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCustomerForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-violet-400 bg-violet-500/10 border border-violet-500/20 hover:bg-violet-500/20 transition-all"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">مشتری جدید</span>
          </button>
          <button
            onClick={() => setShowServiceForm(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-900/30"
          >
            <Plus size={16} />
            <span>سرویس جدید</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<TrendingUp size={18} className="text-violet-400" />}
          label="مجموع معوقات"
          value={Number(stats.total_unpaid_amount).toLocaleString()}
          unit="تومان"
          accent="bg-violet-500/10"
          gradient="bg-[#1a1d2e]"
        />
        <StatCard
          icon={<Zap size={18} className="text-sky-400" />}
          label="سرویس‌های فعال"
          value={stats.active_services_count}
          accent="bg-sky-500/10"
          gradient="bg-[#1a1d2e]"
        />
        <StatCard
          icon={<AlertTriangle size={18} className="text-amber-400" />}
          label="در انتظار پرداخت"
          value={stats.pending_services_count}
          accent="bg-amber-500/10"
          gradient="bg-[#1e1a17]"
        />
        <StatCard
          icon={<Users size={18} className="text-emerald-400" />}
          label="کل مشتریان"
          value={stats.customers_count}
          accent="bg-emerald-500/10"
          gradient="bg-[#1a1d2e]"
        />
      </div>

      {/* Search + Filter Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="جستجو در سرویس‌ها..."
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-violet-500/50 focus:bg-white/[0.06] transition-all"
          />
        </div>
        <div className="text-white/20 text-xs">{filtered.length} سرویس</div>
      </div>

      {/* Services Table */}
      <div className="bg-[#13151f] rounded-2xl border border-white/[0.06] overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest">لیست سرویس‌ها</h3>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-flex gap-1">
              {[0,1,2].map(i => (
                <div key={i} className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
            <p className="text-white/20 text-sm mt-3">در حال دریافت...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Server size={32} className="mx-auto text-white/10 mb-3" />
            <p className="text-white/20 text-sm">سرویسی یافت نشد</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {filtered.map(service => {
              const daysLeft = getDaysLeft(service.end_date);
              const isUrgent = daysLeft <= 7;
              return (
                <div
                  key={service.id}
                  className={`px-6 py-4 flex flex-col lg:flex-row lg:items-center gap-4 transition-colors hover:bg-white/[0.02] ${isUrgent ? 'border-r-2 border-red-500' : ''}`}
                >
                  {/* Service info */}
                  <div className="flex items-center gap-3 lg:w-1/4 min-w-0">
                    <ServiceTypeIcon type={service.service_type} />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">{service.title}</p>
                      <p className="text-[11px] text-white/30 mt-0.5">{service.service_type_display}</p>
                    </div>
                  </div>

                  {/* Customer + Provider */}
                  <div className="lg:w-1/5 min-w-0">
                    <p className="text-sm text-white/70 font-medium truncate">{service.customer_name}</p>
                    <p className="text-[11px] text-white/30 mt-0.5 truncate">{service.provider}</p>
                  </div>

                  {/* Financials */}
                  <div className="lg:w-1/6">
                    <p className="text-sm font-bold text-white">{Number(service.sell_price).toLocaleString()} <span className="text-[10px] font-normal text-white/30">تومان</span></p>
                    {service.payment_status === 'pending' ? (
                      <p className="text-[11px] text-rose-400 mt-0.5">بدهکار</p>
                    ) : (
                      <p className="text-[11px] text-emerald-400 mt-0.5">تسویه</p>
                    )}
                  </div>

                  {/* Date + Days left */}
                  <div className="flex items-center gap-3 lg:w-1/5">
                    <div>
                      <p className="text-sm font-mono text-white/60" dir="ltr">{moment(service.end_date, 'YYYY-MM-DD').format('jYYYY/jMM/jDD')}</p>
                      <div className="mt-1"><DaysLeftBadge endDate={service.end_date} /></div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 lg:mr-auto">
                    <button
                      onClick={() => handleGoogleCalendar(service)}
                      className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-sky-400 hover:bg-sky-500/10 hover:border-sky-500/20 transition-all"
                      title="افزودن به گوگل کلندر"
                    >
                      <Calendar size={15} />
                    </button>
                    <button
                      onClick={() => setManageService(service)}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-violet-300 bg-violet-500/10 border border-violet-500/20 hover:bg-violet-500/20 transition-all whitespace-nowrap"
                    >
                      <CreditCard size={14} />
                      مدیریت
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      {showServiceForm && <ServiceForm onClose={() => setShowServiceForm(false)} onSuccess={handleSuccess} />}
      {showCustomerForm && <CustomerForm onClose={() => setShowCustomerForm(false)} onSuccess={handleSuccess} />}
      {manageService && <ServiceManageModal service={manageService} onClose={() => setManageService(null)} onSuccess={handleSuccess} />}
    </div>
  );
}

export default Dashboard;