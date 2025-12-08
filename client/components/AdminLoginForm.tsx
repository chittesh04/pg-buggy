import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, ArrowLeft } from 'lucide-react';
import { useData } from '../services/DataContext';

interface AdminLoginFormProps {
  onBack: () => void;
  onLogin: () => void;
}

export const AdminLoginForm: React.FC<AdminLoginFormProps> = ({ onBack, onLogin }) => {
  const { login } = useData(); // Get login function from context
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Attempt login with role 'Admin'
    // The login function in DataContext handles the API call and error alerting
    const success = await login(email, password, 'Admin');
    
    setIsLoading(false);
    if (success) {
      onLogin(); // Redirect to dashboard only if auth succeeds
    }
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
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all text-sm text-slate-700 placeholder:text-slate-400"
                placeholder="admin@hostel.com"
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
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors shadow-md mt-2 disabled:opacity-50 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Authenticating...
              </>
            ) : 'Login'}
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
           <p className="text-purple-500 hover:underline cursor-pointer">admin@hostel.com / admin123</p>
        </div>
      </div>

      <button onClick={onBack} className="mt-8 flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium">
        <ArrowLeft size={16} /> Back to Home
      </button>
    </div>
  );
};