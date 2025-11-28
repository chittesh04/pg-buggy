import React from 'react';
import { User, Mail, Lock, ArrowLeft } from 'lucide-react';

interface UserLoginFormProps {
  onBack: () => void;
  onLogin: () => void;
}

export const UserLoginForm: React.FC<UserLoginFormProps> = ({ onBack, onLogin }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-lg shadow-[0_4px_20px_-5px_rgba(0,0,0,0.1)] border border-slate-100 w-full max-w-[420px]">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-100 p-3 rounded-full mb-4">
             <User className="text-blue-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">User Login</h2>
          <p className="text-blue-500 text-sm mt-1">Enter your credentials to continue</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-blue-600 mb-1.5">Email or User ID</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm text-slate-700 placeholder:text-slate-400"
                placeholder="Enter your email or ID"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-600 mb-1.5">Password</label>
            <div className="relative">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-slate-400" />
              </div>
              <input
                type="password"
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm text-slate-700 placeholder:text-slate-400"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm mt-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-slate-600">Remember me</span>
            </label>
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Forgot Password?</a>
          </div>

          <button type="submit" className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors shadow-md mt-2">
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
           <p className="text-slate-500">Don't have an account? <a href="#" className="text-blue-600 font-medium hover:underline">Contact admin</a></p>
           <p className="text-slate-500">Having trouble logging in?</p>
           <p className="text-slate-500">Need Help? <a href="#" className="text-blue-600 font-medium hover:underline">Contact support</a></p>
           <p className="text-blue-500 hover:underline cursor-pointer">support@hostel.com</p>
        </div>
      </div>

      <button onClick={onBack} className="mt-8 flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium">
        <ArrowLeft size={16} /> Back to Home
      </button>
    </div>
  );
};