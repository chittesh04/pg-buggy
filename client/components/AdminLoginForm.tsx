import React from 'react';
import { ShieldCheck, Mail, Lock, ArrowLeft } from 'lucide-react';

interface AdminLoginFormProps {
  onBack: () => void;
  onLogin: () => void;
}

export const AdminLoginForm: React.FC<AdminLoginFormProps> = ({ onBack, onLogin }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, redirect to dashboard (or admin specific dashboard in future)
    onLogin();
  };

  return (
    <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-lg shadow-[0_4px_20px_-5px_rgba(0,0,0,0.1)] border border-slate-100 w-full max-w-[420px]">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-purple-100 p-3 rounded-full mb-4">
             <ShieldCheck className="text-purple-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Admin Login</h2>
          <p className="text-purple-500 text-sm mt-1">Enter your credentials to continue</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-purple-600 mb-1.5">Admin Email or ID</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all text-sm text-slate-700 placeholder:text-slate-400"
                placeholder="Enter your admin email or ID"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-600 mb-1.5">Password</label>
            <div className="relative">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-slate-400" />
              </div>
              <input
                type="password"
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all text-sm text-slate-700 placeholder:text-slate-400"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm mt-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500" />
              <span className="text-slate-600">Remember me</span>
            </label>
            <a href="#" className="text-purple-600 hover:text-purple-700 font-medium">Forgot Password?</a>
          </div>

          <button type="submit" className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors shadow-md mt-2">
            Login
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-slate-400 uppercase tracking-wider">Or</span>
          </div>
        </div>

        <div className="text-center space-y-3 text-sm">
           <p className="text-slate-500">Need admin access? <a href="#" className="text-purple-600 font-medium hover:underline">Contact super admin</a></p>
           <p className="text-slate-500">Having trouble logging in?</p>
           <p className="text-slate-500">Need Help? <a href="#" className="text-purple-600 font-medium hover:underline">Contact support</a></p>
           <p className="text-purple-500 hover:underline cursor-pointer">admin@hostel.com</p>
        </div>
      </div>

      <button onClick={onBack} className="mt-8 flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium">
        <ArrowLeft size={16} /> Back to Home
      </button>
    </div>
  );
};