import React from 'react';
import { Building2 } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-white border-b border-slate-200 py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg text-white">
          <Building2 size={24} />
        </div>
        <h1 className="text-xl md:text-2xl font-semibold text-slate-800 tracking-tight">
          Hostel Management System
        </h1>
      </div>

    </header>
  );
};