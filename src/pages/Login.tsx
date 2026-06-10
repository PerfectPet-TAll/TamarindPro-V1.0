import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Lock, User as UserIcon, Loader2, Package, Warehouse, ArrowRight, Phone, Mail, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('login', undefined, { username, password });
      
      if (response.status === 'success' && response.data) {
        login(response.data);
        navigate(from, { replace: true });
      } else {
        setError(response.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full font-mono bg-slate-900 overflow-hidden">
      {/* Global Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url('https://i.etsystatic.com/40771527/r/il/7f8988/5706371669/il_fullxfull.5706371669_2ivr.jpg')`
        }}
      />

      <div className="relative z-10 flex w-full min-h-screen">
        {/* Left Panel - Dark Overlay */}
        <div className="hidden w-1/2 flex-col justify-between bg-[#111f42]/40 p-12 lg:flex backdrop-blur-sm border-r border-white/10">
          
          <div className="flex flex-col">
            {/* Top Logo */}
            <div className="flex items-center gap-4 text-white mb-16">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#E3624A] to-slate-800 text-white shadow-lg border border-white/10">
                <Warehouse size={24} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 text-xl font-black tracking-widest cursor-pointer hover:opacity-80 transition-opacity">
                  <span className="text-white">WMS</span>
                  <span className="text-[#E3624A] underline decoration-2 underline-offset-4">MASTER</span>
                </div>
                <span className="text-[9px] font-black text-slate-500 tracking-[0.2em] uppercase mt-1">
                  Warehouse Core
                </span>
              </div>
            </div>

            {/* Main Branding */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-[75px] font-black tracking-widest text-white leading-none mb-4 shadow-black/20 drop-shadow-xl">
                TAMARIND PRO
              </h1>
              <h2 className="text-[26px] font-bold text-white mb-8 tracking-wide drop-shadow-md">
                Sales & Export Management System
              </h2>
              <p className="max-w-md text-[15px] leading-relaxed text-white/80 font-medium">
                Streamline your inventory, optimize logistics,<br />
                and take full control of your supply chain<br />
                with our advanced management platform.<br />
              </p>

              <div className="mt-12 mb-8 h-px w-[85%] bg-white/20" />

              <div className="grid grid-cols-2 gap-8 max-w-sm">
                <div>
                  <div className="text-[40px] font-black text-[#E3624A] tracking-tighter leading-none mb-2 drop-shadow-lg">100%</div>
                  <div className="text-[13px] font-bold text-white/60 tracking-wider">Compliance Rate</div>
                </div>
                <div>
                  <div className="text-[40px] font-black text-[#E3624A] tracking-tighter leading-none mb-2 drop-shadow-lg">24/7</div>
                  <div className="text-[13px] font-bold text-white/60 tracking-wider">Real-time Analytics</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <div className="flex w-full items-end justify-between mt-auto">
            <div className="text-[13px] text-white/70 space-y-1">
              <div className="font-bold text-white text-[16px] mb-1">T All Intelligence</div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-white/90">Smart Solutions</span>
                <span className="text-white/30">|</span>
                <span className="flex items-center gap-1.5"><Phone size={14} className="text-white/70" /> 082-5695654</span>
                <span className="text-white/30">|</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail size={14} className="text-white/70" /> tallintelligence.ho@gmail.com
              </div>
              <div className="mt-3 pt-1 text-[10px] font-bold text-white/40 tracking-[0.1em]">
                &copy; 2026 ALL RIGHTS RESERVED
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-3xl border border-white/20 bg-[#2a2d45]/40 backdrop-blur-md p-4 shadow-2xl">
              <img 
                src="https://drive.google.com/thumbnail?id=1Z_fRbN9S4aA7OkHb3mlim_t60wIT4huY&sz=w400" 
                alt="Developer" 
                className="h-12 w-12 rounded-full object-cover border-2 border-[#E3624A]/60 shadow-lg"
              />
              <div className="flex flex-col pr-2">
                <span className="text-[14px] font-bold text-white tracking-wide">T-DCC Developer</span>
                <span className="text-[12px] font-bold text-[#E3624A] mt-0.5">Lead Developer</span>
                <span className="text-[10px] text-white/40 mt-1">tallintelligence.dcc@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-[460px] rounded-[24px] bg-white/50 backdrop-blur-xl border-2 border-white/60 p-8 sm:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.15)]"
          >
            <div className="mb-10">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#E3624A] to-slate-800 border border-white/10 text-white mb-6 lg:hidden shadow-lg">
                <Warehouse size={24} strokeWidth={2.5} />
              </div>
              <h2 className="text-[32px] font-bold text-[#1a2035] mb-3 tracking-wide">
                Welcome back
              </h2>
              <p className="text-[14px] font-medium text-[#4a5568] leading-relaxed pr-4">
                Please enter your credentials to access the system.
              </p>
            </div>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div>
                  <label className="block text-[13px] font-bold text-[#1a2035] mb-2.5">
                    Username
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500/80">
                      <UserIcon size={18} />
                    </div>
                    <input
                      type="text"
                      required
                      className="block w-full bg-white/40 border border-white/60 rounded-xl py-3.5 pl-12 pr-4 text-[14px] font-bold text-slate-800 placeholder:text-slate-500/60 focus:bg-white/70 focus:border-white focus:ring-2 focus:ring-white/50 outline-none transition-all shadow-inner"
                      placeholder="admin"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-[#1a2035] mb-2.5">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500/80">
                      <Lock size={18} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      className="block w-full bg-white/40 border border-white/60 rounded-xl py-3.5 pl-12 pr-12 text-[14px] font-bold text-slate-800 placeholder:text-slate-500/60 focus:bg-white/70 focus:border-white focus:ring-2 focus:ring-white/50 outline-none transition-all shadow-inner"
                      placeholder="******"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500/80 hover:text-slate-800 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-[13px] font-bold text-red-600 text-center backdrop-blur-sm"
                >
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#111f42] text-white mt-8 py-4 px-6 rounded-xl text-[14px] font-bold flex items-center justify-center gap-3 shadow-xl hover:bg-[#111f42]/90 transition-all disabled:opacity-70 group"
              >
                {isLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    Sign in to account
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
              
              <div className="mt-8 rounded-xl bg-white/60 p-5 text-center shadow-inner border border-white/60 backdrop-blur-sm">
                <div className="font-bold text-[#1a2035] text-[13px] mb-1.5">Demo Credentials</div>
                <div className="text-[13px] font-semibold text-slate-700">User: admin / Pass: 123456</div>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

