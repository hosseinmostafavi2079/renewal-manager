import React, { useEffect, useState } from 'react';
import { BellRing, CheckCircle2, XCircle, Smartphone, MessageCircle, Filter } from 'lucide-react';
import api from '../api';

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('services/alerts/')
      .then(res => { setAlerts(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? alerts : alerts.filter(a =>
    filter === 'success' ? a.is_successful : !a.is_successful
  );

  const successCount = alerts.filter(a => a.is_successful).length;
  const failCount = alerts.length - successCount;

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-white">تاریخچه هشدارها</h2>
        <p className="text-white/30 text-sm mt-1">هشدارهای ارسال‌شده از طریق پیامک و پیام‌رسان بله</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#13151f] rounded-2xl border border-white/[0.06] p-4">
          <p className="text-white/30 text-xs mb-1">کل هشدارها</p>
          <p className="text-2xl font-black text-white">{alerts.length}</p>
        </div>
        <div className="bg-[#13151f] rounded-2xl border border-emerald-500/10 p-4">
          <p className="text-white/30 text-xs mb-1">ارسال موفق</p>
          <p className="text-2xl font-black text-emerald-400">{successCount}</p>
        </div>
        <div className="bg-[#13151f] rounded-2xl border border-red-500/10 p-4">
          <p className="text-white/30 text-xs mb-1">ارسال ناموفق</p>
          <p className="text-2xl font-black text-red-400">{failCount}</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 p-1 bg-white/[0.03] rounded-xl border border-white/[0.06] w-fit">
        {[
          { key: 'all', label: 'همه' },
          { key: 'success', label: 'موفق' },
          { key: 'failed', label: 'ناموفق' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              filter === tab.key
                ? 'bg-violet-500 text-white shadow-lg shadow-violet-900/30'
                : 'text-white/30 hover:text-white/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
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
          <BellRing size={32} className="mx-auto text-white/10 mb-3" />
          <p className="text-white/20 text-sm">هیچ هشداری یافت نشد</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(alert => (
            <div
              key={alert.id}
              className={`bg-[#13151f] rounded-2xl border p-4 flex gap-4 ${
                alert.is_successful
                  ? 'border-white/[0.06] hover:border-emerald-500/20'
                  : 'border-red-500/10 hover:border-red-500/20'
              } transition-all`}
            >
              {/* Icon */}
              <div className={`p-3 rounded-xl shrink-0 ${
                alert.is_successful
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'bg-red-500/10 text-red-400'
              }`}>
                {alert.alert_type === 'sms' ? <Smartphone size={20} /> : <MessageCircle size={20} />}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-sm font-bold text-white">
                    {alert.alert_type === 'sms' ? 'پیامک' : 'پیام‌رسان بله'}
                  </span>
                  <span className="text-white/20 text-xs">·</span>
                  <span className="text-white/30 text-xs">سرویس #{alert.service}</span>
                  <div className={`flex items-center gap-1 text-[11px] font-bold mr-auto ${
                    alert.is_successful ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {alert.is_successful
                      ? <><CheckCircle2 size={12} /> موفق</>
                      : <><XCircle size={12} /> ناموفق</>
                    }
                  </div>
                </div>

                <p className="text-white/40 text-xs leading-relaxed bg-white/[0.03] rounded-lg p-3 border border-white/[0.04]">
                  {alert.message}
                </p>

                <p className="text-white/20 text-[10px] font-mono mt-2" dir="ltr">
                  {new Date(alert.sent_at).toLocaleString('fa-IR')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Alerts;