import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  FileText,
  Wrench,
  CalendarDays,
  CreditCard,
  Bell,
  Settings,
  ShieldCheck,
  LogOut,
  Search,
  Filter,
  MoreVertical,
  TrendingUp,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  Mail,
  Phone
} from 'lucide-react';
import { useMockData } from '../services/MockDataContext';

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const { 
    users, complaints, serviceRequests, leaveRequests, payments, announcements, recentActivity,
    updateComplaintStatus, updateServiceRequestStatus, updateLeaveRequestStatus, updatePaymentStatus,
    addUser, deleteUser, addAnnouncement
  } = useMockData();

  const menuItems = [
    { name: 'Overview', icon: <LayoutDashboard size={20} /> },
    { name: 'Users', icon: <Users size={20} /> },
    { name: 'Complaints', icon: <FileText size={20} /> },
    { name: 'Service Requests', icon: <Wrench size={20} /> },
    { name: 'Leave Requests', icon: <CalendarDays size={20} /> },
    { name: 'Payments', icon: <CreditCard size={20} /> },
    { name: 'Announcements', icon: <Bell size={20} /> },
    { name: 'Settings', icon: <Settings size={20} /> },
  ];

  // Helper to calculate time ago
  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " mins ago";
    return "Just now";
  };

  // --- Sub Components ---

  const Overview = () => {
    const pendingPaymentsTotal = payments.filter(p => p.status === 'Pending' || p.status === 'Overdue').reduce((sum, p) => sum + p.amount, 0);
    const occupancyRate = Math.round((users.filter(u => u.status === 'Active').length / 50) * 100); // Assuming 50 rooms capacity

    const stats = [
      { title: 'Total Users', value: users.length, change: '+2', icon: <Users size={20} />, color: 'text-blue-600 bg-blue-100' },
      { title: 'Active Complaints', value: complaints.filter(c => c.status !== 'Resolved').length, change: complaints.filter(c => c.status !== 'Resolved').length > 5 ? '+5' : 'Normal', icon: <FileText size={20} />, color: 'text-red-600 bg-red-100' },
      { title: 'Service Requests', value: serviceRequests.filter(s => s.status === 'Pending').length, change: '+1', icon: <Wrench size={20} />, color: 'text-green-600 bg-green-100' },
      { title: 'Leave Requests', value: leaveRequests.filter(l => l.status === 'Pending').length, change: 'Review', icon: <CalendarDays size={20} />, color: 'text-purple-600 bg-purple-100' },
      { title: 'Pending Revenue', value: `₹${pendingPaymentsTotal.toLocaleString()}`, change: 'Due Soon', icon: <CreditCard size={20} />, color: 'text-yellow-600 bg-yellow-100' },
      { title: 'Occupancy Rate', value: `${occupancyRate}%`, change: '+2%', icon: <TrendingUp size={20} />, color: 'text-indigo-600 bg-indigo-100' },
    ];

    const urgentIssues = complaints.filter(c => c.priority === 'High' && c.status !== 'Resolved');

    return (
      <div className="animate-in fade-in duration-500">
        <h2 className="text-2xl font-bold text-slate-800 mb-1">Dashboard Overview</h2>
        <p className="text-slate-500 text-sm mb-8">Monitor hostel operations and key metrics</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  {stat.icon}
                </div>
                <span className={`text-xs font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-slate-500'}`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-slate-500 text-sm">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {/* Real-time Recent Activity Feed */}
           <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm h-96 overflow-y-auto">
              <h3 className="font-semibold text-slate-800 mb-4 sticky top-0 bg-white z-10 pb-2 border-b border-slate-50">Recent Activity</h3>
              <div className="space-y-6">
                  {recentActivity.length > 0 ? recentActivity.map(activity => (
                    <div key={activity.id} className="flex gap-4 items-start">
                      <div className={`p-2 rounded-full h-fit shrink-0 ${
                          activity.type === 'complaint' ? 'bg-red-50 text-red-500' : 
                          activity.type === 'payment' ? 'bg-green-50 text-green-500' : 
                          activity.type === 'request' ? 'bg-blue-50 text-blue-500' : 'bg-slate-100 text-slate-500'
                      }`}>
                          {activity.type === 'complaint' ? <FileText size={14}/> : 
                           activity.type === 'payment' ? <CreditCard size={14}/> : 
                           activity.type === 'request' ? <Wrench size={14}/> : <Bell size={14}/>}
                      </div>
                      <div>
                        <p className="text-sm text-slate-800">
                            <span className="font-medium">{activity.user}</span> {activity.action}
                        </p>
                        <p className="text-xs text-slate-400">{timeAgo(activity.time)}</p>
                      </div>
                    </div>
                  )) : (
                      <p className="text-slate-400 text-sm text-center py-10">No recent activity.</p>
                  )}
              </div>
           </div>

           {/* Urgent Issues */}
           <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm h-96 overflow-y-auto">
              <h3 className="font-semibold text-slate-800 mb-4 text-red-600 flex items-center gap-2 sticky top-0 bg-white z-10 pb-2 border-b border-slate-50">
                <ShieldCheck size={18}/> Urgent Issues
              </h3>
              <div className="space-y-4">
                {urgentIssues.length > 0 ? urgentIssues.map(issue => (
                  <div key={issue.id} className="bg-red-50 border border-red-100 p-4 rounded-lg hover:bg-red-100 transition-colors cursor-pointer">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-semibold text-slate-800">{issue.title}</h4>
                      <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full uppercase font-bold">High</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 mb-1">{issue.description}</p>
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-xs font-medium text-red-800 bg-red-200/50 px-2 py-0.5 rounded">Room: {issue.room}</span>
                        <span className="text-[10px] text-red-400">{issue.studentName}</span>
                    </div>
                  </div>
                )) : <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                        <CheckCircle size={32} className="mb-2 text-green-400 opacity-50"/>
                        <p className="text-sm">No urgent issues pending.</p>
                     </div>}
              </div>
           </div>
        </div>
      </div>
    );
  };

  const UsersList = () => {
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', room: '', contact: '' });
    const [searchTerm, setSearchTerm] = useState('');

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        addUser({
            id: Date.now().toString(),
            name: newUser.name,
            email: newUser.email,
            room: newUser.room,
            contact: newUser.contact,
            joinDate: new Date().toISOString().split('T')[0],
            status: 'Active'
        });
        setIsAddUserOpen(false);
        setNewUser({ name: '', email: '', room: '', contact: '' });
    };

    const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.room.includes(searchTerm));

    return (
      <div className="animate-in fade-in duration-500">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Manage Users</h2>
            <p className="text-slate-500 text-sm mt-1">View and manage hostel residents</p>
          </div>
          <button onClick={() => setIsAddUserOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-sm">
            <Plus size={18} /> Add User
          </button>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by name or room..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 transition-all"
            />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Contact</th>
                  <th className="px-6 py-3">Room</th>
                  <th className="px-6 py-3">Join Date</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.length > 0 ? filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-xs">
                             {user.name.charAt(0)}
                         </div>
                         <div>
                            <p className="font-medium text-slate-800">{user.name}</p>
                            <p className="text-xs text-slate-500">ID: {user.id}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-slate-600">
                            <Mail size={12} className="text-slate-400"/> {user.email}
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-600">
                            <Phone size={12} className="text-slate-400"/> {user.contact}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{user.room}</td>
                    <td className="px-6 py-4 text-slate-600">{user.joinDate}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => deleteUser(user.id)} className="text-slate-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-full">
                          <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                )) : (
                    <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                            No users found matching "{searchTerm}"
                        </td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add User Modal */}
        {isAddUserOpen && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <h3 className="font-semibold text-slate-800">Add New Resident</h3>
                        <button onClick={() => setIsAddUserOpen(false)} className="text-slate-400 hover:text-slate-600"><XCircle size={20}/></button>
                    </div>
                    <form onSubmit={handleAddUser} className="p-6 space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                            <input required type="text" className="w-full border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-purple-500" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
                            <input required type="email" className="w-full border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-purple-500" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">Room Number</label>
                                <input required type="text" className="w-full border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-purple-500" value={newUser.room} onChange={e => setNewUser({...newUser, room: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">Contact Number</label>
                                <input required type="text" className="w-full border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-purple-500" value={newUser.contact} onChange={e => setNewUser({...newUser, contact: e.target.value})} />
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-purple-700 mt-2">Add User</button>
                    </form>
                </div>
            </div>
        )}
      </div>
    );
  };

  const ComplaintsList = () => (
    <div className="animate-in fade-in duration-500">
       <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Manage Complaints</h2>
          <p className="text-slate-500 text-sm mt-1">View and resolve user complaints</p>
       </div>

       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
         <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm"><p className="text-xs text-slate-500">Total</p><p className="text-xl font-bold text-slate-800">{complaints.length}</p></div>
         <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm"><p className="text-xs text-slate-500">Pending</p><p className="text-xl font-bold text-yellow-600">{complaints.filter(c => c.status === 'Pending').length}</p></div>
         <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm"><p className="text-xs text-slate-500">In Progress</p><p className="text-xl font-bold text-blue-600">{complaints.filter(c => c.status === 'In-progress').length}</p></div>
         <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm"><p className="text-xs text-slate-500">Resolved</p><p className="text-xl font-bold text-green-600">{complaints.filter(c => c.status === 'Resolved').length}</p></div>
       </div>

       <div className="space-y-4">
         {complaints.map(complaint => (
           <div key={complaint.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
             <div className="flex flex-col md:flex-row justify-between items-start mb-2 gap-3 md:gap-0">
               <div className="flex items-center gap-3">
                 <h3 className="font-semibold text-slate-800">{complaint.title}</h3>
                 <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${complaint.priority === 'High' ? 'bg-red-100 text-red-600' : complaint.priority === 'Medium' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                   {complaint.priority}
                 </span>
               </div>
               <div className="flex items-center gap-2">
                 <select 
                    value={complaint.status} 
                    onChange={(e) => updateComplaintStatus(complaint.id, e.target.value as any)}
                    className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-slate-50 outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer hover:bg-white"
                 >
                    <option value="Pending">Pending</option>
                    <option value="In-progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                 </select>
                 <span className={`px-2 py-1 rounded text-xs font-medium hidden md:inline-block ${
                   complaint.status === 'Resolved' ? 'bg-green-100 text-green-700' : 
                   complaint.status === 'In-progress' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                 }`}>
                   {complaint.status}
                 </span>
               </div>
             </div>
             <p className="text-slate-600 text-sm mb-3">{complaint.description}</p>
             <div className="flex items-center gap-4 text-xs text-slate-500 bg-slate-50 w-fit px-3 py-1.5 rounded-lg">
               <span className="font-medium text-slate-700">{complaint.studentName}</span>
               <span className="text-slate-300">|</span>
               <span>Room {complaint.room}</span>
               <span className="text-slate-300">|</span>
               <span>{complaint.category}</span>
               <span className="text-slate-300">|</span>
               <span>{complaint.date}</span>
             </div>
           </div>
         ))}
       </div>
    </div>
  );

  const ServiceRequestsList = () => (
    <div className="animate-in fade-in duration-500">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Manage Service Requests</h2>
          <p className="text-slate-500 text-sm mt-1">Approve and track service requests</p>
       </div>
       
       <div className="space-y-4">
         {serviceRequests.map(req => (
           <div key={req.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
             <div>
               <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                   {req.serviceType}
                   {req.scheduledDate && <span className="text-xs font-normal bg-green-50 text-green-600 px-2 py-0.5 rounded">Scheduled: {req.scheduledDate}</span>}
               </h3>
               <p className="text-sm text-slate-600 mt-1">{req.description}</p>
               <div className="text-xs text-slate-500 mt-2 flex items-center gap-2">
                 <span className="font-medium bg-slate-100 px-2 py-0.5 rounded">{req.studentName}</span>
                 <span>Room {req.room}</span>
                 <span className="text-slate-300">•</span>
                 <span>{req.requestedDate}</span>
               </div>
             </div>
             <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end bg-slate-50 p-2 rounded-lg md:bg-transparent md:p-0">
                <span className="text-xs text-slate-500 font-medium md:hidden">Status:</span>
                <div className="flex items-center gap-2">
                    <select 
                        value={req.status} 
                        onChange={(e) => updateServiceRequestStatus(req.id, e.target.value as any)}
                        className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer"
                    >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Completed">Completed</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                    <span className={`w-2 h-2 rounded-full ${
                    req.status === 'Approved' || req.status === 'Completed' ? 'bg-green-500' :
                    req.status === 'Pending' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></span>
                </div>
             </div>
           </div>
         ))}
       </div>
    </div>
  );

  const LeaveRequestsList = () => (
    <div className="animate-in fade-in duration-500">
      <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Manage Leave Requests</h2>
          <p className="text-slate-500 text-sm mt-1">Approve or reject leave applications</p>
       </div>

       <div className="space-y-4">
         {leaveRequests.map(req => (
           <div key={req.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
             <div className="flex flex-col md:flex-row justify-between items-start mb-3 gap-3">
               <div className="flex items-center gap-3">
                 <div className="bg-purple-50 p-2 rounded-lg text-purple-600">
                    <CalendarDays size={20} />
                 </div>
                 <div>
                    <span className="font-medium text-slate-800 block">{req.startDate} to {req.endDate}</span>
                    <span className="text-xs text-slate-500">Duration: {req.days} days</span>
                 </div>
               </div>
               {req.status === 'Pending' ? (
                 <div className="flex gap-2 w-full md:w-auto">
                   <button onClick={() => updateLeaveRequestStatus(req.id, 'Rejected')} className="flex-1 md:flex-none px-4 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">Reject</button>
                   <button onClick={() => updateLeaveRequestStatus(req.id, 'Approved')} className="flex-1 md:flex-none px-4 py-1.5 text-xs font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors shadow-sm">Approve</button>
                 </div>
               ) : (
                 <span className={`px-3 py-1 rounded-full text-xs font-medium ${req.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                   {req.status}
                 </span>
               )}
             </div>
             <div className="bg-slate-50 p-3 rounded-lg mb-2">
                <p className="text-sm text-slate-600 italic">"{req.reason}"</p>
             </div>
             <div className="flex justify-between items-center text-xs text-slate-500">
               <span>{req.studentName} (Room {req.room})</span>
               <span>Submitted: {req.submissionDate}</span>
             </div>
           </div>
         ))}
       </div>
    </div>
  );

  const PaymentsList = () => (
    <div className="animate-in fade-in duration-500">
       <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Manage Payments</h2>
          <p className="text-slate-500 text-sm mt-1">Track hostel fees and payment status</p>
       </div>
       
       <div className="space-y-3">
         {payments.map(payment => (
           <div key={payment.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 hover:shadow-md transition-all">
              <div className="flex items-center gap-4 w-full md:w-auto">
                 <div className="bg-slate-100 p-3 rounded-lg text-slate-600 shrink-0"><CreditCard size={20} /></div>
                 <div>
                    <p className="font-medium text-slate-800">{payment.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                        <span className="font-medium text-slate-600">{payment.studentName}</span>
                        <span className="text-slate-300">|</span>
                        <span>Room {payment.room}</span>
                        <span className="text-slate-300">|</span>
                        <span>Due: {payment.dueDate}</span>
                    </p>
                 </div>
              </div>
              <div className="text-right w-full md:w-auto flex items-center justify-between md:block border-t border-slate-50 pt-3 md:border-0 md:pt-0">
                <div className="md:text-right">
                    <p className="font-bold text-slate-800">₹{payment.amount.toLocaleString()}</p>
                </div>
                <div className="md:mt-1">
                    <select 
                        value={payment.status} 
                        onChange={(e) => updatePaymentStatus(payment.id, e.target.value as any)}
                        className={`text-[10px] uppercase font-bold px-2 py-1 rounded border-none outline-none cursor-pointer ${
                            payment.status === 'Paid' ? 'bg-green-100 text-green-600' : 
                            payment.status === 'Overdue' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                        }`}
                    >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Overdue">Overdue</option>
                    </select>
                </div>
              </div>
           </div>
         ))}
       </div>
    </div>
  );

  const AnnouncementsList = () => {
     const [showForm, setShowForm] = useState(false);
     const [newAnnounce, setNewAnnounce] = useState({ title: '', content: '', type: 'general' });

     const handleAdd = (e: React.FormEvent) => {
         e.preventDefault();
         addAnnouncement({
             id: Date.now().toString(),
             title: newAnnounce.title,
             content: newAnnounce.content,
             type: newAnnounce.type as any,
             date: new Date().toISOString().split('T')[0],
             isPinned: true
         });
         setShowForm(false);
         setNewAnnounce({ title: '', content: '', type: 'general' });
     };

     return (
        <div className="animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Manage Announcements</h2>
                    <p className="text-slate-500 text-sm mt-1">Create and manage hostel announcements</p>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium shadow-sm transition-all">
                    {showForm ? <XCircle size={18}/> : <Plus size={18} />} 
                    {showForm ? 'Cancel' : 'New Announcement'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white border border-purple-100 p-6 rounded-xl mb-8 shadow-lg animate-in slide-in-from-top-2">
                    <h3 className="font-semibold text-slate-800 mb-4">Create New Announcement</h3>
                    <form onSubmit={handleAdd} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Title</label>
                            <input type="text" required className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-purple-500 outline-none text-sm" value={newAnnounce.title} onChange={e => setNewAnnounce({...newAnnounce, title: e.target.value})}/>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Content</label>
                            <textarea required rows={3} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-purple-500 outline-none text-sm resize-none" value={newAnnounce.content} onChange={e => setNewAnnounce({...newAnnounce, content: e.target.value})}/>
                        </div>
                        <div className="flex gap-4 items-end">
                            <div className="flex-1">
                                <label className="block text-xs font-medium text-slate-600 mb-1">Type</label>
                                <select className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-purple-500 outline-none text-sm bg-white" value={newAnnounce.type} onChange={e => setNewAnnounce({...newAnnounce, type: e.target.value})}>
                                    <option value="general">General</option>
                                    <option value="urgent">Urgent</option>
                                    <option value="event">Event</option>
                                </select>
                            </div>
                            <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg text-sm font-medium h-[38px] transition-colors">Post Announcement</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="space-y-4">
                {announcements.map(ann => (
                    <div key={ann.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:border-purple-100 transition-colors">
                        <div className="flex justify-between items-start">
                             <div className="flex items-center gap-2">
                                 {ann.type === 'urgent' && <ShieldCheck size={16} className="text-red-500"/>}
                                 <h3 className="font-semibold text-slate-800">{ann.title}</h3>
                             </div>
                             {ann.isPinned && <span className="text-[10px] bg-purple-50 text-purple-600 px-2 py-0.5 rounded font-medium">Pinned</span>}
                        </div>
                        <p className="text-sm text-slate-600 mt-2 mb-3 leading-relaxed">{ann.content}</p>
                        <div className="flex gap-2 text-xs text-slate-400 items-center">
                             <span className={`px-2 py-0.5 rounded capitalize ${ann.type === 'urgent' ? 'bg-red-50 text-red-600' : ann.type === 'event' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>
                                 {ann.type}
                             </span>
                             <span>•</span>
                             <span>Posted on {ann.date}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
     );
  };

  const SettingsView = () => (
      <div className="animate-in fade-in duration-500 max-w-2xl">
          <h2 className="text-2xl font-bold text-slate-800 mb-1">Settings</h2>
          <p className="text-slate-500 text-sm mb-8">Manage system configurations</p>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 mb-6">
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <div className="p-1.5 bg-purple-100 rounded-lg text-purple-600"><Users size={16}/></div>
                  Admin Profile
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Name</label>
                      <input type="text" value="Administrator" disabled className="w-full border border-slate-200 rounded-lg p-2 text-sm bg-slate-50 text-slate-600"/>
                  </div>
                  <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Role</label>
                      <input type="text" value="Super Admin" disabled className="w-full border border-slate-200 rounded-lg p-2 text-sm bg-slate-50 text-slate-600"/>
                  </div>
              </div>
              <button className="text-purple-600 text-sm font-medium hover:underline">Change Password</button>
          </div>

           <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <div className="p-1.5 bg-blue-100 rounded-lg text-blue-600"><Bell size={16}/></div>
                  System Notifications
              </h3>
              <div className="space-y-3">
                  <label className="flex items-center justify-between cursor-pointer p-2 hover:bg-slate-50 rounded-lg">
                      <span className="text-sm text-slate-700">Email Alerts for Urgent Complaints</span>
                      <input type="checkbox" defaultChecked className="accent-purple-600 w-4 h-4"/>
                  </label>
                   <label className="flex items-center justify-between cursor-pointer p-2 hover:bg-slate-50 rounded-lg">
                      <span className="text-sm text-slate-700">Daily Activity Report</span>
                      <input type="checkbox" className="accent-purple-600 w-4 h-4"/>
                  </label>
              </div>
          </div>
      </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 w-full font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-20 hidden md:flex shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="bg-purple-600 p-1.5 rounded-lg text-white shadow-lg shadow-purple-200">
            <ShieldCheck size={20} />
          </div>
          <span className="font-bold text-slate-800 tracking-tight">Admin Portal</span>
        </div>

        <div className="p-6 bg-gradient-to-b from-purple-50/50 to-transparent border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white shrink-0 shadow-md border-2 border-purple-200">
              <span className="font-bold">A</span>
            </div>
            <div className="overflow-hidden">
              <h3 className="font-semibold text-slate-800 truncate text-sm">Administrator</h3>
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Super Admin</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                activeTab === item.name
                  ? 'bg-purple-50 text-purple-700 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className={activeTab === item.name ? 'text-purple-600' : 'text-slate-400'}>{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>

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
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between shrink-0 z-10 sticky top-0">
           <div className="flex items-center gap-2 text-slate-400 text-sm">
                <ShieldCheck size={16}/>
                <span className="font-medium">Admin Panel</span>
                <span>/</span>
                <span className="text-purple-600 font-medium">{activeTab}</span>
           </div>
           <div className="flex gap-4">
               <button className="p-2 text-slate-400 hover:bg-slate-100 hover:text-purple-600 rounded-full transition-colors relative">
                   <Bell size={20}/>
                   {recentActivity.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>}
               </button>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {activeTab === 'Overview' && <Overview />}
          {activeTab === 'Users' && <UsersList />}
          {activeTab === 'Complaints' && <ComplaintsList />}
          {activeTab === 'Service Requests' && <ServiceRequestsList />}
          {activeTab === 'Leave Requests' && <LeaveRequestsList />}
          {activeTab === 'Payments' && <PaymentsList />}
          {activeTab === 'Announcements' && <AnnouncementsList />}
          {activeTab === 'Settings' && <SettingsView />}
        </div>
      </main>
    </div>
  );
};