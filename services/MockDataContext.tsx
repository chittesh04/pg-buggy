import React, { createContext, useContext, useState, ReactNode } from 'react';

// --- Interfaces ---
export interface User {
  id: string;
  name: string;
  email: string;
  room: string;
  contact: string;
  joinDate: string;
  status: 'Active' | 'Inactive';
}

export interface Complaint {
  id: string;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In-progress' | 'Resolved';
  description: string;
  category: string;
  date: string;
  studentName: string;
  room: string;
}

export interface ServiceRequest {
  id: string;
  serviceType: string;
  description: string;
  requestedDate: string;
  scheduledDate?: string;
  status: 'Pending' | 'Approved' | 'In-progress' | 'Completed' | 'Rejected';
  studentName: string;
  room: string;
}

export interface LeaveRequest {
  id: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submissionDate: string;
  days: number;
  studentName: string;
  room: string;
}

export interface Payment {
  id: string;
  title: string;
  dueDate: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  paidOn?: string;
  transactionId?: string;
  studentName: string;
  room: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'urgent' | 'general' | 'event';
  isPinned?: boolean;
}

export interface Activity {
  id: string;
  user: string;
  action: string;
  time: Date;
  type: 'complaint' | 'payment' | 'request' | 'other';
}

// --- Context Type ---
interface MockDataContextType {
  users: User[];
  complaints: Complaint[];
  serviceRequests: ServiceRequest[];
  leaveRequests: LeaveRequest[];
  payments: Payment[];
  announcements: Announcement[];
  recentActivity: Activity[];
  
  addComplaint: (complaint: Complaint) => void;
  updateComplaintStatus: (id: string, status: Complaint['status']) => void;
  
  addServiceRequest: (request: ServiceRequest) => void;
  updateServiceRequestStatus: (id: string, status: ServiceRequest['status']) => void;
  
  addLeaveRequest: (request: LeaveRequest) => void;
  updateLeaveRequestStatus: (id: string, status: LeaveRequest['status']) => void;
  
  addAnnouncement: (announcement: Announcement) => void;
  
  payBill: (id: string) => void;
  updatePaymentStatus: (id: string, status: Payment['status']) => void;
  
  addUser: (user: User) => void;
  deleteUser: (id: string) => void;
}

const MockDataContext = createContext<MockDataContextType | undefined>(undefined);

// --- Initial Data ---
const initialUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john@email.com', room: '101', contact: '+91 98765 43210', joinDate: '2025-01-15', status: 'Active' },
  { id: '2', name: 'Jane Smith', email: 'jane@email.com', room: '102', contact: '+91 98765 43211', joinDate: '2025-02-01', status: 'Active' },
  { id: '3', name: 'Mike Johnson', email: 'mike@email.com', room: '103', contact: '+91 98765 43212', joinDate: '2025-01-20', status: 'Active' },
  { id: '4', name: 'Sarah Williams', email: 'sarah@email.com', room: '104', contact: '+91 98765 43213', joinDate: '2024-12-15', status: 'Inactive' },
];

const initialComplaints: Complaint[] = [
  { id: '1', title: 'AC not working', priority: 'High', status: 'In-progress', description: 'The air conditioner in room 101 is not cooling properly', category: 'Maintenance', date: '2025-11-10', studentName: 'John Doe', room: '101' },
  { id: '2', title: 'Water leakage', priority: 'High', status: 'Pending', description: 'Water leaking from bathroom ceiling', category: 'Plumbing', date: '2025-11-12', studentName: 'Jane Smith', room: '102' },
  { id: '3', title: 'WiFi connectivity issue', priority: 'Medium', status: 'Resolved', description: 'Unable to connect to WiFi in my room', category: 'Internet', date: '2025-11-08', studentName: 'Mike Johnson', room: '103' }
];

const initialServiceRequests: ServiceRequest[] = [
  { id: '1', serviceType: 'Room Maintenance', description: 'Need room cleaning service', requestedDate: '2025-11-10', scheduledDate: '2025-11-15', status: 'Approved', studentName: 'John Doe', room: '101' },
  { id: '2', serviceType: 'Furniture Repair', description: 'Bed frame is broken and needs repair', requestedDate: '2025-11-12', status: 'Pending', studentName: 'Jane Smith', room: '102' }
];

const initialLeaveRequests: LeaveRequest[] = [
  { id: '1', startDate: '2025-11-20', endDate: '2025-11-25', reason: 'Going home for family function', status: 'Approved', submissionDate: '2025-11-10', days: 5, studentName: 'John Doe', room: '101' },
  { id: '2', startDate: '2025-12-01', endDate: '2025-12-03', reason: 'Medical appointment', status: 'Pending', submissionDate: '2025-11-12', days: 2, studentName: 'Jane Smith', room: '102' }
];

const initialPayments: Payment[] = [
  { id: '1', title: 'Monthly Rent', dueDate: '2025-11-30', amount: 5000, status: 'Paid', paidOn: '2025-11-05', transactionId: 'TXN123456789', studentName: 'John Doe', room: '101' },
  { id: '2', title: 'Mess Charges', dueDate: '2025-11-30', amount: 3000, status: 'Paid', paidOn: '2025-11-05', transactionId: 'TXN123456790', studentName: 'John Doe', room: '101' },
  { id: '3', title: 'Monthly Rent', dueDate: '2025-12-31', amount: 5000, status: 'Pending', studentName: 'John Doe', room: '101' },
  { id: '4', title: 'Electricity Bill', dueDate: '2025-11-15', amount: 800, status: 'Overdue', studentName: 'Mike Johnson', room: '103' }
];

const initialAnnouncements: Announcement[] = [
  { id: '1', title: 'Hostel Maintenance Notice', content: 'The hostel will undergo routine maintenance on November 18th from 9 AM to 5 PM. Water supply may be affected during this time. Please plan accordingly.', date: '2025-11-13', type: 'urgent', isPinned: true },
  { id: '2', title: 'Mess Menu Update', content: 'The mess menu has been updated for this week. Special dishes will be served on Friday. Check the notice board for details.', date: '2025-11-12', type: 'general', isPinned: true },
  { id: '3', title: 'Cultural Event - College Fest', content: 'Annual cultural fest will be held from November 25-27. All hostel residents are invited to participate. Registration is open until November 20th.', date: '2025-11-10', type: 'event' },
  { id: '4', title: 'WiFi Upgrade Completed', content: 'The hostel WiFi has been upgraded to provide faster internet speeds. Please reconnect to the network using your existing credentials.', date: '2025-11-08', type: 'general' }
];

export const MockDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(initialServiceRequests);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(initialLeaveRequests);
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([
    { id: '1', user: 'John Doe', action: 'submitted a new complaint', time: new Date(Date.now() - 1000 * 60 * 5), type: 'complaint' },
    { id: '2', user: 'Jane Smith', action: 'made a payment of ₹5,000', time: new Date(Date.now() - 1000 * 60 * 15), type: 'payment' },
    { id: '3', user: 'Mike Johnson', action: 'requested room maintenance', time: new Date(Date.now() - 1000 * 60 * 30), type: 'request' }
  ]);

  const addActivity = (user: string, action: string, type: Activity['type']) => {
    const newActivity: Activity = {
      id: Date.now().toString(),
      user,
      action,
      time: new Date(),
      type
    };
    setRecentActivity(prev => [newActivity, ...prev]);
  };

  const addComplaint = (complaint: Complaint) => {
    setComplaints(prev => [complaint, ...prev]);
    addActivity(complaint.studentName, `submitted a complaint: ${complaint.title}`, 'complaint');
  };

  const updateComplaintStatus = (id: string, status: Complaint['status']) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    // Optional: Add admin activity if desired
  };

  const addServiceRequest = (request: ServiceRequest) => {
    setServiceRequests(prev => [request, ...prev]);
    addActivity(request.studentName, `requested service: ${request.serviceType}`, 'request');
  };

  const updateServiceRequestStatus = (id: string, status: ServiceRequest['status']) => {
    setServiceRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const addLeaveRequest = (request: LeaveRequest) => {
    setLeaveRequests(prev => [request, ...prev]);
    addActivity(request.studentName, `requested leave for ${request.days} days`, 'request');
  };

  const updateLeaveRequestStatus = (id: string, status: LeaveRequest['status']) => {
    setLeaveRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const addAnnouncement = (announcement: Announcement) => {
    setAnnouncements(prev => [announcement, ...prev]);
    addActivity('Admin', `posted announcement: ${announcement.title}`, 'other');
  };
  
  const payBill = (id: string) => {
    const payment = payments.find(p => p.id === id);
    if (payment) {
      setPayments(prev => prev.map(p => 
        p.id === id 
          ? { ...p, status: 'Paid', paidOn: new Date().toISOString().split('T')[0], transactionId: `TXN${Date.now()}` } 
          : p
      ));
      addActivity(payment.studentName, `paid bill: ${payment.title}`, 'payment');
    }
  };

  const updatePaymentStatus = (id: string, status: Payment['status']) => {
      setPayments(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  };

  const addUser = (user: User) => {
    setUsers(prev => [...prev, user]);
    addActivity('Admin', `added new user: ${user.name}`, 'other');
  };

  const deleteUser = (id: string) => {
      setUsers(prev => prev.filter(u => u.id !== id));
  };

  return (
    <MockDataContext.Provider value={{
      users, complaints, serviceRequests, leaveRequests, payments, announcements, recentActivity,
      addComplaint, updateComplaintStatus,
      addServiceRequest, updateServiceRequestStatus,
      addLeaveRequest, updateLeaveRequestStatus,
      addAnnouncement, payBill, updatePaymentStatus, addUser, deleteUser
    }}>
      {children}
    </MockDataContext.Provider>
  );
};

export const useMockData = () => {
  const context = useContext(MockDataContext);
  if (context === undefined) {
    throw new Error('useMockData must be used within a MockDataProvider');
  }
  return context;
};