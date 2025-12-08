import React from 'react';
import { Feature } from '../types';

export const FeatureCard: React.FC<Feature> = ({ icon, title, description, subDescription }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col items-start hover:border-blue-100 transition-colors">
      <div className="bg-blue-50 text-blue-600 p-3 rounded-lg mb-4">
        {icon}
      </div>
      <h4 className="font-semibold text-slate-800 mb-1">{title}</h4>
      <p className="text-slate-500 text-sm">{description}</p>
      <p className="text-slate-400 text-xs mt-1">{subDescription}</p>
    </div>
  );
};