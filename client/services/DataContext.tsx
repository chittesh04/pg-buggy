import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// --- Configuration ---
const API_URL = 'http://localhost:5000/api';

// --- Interfaces ---
export interface User {
  id: string;
  name: string;
  email: string;
  room?: string;
  role: 'Admin' | 'User';
  token?: string;
}

// ... (Keep your existing interfaces for Complaint, ServiceRequest, etc. here) ...
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
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: string) => Promise<boolean>;
  logout: () => void;

  users: User[];
  complaints: Complaint[];
  serviceRequests: ServiceRequest[];
  leaveRequests: LeaveRequest[];
  payments: Payment[];
  announcements: Announcement[];
  recentActivity: Activity[];
  
  addComplaint: (complaint: any) => void;
  updateComplaintStatus: (id: string, status: Complaint['status']) => void;
  addServiceRequest: (request: any) => void;
  updateServiceRequestStatus: (id: string, status: ServiceRequest['status']) => void;
  addLeaveRequest: (request: any) => void;
  updateLeaveRequestStatus: (id: string, status: LeaveRequest['status']) => void;
  addAnnouncement: (announcement: any) => void;
  payBill: (id: string) => void;
  updatePaymentStatus: (id: string, status: Payment['status']) => void;
  addUser: (user: any) => void;
  deleteUser: (id: string) => void;
  addPayment: (paymentData: any) => Promise<void>; 
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Data States
  const [users, setUsers] = useState<User[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);

  // --- Auth Logic ---
  
  // Check for token on load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setIsAuthenticated(true);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchData(); // Load data if logged in
    }
  }, []);

  const login = async (email: string, password: string, role: string) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      
      // Check if the role matches (prevent Students logging into Admin)
      if (res.data.user.role !== role) {
        alert(`Access Denied: You are not an ${role}`);
        return false;
      }

      const { token, user } = res.data;

      // Save to storage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set State
      setCurrentUser(user);
      setIsAuthenticated(true);
      
      // Set Axios Header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Fetch Data
      fetchData();
      return true;
    } catch (error: any) {
      console.error("Login failed:", error.response?.data?.message || error.message);
      alert(error.response?.data?.message || "Login Failed");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setIsAuthenticated(false);
    delete axios.defaults.headers.common['Authorization'];
    // Clear data
    setComplaints([]);
    setServiceRequests([]);
    // ... clear others if needed
  };

  // --- Data Fetching ---
  const fetchData = async () => {
    try {
      // We fetch everything, but backend should filter based on user role if we implemented that logic there.
      // For now, we fetch all and filter in frontend or backend.
      const [usersRes, complaintsRes, serviceRes, leaveRes, paymentsRes, announceRes] = await Promise.all([
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
      console.error("Error fetching data:", error);
    }
  };

  // --- Helper: Local Activity Log ---
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

  // --- Actions (Updated to use currentUser) ---

  const addComplaint = async (complaintData: any) => {
    if (!currentUser) return;
    const dataWithUser = {
        ...complaintData,
        studentName: currentUser.name,
        room: currentUser.room || 'N/A',
        student: currentUser.id // Send ID to backend
    };
    try {
      const res = await axios.post(`${API_URL}/complaints`, dataWithUser);
      setComplaints(prev => [res.data, ...prev]);
      addActivity(currentUser.name, `submitted a complaint: ${complaintData.title}`, 'complaint');
    } catch (error) { console.error(error); }
  };

  const updateComplaintStatus = async (id: string, status: Complaint['status']) => {
    try {
      await axios.patch(`${API_URL}/complaints/${id}`, { status });
      setComplaints(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    } catch (error) { console.error(error); }
  };

  const addServiceRequest = async (requestData: any) => {
    if (!currentUser) return;
    const dataWithUser = {
        ...requestData,
        studentName: currentUser.name,
        room: currentUser.room || 'N/A',
        student: currentUser.id
    };
    try {
      const res = await axios.post(`${API_URL}/service-requests`, dataWithUser);
      setServiceRequests(prev => [res.data, ...prev]);
      addActivity(currentUser.name, `requested service: ${requestData.serviceType}`, 'request');
    } catch (error) { console.error(error); }
  };

  const updateServiceRequestStatus = async (id: string, status: ServiceRequest['status']) => {
    try {
      await axios.patch(`${API_URL}/service-requests/${id}`, { status });
      setServiceRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    } catch (error) { console.error(error); }
  };

  const addLeaveRequest = async (requestData: any) => {
    if (!currentUser) return;
    const dataWithUser = {
        ...requestData,
        studentName: currentUser.name,
        room: currentUser.room || 'N/A',
        student: currentUser.id
    };
    try {
      const res = await axios.post(`${API_URL}/leave-requests`, dataWithUser);
      setLeaveRequests(prev => [res.data, ...prev]);
      addActivity(currentUser.name, `requested leave`, 'request');
    } catch (error) { console.error(error); }
  };

  const updateLeaveRequestStatus = async (id: string, status: LeaveRequest['status']) => {
    try {
      await axios.patch(`${API_URL}/leave-requests/${id}`, { status });
      setLeaveRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    } catch (error) { console.error(error); }
  };

  const addAnnouncement = async (announcementData: any) => {
    try {
      const res = await axios.post(`${API_URL}/announcements`, announcementData);
      setAnnouncements(prev => [res.data, ...prev]);
      addActivity('Admin', `posted announcement: ${announcementData.title}`, 'other');
    } catch (error) { console.error(error); }
  };

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
    } catch (error) { console.error(error); }
  };

  const addPayment = async (paymentData: any) => {
  try {
    const res = await axios.post(`${API_URL}/payments`, paymentData);
    setPayments(prev => [...prev, res.data]);
    
    // Log activity
    const studentName = paymentData.studentName || 'All Students';
    addActivity('Admin', `scheduled fee: ${paymentData.title} for ${studentName}`, 'payment');
  } catch (error) {
    console.error("Error creating payment:", error);
  }
};

  const updatePaymentStatus = async (id: string, status: Payment['status']) => {
    try {
      await axios.patch(`${API_URL}/payments/${id}`, { status });
      setPayments(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    } catch (error) { console.error(error); }
  };

const addUser = async (userData: any) => {
    try {
      // We send the data exactly as the form gives it (including password)
      // The backend /auth/register route will hash it automatically.
      const res = await axios.post(`${API_URL}/auth/register`, { 
        ...userData, 
        role: 'User', // Ensure they are created as a User/Student
        isStudent: true 
      });
      
      // Add the new user to the local list so the table updates immediately
      setUsers(prev => [...prev, res.data.user]);
      
      addActivity('Admin', `created new user account: ${userData.name}`, 'other');
    } catch (error: any) {
      console.error("Error adding user:", error);
      alert(error.response?.data?.message || "Failed to create user");
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/users/${id}`);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (error) { console.error(error); }
  };

  return (
    <DataContext.Provider value={{
      currentUser, isAuthenticated, login, logout,
      users, complaints, serviceRequests, leaveRequests, payments, announcements, recentActivity,
      addComplaint, updateComplaintStatus,
      addServiceRequest, updateServiceRequestStatus,
      addLeaveRequest, updateLeaveRequestStatus,
      addAnnouncement, payBill, updatePaymentStatus, addUser, deleteUser,addPayment 
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};