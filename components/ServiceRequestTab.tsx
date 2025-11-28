import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Wrench, 
  BedDouble, 
  Shirt, 
  Wifi, 
  Droplets, 
  Zap, 
  Clock, 
  CheckCircle2, 
  X,
} from 'lucide-react';
import { useMockData, ServiceRequest } from '../services/MockDataContext';

export const ServiceRequestTab: React.FC = () => {
  const { serviceRequests, addServiceRequest } = useMockData();
  const myRequests = serviceRequests.filter(r => r.studentName === 'John Doe');

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({
    serviceType: 'Room Maintenance',
    description: ''
  });

  const categories = [
    { name: 'Room Maintenance', icon: <Wrench size={20} /> },
    { name: 'Furniture Repair', icon: <BedDouble size={20} /> },
    { name: 'Laundry Service', icon: <Shirt size={20} /> },
    { name: 'Internet/WiFi', icon: <Wifi size={20} /> },
    { name: 'Plumbing', icon: <Droplets size={20} /> },
    { name: 'Electrical', icon: <Zap size={20} /> },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const request: ServiceRequest = {
      id: Date.now().toString(),
      serviceType: newRequest.serviceType,
      description: newRequest.description,
      requestedDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      studentName: 'John Doe',
      room: '101'
    };
    addServiceRequest(request);
    setIsModalOpen(false);
    setNewRequest({ serviceType: 'Room Maintenance', description: '' });
  };

  const filteredRequests = myRequests.filter(req => {
    const matchesCategory = selectedCategory ? req.serviceType === selectedCategory : true;
    const matchesSearch = req.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          req.serviceType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return (
          <span className="bg-green-100 text-green-600 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
            <CheckCircle2 size={12} /> Approved
          </span>
        );
      case 'pending':
        return (
          <span className="bg-yellow-100 text-yellow-700 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
            <Clock size={12} /> Pending
          </span>
        );
      case 'rejected':
         return (
          <span className="bg-red-100 text-red-600 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
            <X size={12} /> Rejected
          </span>
        );
      default:
        return (
          <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
            <Clock size={12} /> {status}
          </span>
        );
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Service Requests</h2>
          <p className="text-slate-500 text-sm mt-1">Request hostel services and track their status</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={18} /> New Request
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
                placeholder="Search service requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
            />
        </div>
      </div>

      <div className="space-y-4">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((req) => (
            <div key={req.id} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-slate-800 text-lg mb-1">{req.serviceType}</h3>
                  <p className="text-slate-600 text-sm">{req.description}</p>
                </div>
                <div className="mt-3 md:mt-0">
                  {getStatusBadge(req.status)}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-xs text-slate-500 mt-4 pt-4 border-t border-slate-50">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">Requested:</span>
                  <span className="font-medium text-slate-600">{req.requestedDate}</span>
                </div>
                {req.scheduledDate && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">Scheduled:</span>
                    <span className="font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">{req.scheduledDate}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-100 border-dashed">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-slate-400" />
            </div>
            <p className="text-slate-500">No service requests found</p>
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
                    <h3 className="font-semibold text-slate-800">New Service Request</h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Service Type</label>
                        <select
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all bg-white"
                            value={newRequest.serviceType}
                            onChange={e => setNewRequest({...newRequest, serviceType: e.target.value})}
                        >
                            {categories.map(cat => (
                                <option key={cat.name} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea
                            required
                            rows={4}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-none"
                            placeholder="Describe the service you need in detail..."
                            value={newRequest.description}
                            onChange={e => setNewRequest({...newRequest, description: e.target.value})}
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