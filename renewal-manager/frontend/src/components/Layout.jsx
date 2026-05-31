import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, BellRing, Settings } from 'lucide-react';

function Layout() {
  const navItems = [
    { path: '/', label: 'سرویس‌ها', icon: <LayoutDashboard size={18} /> },
    { path: '/customers', label: 'مشتریان فعال', icon: <Users size={18} /> },
    { path: '/alerts', label: 'تاریخچه هشدارها', icon: <BellRing size={18} /> },
    { path: '/settings', label: 'تنظیمات درگاه', icon: <Settings size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-[#f4f7f9] text-gray-800 font-sans">
      {/* هدر اصلی */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* بخش لوگو و عنوان */}
          <div className="flex items-center gap-3">
            <div className="bg-purple-600 text-white rounded-lg font-bold text-xl flex items-center justify-center w-10 h-10 shadow-md">
              رپ
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">سیستم مدیریت تمدیدها</h1>
              <p className="text-xs text-gray-500">مدیریت سرآمد مشتریان و زیرساخت‌ها</p>
            </div>
          </div>

          {/* تب‌های ناوبری */}
          <nav className="flex gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-sm'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 border border-transparent'
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      {/* محتوای متغیر صفحات */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;