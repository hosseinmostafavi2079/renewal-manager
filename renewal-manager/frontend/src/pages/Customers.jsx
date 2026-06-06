import React, { useEffect, useState } from 'react';
import { Plus, Search, Building2, Phone, Mail, Edit, Trash2, Users, BellOff, Bell } from 'lucide-react';
import api from '../api';
import CustomerForm from '../components/CustomerForm';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCustomers = () => {
    setLoading(true);
    api.get('services/customers/')
      .then(res => { setCustomers(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchCustomers(); }, []);

  const handleSuccess = () => {
    setShowModal(false);
    setEditCustomer(null);
    fetchCustomers();
  };

  const handleDelete = (id) => {
    if (window.confirm('آیا از حذف این مشتری مطمئن هستید؟')) {
      api.delete(`services/customers/${id}/`).then(fetchCustomers);
    }
  };

  const filtered = customers.filter(c =>
    c.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.mobile?.includes(searchTerm) ||
    c.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white">مشتریان</h2>
          <p className="text-white/30 text-sm mt-1">{customers.length} مشتری در پایگاه داده</p>
        </div>
        <button
          onClick={() => { setEditCustomer(null); setShowModal(true); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-900/30"
        >
          <Plus size={16} />
          افزودن مشتری
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/20" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="جستجو بر اساس نام، موبایل..."
          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pr-10 pl-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-violet-500/50 transition-all"
        />
      </div>

      {showModal && (
        <CustomerForm
          customer={editCustomer}
          onClose={() => { setShowModal(false); setEditCustomer(null); }}
          onSuccess={handleSuccess}
        />
      )}

      {loading ? (
        <div className="p-12 text-center">
          <div className="inline-flex gap-1">
            {[0,1,2].map(i => (
              <div key={i} className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#13151f] rounded-2xl border border-white/[0.06] p-12 text-center">
          <Users size={32} className="mx-auto text-white/10 mb-3" />
          <p className="text-white/20 text-sm">مشتری‌ای یافت نشد</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(customer => (
            <div
              key={customer.id}
              className="bg-[#13151f] rounded-2xl border border-white/[0.06] p-5 hover:border-violet-500/20 transition-all group"
            >
              {/* Top row */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/10 flex items-center justify-center">
                  <span className="text-violet-400 text-sm font-black">
                    {customer.full_name?.charAt(0)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                    customer.is_active
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-white/[0.05] text-white/30 border border-white/[0.06]'
                  }`}>
                    {customer.is_active ? 'فعال' : 'غیرفعال'}
                  </span>
                  {!customer.receive_alerts && (
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                      <BellOff size={10} /> بی‌صدا
                    </span>
                  )}
                </div>
              </div>

              {/* Name + Company */}
              <div className="mb-4">
                <h3 className="text-base font-bold text-white mb-1">{customer.full_name}</h3>
                {customer.company && (
                  <div className="flex items-center gap-1.5 text-white/40 text-xs">
                    <Building2 size={12} />
                    <span>{customer.company}</span>
                  </div>
                )}
              </div>

              {/* Contact info */}
              <div className="space-y-2 mb-5">
                <div className="flex items-center gap-2 text-white/40 text-xs">
                  <Phone size={13} className="text-white/20" />
                  <span dir="ltr" className="font-mono text-white/60">{customer.mobile}</span>
                </div>
                {customer.email && (
                  <div className="flex items-center gap-2 text-white/40 text-xs">
                    <Mail size={13} className="text-white/20" />
                    <span dir="ltr" className="font-mono truncate">{customer.email}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-white/[0.06]">
                <button
                  onClick={() => { setEditCustomer(customer); setShowModal(true); }}
                  className="flex-1 py-2 rounded-xl text-xs font-bold text-white/50 bg-white/[0.04] border border-white/[0.06] hover:text-violet-400 hover:bg-violet-500/10 hover:border-violet-500/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <Edit size={13} />
                  ویرایش
                </button>
                <button
                  onClick={() => handleDelete(customer.id)}
                  className="p-2 rounded-xl text-white/20 bg-white/[0.04] border border-white/[0.06] hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Customers;