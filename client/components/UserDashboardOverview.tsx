import React from 'react';
import { CreditCard, FileText, Calendar, Bell, ArrowRight, Building2, Wrench, Clock, AlertCircle } from 'lucide-react';
import { useData } from '../services/DataContext';

interface UserDashboardOverviewProps {
  onNavigate: (tab: string) => void;
}

export const UserDashboardOverview: React.FC<UserDashboardOverviewProps> = ({ onNavigate }) => {
  const { payments, complaints, leaveRequests, announcements, serviceRequests } = useData();
  const currentUser = { name: 'John Doe', room: '101' };

  // Stats Calculations
  const totalDue = payments
    .filter(p => p.studentName === currentUser.name && p.status !== 'Paid')
    .reduce((sum, p) => sum + p.amount, 0);
  
  const activeComplaints = complaints
    .filter(c => c.studentName === currentUser.name && c.status !== 'Resolved').length;

  const pendingLeaves = leaveRequests
    .filter(l => l.studentName === currentUser.name && l.status === 'Pending').length;

  const pinnedAnnouncements = announcements.filter(a => a.isPinned).slice(0, 2);

  // Combine recent activities (Complaints + Service Requests + Payments)
  const recentActivity = [
    ...complaints
        .filter(c => c.studentName === currentUser.name)
        .map(c => ({ 
            id: c.id, 
            title: c.title, 
            type: 'Complaint', 
            date: c.date, 
            status: c.status 
        })),
    ...serviceRequests
        .filter(s => s.studentName === currentUser.name)
        .map(s => ({ 
            id: s.id, 
            title: s.serviceType, 
            type: 'Service', 
            date: s.requestedDate, 
            status: s.status 
        })),
    ...payments
        .filter(p => p.studentName === currentUser.name)
        .map(p => ({
            id: p.id,
            title: p.title,
            type: 'Payment',
            date: p.paidOn || p.dueDate,
            status: p.status
        })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 4);

  return (
    <div className="animate-in fade-in duration-500 space-y-6 max-w-6xl mx-auto">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Room Info Card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-200 flex flex-col justify-between h-full min-h-[140px]">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-blue-100 text-xs font-medium uppercase tracking-wider mb-1">My Room</p>
                    <p className="text-3xl font-bold">101</p>
                </div>
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Building2 size={20} className="text-white" />
                </div>
            </div>
            <p className="text-sm text-blue-100 opacity-90 mt-2">Block A, First Floor</p>
        </div>

        {/* Payment Stat */}
        <div 
            onClick={() => onNavigate('Payment')} 
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between h-full min-h-[140px]"
        >
            <div className="flex justify-between items-start">
                <div className="p-2.5 bg-red-50 text-red-600 rounded-xl group-hover:scale-110 transition-transform">
                    <CreditCard size={24} />
                </div>
                <div className="bg-slate-50 p-1.5 rounded-full group-hover:bg-blue-50 transition-colors">
                    <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-600" />
                </div>
            </div>
            <div>
                <p className="text-slate-500 text-sm font-medium">Total Dues</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">₹{totalDue.toLocaleString()}</p>
            </div>
        </div>

        {/* Complaints Stat */}
        <div 
            onClick={() => onNavigate('Complaints')} 
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between h-full min-h-[140px]"
        >
            <div className="flex justify-between items-start">
                <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl group-hover:scale-110 transition-transform">
                    <FileText size={24} />
                </div>
                 <div className="bg-slate-50 p-1.5 rounded-full group-hover:bg-blue-50 transition-colors">
                    <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-600" />
                </div>
            </div>
            <div>
                <p className="text-slate-500 text-sm font-medium">Active Complaints</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{activeComplaints}</p>
            </div>
        </div>

         {/* Leave Stat */}
         <div 
            onClick={() => onNavigate('Leave Request')} 
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between h-full min-h-[140px]"
        >
            <div className="flex justify-between items-start">
                <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl group-hover:scale-110 transition-transform">
                    <Calendar size={24} />
                </div>
                 <div className="bg-slate-50 p-1.5 rounded-full group-hover:bg-blue-50 transition-colors">
                    <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-600" />
                </div>
            </div>
            <div>
                <p className="text-slate-500 text-sm font-medium">Pending Leaves</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{pendingLeaves}</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity Column */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                      <Clock size={20} className="text-slate-400"/> Recent Requests
                  </h3>
                  <button 
                    onClick={() => onNavigate('Complaints')}
                    className="text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors"
                  >
                    View All
                  </button>
              </div>
              
              <div className="space-y-3">
                  {recentActivity.length > 0 ? recentActivity.map((item) => (
                      <div key={item.id + item.type} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100/50">
                          <div className="flex items-center gap-4">
                              <div className={`p-2.5 rounded-full shrink-0 ${
                                  item.type === 'Complaint' ? 'bg-orange-100 text-orange-600' : 
                                  item.type === 'Payment' ? 'bg-green-100 text-green-600' :
                                  'bg-blue-100 text-blue-600'
                              }`}>
                                  {item.type === 'Complaint' ? <AlertCircle size={18}/> : 
                                   item.type === 'Payment' ? <CreditCard size={18}/> :
                                   <Wrench size={18}/>}
                              </div>
                              <div>
                                  <p className="font-semibold text-slate-800 text-sm">{item.title}</p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-xs text-slate-500">{item.type}</span>
                                    <span className="text-slate-300 text-[10px]">•</span>
                                    <span className="text-xs text-slate-500">{item.date}</span>
                                  </div>
                              </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${
                              item.status === 'Resolved' || item.status === 'Approved' || item.status === 'Completed' || item.status === 'Paid'
                              ? 'bg-green-100 text-green-700' 
                              : item.status === 'Rejected' || item.status === 'Overdue' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                              {item.status}
                          </span>
                      </div>
                  )) : (
                      <div className="flex flex-col items-center justify-center py-10 text-slate-400 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                          <FileText size={32} className="mb-2 opacity-50"/>
                          <p className="text-sm">No recent activity found</p>
                      </div>
                  )}
              </div>
          </div>

          {/* Notices Column */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col">
               <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                        <Bell size={20} className="text-slate-400"/> Notice Board
                    </h3>
               </div>
              
              <div className="space-y-4 flex-1">
                  {pinnedAnnouncements.length > 0 ? pinnedAnnouncements.map(ann => (
                       <div key={ann.id} className="p-4 rounded-xl bg-gradient-to-br from-blue-50/50 to-slate-50 border border-blue-100 hover:border-blue-200 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                    ann.type === 'urgent' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                                }`}>
                                    {ann.type}
                                </span>
                                <span className="text-[10px] text-slate-400 font-medium">{ann.date}</span>
                            </div>
                            <h4 className="font-semibold text-slate-800 text-sm mb-1 leading-tight">{ann.title}</h4>
                            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed opacity-80">{ann.content}</p>
                       </div>
                  )) : (
                      <p className="text-sm text-slate-500 text-center py-4">No new notices</p>
                  )}
              </div>
              
              <button 
                onClick={() => onNavigate('Announcements')} 
                className="w-full mt-4 py-2.5 flex items-center justify-center gap-2 text-sm text-slate-600 font-medium bg-slate-50 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
              >
                  View All Notices <ArrowRight size={16}/>
              </button>
          </div>
      </div>
    </div>
  );
};