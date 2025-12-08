import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, ArrowLeft, Eye, EyeOff, AlertCircle, X } from 'lucide-react';
import { useData } from '../services/DataContext';

interface UserLoginFormProps {
  onBack: () => void;
  onLogin: () => void;
}

export const UserLoginForm: React.FC<UserLoginFormProps> = ({ onBack, onLogin }) => {
  const { login } = useData();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // State for Modern Error Toast
  const [error, setError] = useState<string | null>(null);

  // Load saved credentials on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('user_remember_email');
    const savedPass = localStorage.getItem('user_remember_pass');
    if (savedEmail && savedPass) {
      setEmail(savedEmail);
      setPassword(savedPass);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null); // Clear previous errors

    // Handle Remember Me Logic
    if (rememberMe) {
      localStorage.setItem('user_remember_email', email);
      localStorage.setItem('user_remember_pass', password);
    } else {
      localStorage.removeItem('user_remember_email');
      localStorage.removeItem('user_remember_pass');
    }
    
    try {
      // Attempt login
      const success = await login(email, password, 'User');
      
      if (success) {
        onLogin();
      } else {
        // Show Modern Error
        setError("Invalid credentials. Please check your email and password.");
        // Auto-hide after 4 seconds
        setTimeout(() => setError(null), 4000);
      }
    } catch (err) {
      setError("Connection error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-500 relative">
      
      {/* --- Modern Floating Error Toast --- */}
      {error && (
        <div className="fixed top-5 right-5 z-50 bg-white border-l-4 border-red-500 shadow-xl rounded-md p-4 flex items-start gap-3 max-w-sm animate-in slide-in-from-top-5 fade-in duration-300">
          <AlertCircle className="text-red-500 shrink-0" size={20} />
          <div>
            <h4 className="font-semibold text-red-600 text-sm">Login Failed</h4>
            <p className="text-slate-600 text-xs mt-0.5">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-slate-400 hover:text-slate-600 ml-auto">
            <X size={16} />
          </button>
        </div>
      )}

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
            <label className="block text-sm font-medium text-blue-600 mb-1.5">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-slate-400" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm text-slate-700 placeholder:text-slate-400"
                placeholder="john@hostel.com"
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
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm text-slate-700 placeholder:text-slate-400"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-blue-600 cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between text-sm mt-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
              />
              <span className="text-slate-600">Remember me</span>
            </label>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors shadow-md mt-2 disabled:opacity-50 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </>
            ) : 'Login'}
          </button>
        </form>
        
        <div className="text-center space-y-3 text-sm mt-8">
        </div>
      </div>

      <button onClick={onBack} className="mt-8 flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium">
        <ArrowLeft size={16} /> Back to Home
      </button>
    </div>
  );
};