import React from 'react';
import { LoginTypeProps } from '../types';
import { ArrowRight } from 'lucide-react';

export const LoginCard: React.FC<LoginTypeProps> = ({ 
  role, 
  icon, 
  description, 
  buttonColor, 
  accentColor,
  onClick 
}) => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_-5px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col items-center text-center w-full max-w-md hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.15)] transition-all duration-300">
      <div className={`p-4 rounded-full mb-6 ${accentColor} bg-opacity-10`}>
        {icon}
      </div>
      
      <h3 className="text-xl font-semibold text-slate-800 mb-2">
        {role} Login
      </h3>
      
      <p className="text-slate-500 text-sm mb-2">
        {role === 'User' ? 'Access your Dashboard' : 'Manage hostel operations'}
      </p>
      <p className="text-slate-400 text-xs mb-8">
        {description}
      </p>

      <button 
        onClick={onClick}
        className={`w-full py-3 px-6 rounded-lg text-white font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity ${buttonColor}`}
      >
        Login as {role} <ArrowRight size={18} />
      </button>
    </div>
  );
};