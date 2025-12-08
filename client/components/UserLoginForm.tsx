import React, { useState } from 'react';
import { User, Mail, Lock, ArrowLeft } from 'lucide-react';
import { useData } from '../services/DataContext'; // Import useData

interface UserLoginFormProps {
  onBack: () => void;
  onLogin: () => void;
}

export const UserLoginForm: React.FC<UserLoginFormProps> = ({ onBack, onLogin }) => {
  const { login } = useData(); // Get login function
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Attempt login with role 'User'
    const success = await login(email, password, 'User');
    
    setIsLoading(false);
    if (success) {
      onLogin(); // Redirect to dashboard
    }
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
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm text-slate-700 placeholder:text-slate-400"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors shadow-md mt-2 disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        {/* Footer links... */}
        <div className="text-center space-y-3 text-sm mt-8">
           <p className="text-slate-500">Use <b>john@hostel.com</b> / <b>user123</b></p>
        </div>
      </div>

      <button onClick={onBack} className="mt-8 flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium">
        <ArrowLeft size={16} /> Back to Home
      </button>
    </div>
  );
};