import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  X,
  Wrench,
  Droplets,
  Wifi,
  Zap,
  BedDouble,
  Sparkles
} from 'lucide-react';
import { useMockData, Complaint } from '../services/MockDataContext';

export const ComplaintsTab: React.FC = () => {
  const { complaints, addComplaint } = useMockData();
  
  // Filter complaints to show only current user's (Mocking user ID 1 for John Doe)
  const myComplaints = complaints.filter(c => c.studentName === 'John Doe');

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newComplaint, setNewComplaint] = useState({
    title: '',
    category: 'Maintenance',
    priority: 'Medium',
    description: ''
  });

  const categories = [
    { name: 'Maintenance', icon: <Wrench size={20} /> },
    { name: 'Plumbing', icon: <Droplets size={20} /> },
    { name: 'Internet', icon: <Wifi size={20} /> },
    { name: 'Electrical', icon: <Zap size={20} /> },
    { name: 'Furniture', icon: <BedDouble size={20} /> },
    { name: 'Cleaning', icon: <Sparkles size={20} /> },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const complaint: Complaint = {
        id: Date.now().toString(),
        title: newComplaint.title,
        priority: newComplaint.priority as 'High' | 'Medium' | 'Low',
        status: 'Pending',
        description: newComplaint.description,
        category: newComplaint.category,
        date: new Date().toISOString().split('T')[0],
        studentName: 'John Doe',
        room: '101'
    };
    addComplaint(complaint);
    setIsModalOpen(false);
    setNewComplaint({ title: '', category: 'Maintenance', priority: 'Medium', description: '' });
  };

  const filteredComplaints = myComplaints.filter(complaint => {
    const matchesCategory = selectedCategory ? complaint.category === selectedCategory : true;
    const matchesSearch = complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          complaint.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getPriorityColor = (p: string) => {
      switch(p.toLowerCase()) {
          case 'high': return 'bg-red-100 text-red-600';
          case 'medium': return 'bg-orange-100 text-orange-600';
          default: return 'bg-green-100 text-green-600';
      }
  };

  const getStatusColor = (s: string) => {
       switch(s.toLowerCase()) {
          case 'resolved': return 'bg-green-100 text-green-600';
          case 'in-progress': return 'bg-blue-100 text-blue-600';
          default: return 'bg-yellow-100 text-yellow-700';
      }
  };

  const getStatusIcon = (s: string) => {
       switch(s.toLowerCase()) {
          case 'resolved': return <CheckCircle2 size={14} />;
          case 'in-progress': return <Clock size={14} />;
          default: return <AlertCircle size={14} />;
      }
  };

  return (
    <div className="w-full max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">My Complaints</h2>
            <p className="text-slate-500 text-sm mt-1">Track and manage your hostel complaints</p>
        </div>
        <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
            <Plus size={18} /> New Complaint
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
            className={`p-4 rounded-xl border transition-all flex flex-col items-center text-center gap-3 hover:shadow-md ${
              selectedCategory === cat.name
                ? 'bg-blue-50 border-blue-200 shadow-sm'
                : 'bg-white border-slate-100 hover:border-blue-100'
            }`}
          >
            <div className={`p-3 rounded-full ${selectedCategory === cat.name ? 'bg-blue-200 text-blue-700' : 'bg-blue-50 text-blue-600'}`}>
              {cat.icon}
            </div>
            <span className={`text-sm font-medium ${selectedCategory === cat.name ? 'text-blue-700' : 'text-slate-600'}`}>
              {cat.name}
            </span>
          </button>
        ))}
      </div>

      <div className="mb-6 bg-slate-50/50 rounded-lg">
         <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
                type="text"
                placeholder="Search complaints..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
            />
        </div>
      </div>

      <div className="space-y-4">
        {filteredComplaints.length > 0 ? (
          filteredComplaints.map((complaint) => (
              <div key={complaint.id} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-start justify-between mb-3 gap-2 md:gap-0">
                      <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-slate-800">{complaint.title}</h3>
                          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getPriorityColor(complaint.priority)}`}>
                              {complaint.priority}
                          </span>
                      </div>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5 w-fit ${getStatusColor(complaint.status)}`}>
                          {getStatusIcon(complaint.status)} {complaint.status}
                      </span>
                  </div>
                  <p className="text-slate-600 text-sm mb-4">{complaint.description}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                          {complaint.category}
                      </div>
                      <span>{complaint.date}</span>
                  </div>
              </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-100 border-dashed">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-slate-400" />
            </div>
            <p className="text-slate-500">No complaints found</p>
            {selectedCategory && (
               <button 
                 onClick={() => setSelectedCategory(null)}
                 className="text-blue-600 text-sm font-medium mt-2 hover:underline"
               >
                 Clear filters
               </button>
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-semibold text-slate-800">New Complaint</h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                        <input
                            type="text"
                            required
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                            placeholder="e.g. AC not cooling"
                            value={newComplaint.title}
                            onChange={e => setNewComplaint({...newComplaint, title: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                            <select
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all bg-white"
                                value={newComplaint.category}
                                onChange={e => setNewComplaint({...newComplaint, category: e.target.value})}
                            >
                                <option>Maintenance</option>
                                <option>Plumbing</option>
                                <option>Internet</option>
                                <option>Electrical</option>
                                <option>Furniture</option>
                                <option>Cleaning</option>
                            </select>
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                             <select
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all bg-white"
                                value={newComplaint.priority}
                                onChange={e => setNewComplaint({...newComplaint, priority: e.target.value})}
                            >
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea
                            required
                            rows={4}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-none"
                            placeholder="Describe the issue in detail..."
                            value={newComplaint.description}
                            onChange={e => setNewComplaint({...newComplaint, description: e.target.value})}
                        ></textarea>
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
                            Submit Complaint
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};