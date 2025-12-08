import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// --- Configuration ---
const API_URL = 'http://localhost:5000/api';

// --- Interfaces ---
export interface User {
  id: string; // MongoDB _id is usually a string
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
interface DataContextType {
  users: User[];
  complaints: Complaint[];
  serviceRequests: ServiceRequest[];
  leaveRequests: LeaveRequest[];
  payments: Payment[];
  announcements: Announcement[];
  recentActivity: Activity[];
  
  addComplaint: (complaint: Omit<Complaint, 'id' | 'date' | 'status'>) => void;
  updateComplaintStatus: (id: string, status: Complaint['status']) => void;
  
  addServiceRequest: (request: Omit<ServiceRequest, 'id' | 'status'>) => void;
  updateServiceRequestStatus: (id: string, status: ServiceRequest['status']) => void;
  
  addLeaveRequest: (request: Omit<LeaveRequest, 'id' | 'status'>) => void;
  updateLeaveRequestStatus: (id: string, status: LeaveRequest['status']) => void;
  
  addAnnouncement: (announcement: Omit<Announcement, 'id'>) => void;
  
  payBill: (id: string) => void;
  updatePaymentStatus: (id: string, status: Payment['status']) => void;
  
  addUser: (user: Omit<User, 'id'>) => void;
  deleteUser: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // --- State (Initialized as empty) ---
  const [users, setUsers] = useState<User[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);

  // --- Initial Data Fetching ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          usersRes, 
          complaintsRes, 
          serviceRes, 
          leaveRes, 
          paymentsRes, 
          announceRes
        ] = await Promise.all([
          axios.get(`${API_URL}/users`),
          axios.get(`${API_URL}/complaints`),
          axios.get(`${API_URL}/service-requests`),
          axios.get(`${API_URL}/leave-requests`),
          axios.get(`${API_URL}/payments`),
          axios.get(`${API_URL}/announcements`)
        ]);

        setUsers(usersRes.data);
        setComplaints(complaintsRes.data);
        setServiceRequests(serviceRes.data);
        setLeaveRequests(leaveRes.data);
        setPayments(paymentsRes.data);
        setAnnouncements(announceRes.data);
      } catch (error) {
        console.error("Error fetching initial data from backend:", error);
      }
    };

    fetchData();
  }, []);

  // --- Helper: Local Activity Log (Client Side) ---
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

  // --- Complaints ---
  const addComplaint = async (complaintData: any) => {
    try {
      const res = await axios.post(`${API_URL}/complaints`, complaintData);
      setComplaints(prev => [res.data, ...prev]); // Backend returns the full object with ID
      addActivity(complaintData.studentName, `submitted a complaint: ${complaintData.title}`, 'complaint');
    } catch (error) {
      console.error("Error adding complaint:", error);
    }
  };

  const updateComplaintStatus = async (id: string, status: Complaint['status']) => {
    try {
      await axios.patch(`${API_URL}/complaints/${id}`, { status });
      setComplaints(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    } catch (error) {
      console.error("Error updating complaint status:", error);
    }
  };

  // --- Service Requests ---
  const addServiceRequest = async (requestData: any) => {
    try {
      const res = await axios.post(`${API_URL}/service-requests`, requestData);
      setServiceRequests(prev => [res.data, ...prev]);
      addActivity(requestData.studentName, `requested service: ${requestData.serviceType}`, 'request');
    } catch (error) {
      console.error("Error adding service request:", error);
    }
  };

  const updateServiceRequestStatus = async (id: string, status: ServiceRequest['status']) => {
    try {
      await axios.patch(`${API_URL}/service-requests/${id}`, { status });
      setServiceRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    } catch (error) {
      console.error("Error updating service request status:", error);
    }
  };

  // --- Leave Requests ---
  const addLeaveRequest = async (requestData: any) => {
    try {
      const res = await axios.post(`${API_URL}/leave-requests`, requestData);
      setLeaveRequests(prev => [res.data, ...prev]);
      addActivity(requestData.studentName, `requested leave for ${requestData.days} days`, 'request');
    } catch (error) {
      console.error("Error adding leave request:", error);
    }
  };

  const updateLeaveRequestStatus = async (id: string, status: LeaveRequest['status']) => {
    try {
      await axios.patch(`${API_URL}/leave-requests/${id}`, { status });
      setLeaveRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    } catch (error) {
      console.error("Error updating leave request status:", error);
    }
  };

  // --- Announcements ---
  const addAnnouncement = async (announcementData: any) => {
    try {
      const res = await axios.post(`${API_URL}/announcements`, announcementData);
      setAnnouncements(prev => [res.data, ...prev]);
      addActivity('Admin', `posted announcement: ${announcementData.title}`, 'other');
    } catch (error) {
      console.error("Error adding announcement:", error);
    }
  };

  // --- Payments ---
  const payBill = async (id: string) => {
    const payment = payments.find(p => p.id === id);
    if (!payment) return;

    try {
      const updateData = {
        status: 'Paid',
        paidOn: new Date().toISOString().split('T')[0],
        transactionId: `TXN${Date.now()}`
      };
      
      const res = await axios.patch(`${API_URL}/payments/${id}`, updateData);
      
      setPayments(prev => prev.map(p => p.id === id ? { ...p, ...updateData } : p));
      addActivity(payment.studentName, `paid bill: ${payment.title}`, 'payment');
    } catch (error) {
      console.error("Error paying bill:", error);
    }
  };

  const updatePaymentStatus = async (id: string, status: Payment['status']) => {
    try {
      await axios.patch(`${API_URL}/payments/${id}`, { status });
      setPayments(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    } catch (error) {
       console.error("Error updating payment status:", error);
    }
  };

  // --- Users ---
  const addUser = async (userData: any) => {
    try {
      const res = await axios.post(`${API_URL}/users`, userData);
      setUsers(prev => [...prev, res.data]);
      addActivity('Admin', `added new user: ${userData.name}`, 'other');
    } catch (error) {
       console.error("Error adding user:", error);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/users/${id}`);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <DataContext.Provider value={{
      users, complaints, serviceRequests, leaveRequests, payments, announcements, recentActivity,
      addComplaint, updateComplaintStatus,
      addServiceRequest, updateServiceRequestStatus,
      addLeaveRequest, updateLeaveRequestStatus,
      addAnnouncement, payBill, updatePaymentStatus, addUser, deleteUser
    }}>
      {children}
    </DataContext.Provider>
  );
};

// Renamed Hook to be generic
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};