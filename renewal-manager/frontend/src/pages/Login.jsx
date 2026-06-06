// Author: hoseinmos
import React, { useState } from 'react';
import { User, Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // درخواست دریافت توکن بدون استفاده از api.js (برای جلوگیری از لوپ)
      const response = await axios.post('/api/v1/token/', {
        username,
        password
      });
      
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      
      // هدایت به داشبورد
      navigate('/');
    } catch (err) {
      setError('نام کاربری یا رمز عبور اشتباه است.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center p-4">
      <div className="bg-[#13151f] rounded-2xl shadow-2xl shadow-black/80 w-full max-w-sm border border-white/[0.08] overflow-hidden">
        
        <div className="p-8 text-center border-b border-white/[0.06]">
          <div className="w-16 h-16 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-violet-900/30 mb-4">
            <Lock className="text-white" size={28} />
          </div>
          <h2 className="text-xl font-bold text-white">ورود به سیستم</h2>
          <p className="text-sm text-white/40 mt-2">لطفاً اطلاعات کاربری خود را وارد کنید</p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-5">
          {error && (
            <div className="p-3 bg-red-500/10 text-red-400 text-xs rounded-xl border border-red-500/20 text-center">
              {error}
            </div>
          )}

          <div>
            <div className="relative">
              <input 
                type="text" 
                required 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                placeholder="نام کاربری"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-white/20 outline-none focus:border-violet-500/50 transition-all" 
              />
              <User size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20" />
            </div>
          </div>

          <div>
            <div className="relative">
              <input 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="رمز عبور"
                dir="ltr"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 pl-11 text-sm text-white placeholder-white/20 outline-none focus:border-violet-500/50 transition-all font-mono text-left" 
              />
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 mt-2 flex justify-center items-center gap-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 transition-all shadow-lg shadow-violet-900/30"
          >
            {loading ? 'در حال بررسی...' : 'ورود'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

      </div>
    </div>
  );
}

export default Login;