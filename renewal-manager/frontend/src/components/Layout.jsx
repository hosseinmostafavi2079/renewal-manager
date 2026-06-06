import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, BellRing, Settings, Menu, X, ChevronRight } from 'lucide-react';

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'داشبورد سرویس‌ها', icon: <LayoutDashboard size={18} />, desc: 'مدیریت و تمدید' },
    { path: '/customers', label: 'مشتریان', icon: <Users size={18} />, desc: 'پروفایل مشتریان' },
    { path: '/alerts', label: 'هشدارها', icon: <BellRing size={18} />, desc: 'تاریخچه پیام‌ها' },
    { path: '/settings', label: 'تنظیمات', icon: <Settings size={18} />, desc: 'درگاه و پیامک' },
  ];

  return (
    <div className="min-h-screen bg-[#0f1117] text-white flex" style={{ fontFamily: "'Vazirmatn', Tahoma, sans-serif" }}>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 right-0 h-full w-72 z-50 flex flex-col
        bg-[#13151f] border-l border-white/[0.06]
        transform transition-transform duration-300 ease-out
        lg:relative lg:translate-x-0 lg:flex
        ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo area */}
        <div className="p-6 border-b border-white/[0.06]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-900/40">
                <span className="text-white font-black text-sm">رپ</span>
              </div>
              <div>
                <h1 className="text-sm font-bold text-white leading-tight">سیستم تمدیدها</h1>
                <p className="text-[10px] text-white/30 mt-0.5">Renewal Manager v2</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white/40 hover:text-white p-1"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest px-3 mb-4">منوی اصلی</p>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 relative ${
                  isActive
                    ? 'bg-violet-500/10 text-violet-400'
                    : 'text-white/40 hover:text-white/80 hover:bg-white/[0.04]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-violet-400 rounded-full" />
                  )}
                  <div className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-violet-500/20 text-violet-400' : 'bg-white/[0.05] group-hover:bg-white/10'}`}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold leading-tight">{item.label}</p>
                    <p className="text-[10px] opacity-50 mt-0.5">{item.desc}</p>
                  </div>
                  <ChevronRight size={14} className={`mr-auto opacity-0 group-hover:opacity-50 transition-opacity ${isActive ? 'opacity-50' : ''}`} />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/[0.06]">
          <div className="bg-gradient-to-br from-violet-900/30 to-indigo-900/20 rounded-xl p-3 border border-violet-500/10">
            <p className="text-[10px] text-violet-300/70 font-bold mb-1">وضعیت سیستم</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50 animate-pulse" />
              <p className="text-xs text-white/50">متصل به بک‌اند</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar - mobile only */}
        <header className="lg:hidden flex items-center justify-between px-4 py-4 bg-[#13151f] border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-black text-xs">رپ</span>
            </div>
            <span className="text-sm font-bold text-white">سیستم تمدیدها</span>
          </div>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-white/50 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
          >
            <Menu size={20} />
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;