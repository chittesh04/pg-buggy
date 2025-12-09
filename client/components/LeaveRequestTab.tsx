import React, { useState } from 'react';
import { Plus, Calendar, Clock, CheckCircle2, X, AlertCircle } from 'lucide-react';
import { useData } from '../services/DataContext';

export const LeaveRequestTab: React.FC = () => {
  const { leaveRequests, addLeaveRequest, currentUser } = useData();
  
  const myRequests = leaveRequests.filter(c => 
    (typeof c.student === 'string' ? c.student === currentUser?.id : (c.student as any)?.id === currentUser?.id)
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({
    startDate: '',
    endDate: '',
    reason: ''
  });

  const stats = {
    total: myRequests.length,
    approved: myRequests.filter(r => r.status === 'Approved').length,
    pending: myRequests.filter(r => r.status === 'Pending').length
  };

  // --- HELPER FUNCTION: Format Date ---
  const formatDate = (isoString: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric', 
      month: 'short', 
      year: 'numeric'
    }); // Result: "24 Dec 2025"
  };

  const calculateDays = (start: string, end: string) => {
    const d1 = new Date(start);
    const d2 = new Date(end);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays || 1; 
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const days = calculateDays(newRequest.startDate, newRequest.endDate);
    
    const request: any = {
      startDate: newRequest.startDate,
      endDate: newRequest.endDate,
      reason: newRequest.reason,
      status: 'Pending',
      submissionDate: new Date().toISOString().split('T')[0],
      days: days,
    };

    addLeaveRequest(request);
    setIsModalOpen(false);
    setNewRequest({ startDate: '', endDate: '', reason: '' });
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Approved':
        return <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"><CheckCircle2 size={12} /> Approved</span>;
      case 'Pending':
        return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"><Clock size={12} /> Pending</span>;
      case 'Rejected':
        return <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"><X size={12} /> Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Leave Requests</h2>
          <p className="text-slate-500 text-sm mt-1">Request leave from hostel and track approval status</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={18} /> New Leave Request
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Total Requests</p>
          <p className="text-2xl font-semibold text-slate-800 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Approved</p>
          <p className="text-2xl font-semibold text-green-600 mt-1">{stats.approved}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Pending</p>
          <p className="text-2xl font-semibold text-yellow-600 mt-1">{stats.pending}</p>
        </div>
      </div>

      <div className="space-y-4">
        {myRequests.length > 0 ? myRequests.map((req) => (
          <div key={req.id} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-3">
              <div className="flex items-start gap-3">
                <div className="bg-blue-50 p-2.5 rounded-lg text-blue-600 mt-1">
                  <Calendar size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    {/* --- FIX APPLIED HERE: Using formatDate() --- */}
                    <span className="font-semibold text-slate-800 text-base">
                      {formatDate(req.startDate)} to {formatDate(req.endDate)}
                    </span>
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {req.days} days
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm">{req.reason}</p>
                </div>
              </div>
              <div>{getStatusBadge(req.status)}</div>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-slate-400 pl-[52px]">
              <Clock size={12} />
              {/* --- FIX APPLIED HERE: Using formatDate() --- */}
              <span>Submitted on {formatDate(req.submissionDate)}</span>
            </div>
          </div>
        )) : (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-100 border-dashed">
             <p className="text-slate-500">No leave requests found</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-semibold text-slate-800">New Leave Request</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]} // Disable past dates
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                    value={newRequest.startDate}
                    onChange={e => setNewRequest({...newRequest, startDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    min={newRequest.startDate} // End date cannot be before start date
                    disabled={!newRequest.startDate} // Disable until start date is picked
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                    value={newRequest.endDate}
                    onChange={e => setNewRequest({...newRequest, endDate: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Reason</label>
                <textarea
                  required
                  rows={4}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-none"
                  placeholder="Enter reason for leave..."
                  value={newRequest.reason}
                  onChange={e => setNewRequest({...newRequest, reason: e.target.value})}
                ></textarea>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg flex gap-3 items-start">
                 <AlertCircle size={16} className="text-blue-600 shrink-0 mt-0.5" />
                 <p className="text-xs text-blue-800 leading-relaxed">
                   Note: Requests for more than 3 days require parent's approval via phone call. Ensure dates are correct before submitting.
                 </p>
              </div>

              <div className="pt-2 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};