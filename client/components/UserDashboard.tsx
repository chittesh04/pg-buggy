import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Wrench, 
  CalendarDays, 
  CreditCard, 
  Bell, 
  Building2, 
  User, 
  LogOut 
} from 'lucide-react';
import { ComplaintsTab } from './ComplaintsTab';
import { ServiceRequestTab } from './ServiceRequestTab';
import { LeaveRequestTab } from './LeaveRequestTab';
import { PaymentTab } from './PaymentTab';
import { AnnouncementsTab } from './AnnouncementsTab';
import { UserDashboardOverview } from './UserDashboardOverview';
import { useData } from '../services/DataContext'; // <--- Import useData

interface UserDashboardProps {
  onLogout: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  
  // 1. Get currentUser from Context
  const { complaints, payments, announcements, currentUser } = useData();

  // 2. Filter badges based on the REAL current user
  const pendingPayments = payments.filter(c => 
  (typeof c.student === 'string' ? c.student === currentUser?.id : (c.student as any)?.id === currentUser?.id) && c.status !== 'Paid').length;
  const activeComplaints = complaints.filter(c => 
  (typeof c.student === 'string' ? c.student === currentUser?.id : (c.student as any)?.id === currentUser?.id) && c.status !== 'Resolved').length;
  const pinnedAnnouncements = announcements.filter(a => a.isPinned).length;

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Complaints', icon: <FileText size={20} />, badge: activeComplaints > 0 ? activeComplaints : null },
    { name: 'Service Request', icon: <Wrench size={20} /> },
    { name: 'Leave Request', icon: <CalendarDays size={20} /> },
    { name: 'Payment', icon: <CreditCard size={20} />, badge: pendingPayments > 0 ? pendingPayments : null, badgeColor: 'bg-red-100 text-red-600' },
    { name: 'Announcements', icon: <Bell size={20} />, badge: pinnedAnnouncements > 0 ? pinnedAnnouncements : null, badgeColor: 'bg-blue-100 text-blue-600' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 w-full font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-20 hidden md:flex shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        {/* Logo */}
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white shadow-lg shadow-blue-200">
            <Building2 size={20} />
          </div>
          <span className="font-bold text-slate-800 tracking-tight">Hostel Portal</span>
        </div>

        {/* User Profile - DYNAMIC DATA NOW */}
        <div className="p-6 bg-gradient-to-b from-blue-50/50 to-transparent border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shrink-0 shadow-md border-2 border-blue-200">
              <User size={20} />
            </div>
            <div className="overflow-hidden">
              {/* Replace John Doe with currentUser.name */}
              <h3 className="font-semibold text-slate-800 truncate text-sm">
                {currentUser?.name || 'User'}
              </h3>
              {/* Replace Room 101 with currentUser.room */}
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">
                Room {currentUser?.room || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                activeTab === item.name
                  ? 'bg-blue-50 text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={activeTab === item.name ? 'text-blue-600' : 'text-slate-400'}>{item.icon}</span>
                {item.name}
              </div>
              {item.badge && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-200 text-slate-600'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-200">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen overflow-hidden bg-slate-50/50">
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between shrink-0 z-10 sticky top-0">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{activeTab}</h1>
            {/* Dynamic Welcome Message */}
            <p className="text-sm text-slate-500 hidden md:block">
              Welcome back, {currentUser?.name.split(' ')[0]}!
            </p>
          </div>
          
          <button 
            onClick={() => setActiveTab('Announcements')}
            className="relative p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
          >
            <Bell size={24} />
            {pinnedAnnouncements > 0 && <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full animate-pulse"></span>}
          </button>
        </header>

        {/* Dashboard Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {activeTab === 'Dashboard' && <UserDashboardOverview onNavigate={setActiveTab} />}
          {activeTab === 'Complaints' && <ComplaintsTab />}
          {activeTab === 'Service Request' && <ServiceRequestTab />}
          {activeTab === 'Leave Request' && <LeaveRequestTab />}
          {activeTab === 'Payment' && <PaymentTab />}
          {activeTab === 'Announcements' && <AnnouncementsTab />}
        </div>
      </main>
    </div>
  );
};