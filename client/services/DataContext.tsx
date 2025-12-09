import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// --- Configuration ---
// Ensure this matches your backend port
// const API_URL = 'http://localhost:5000/api';
// --- ADD THIS LINE HERE ---
axios.defaults.headers.common['ngrok-skip-browser-warning'] = 'true'; 

// --- Configuration ---
// Make sure this is still your BACKEND ngrok URL
const API_URL = 'https://vermicular-microbiologically-hanh.ngrok-free.dev/api';
// --- Interfaces ---
export interface User {
  id: string;
  name: string;
  email: string;
  room?: string;
  role: 'Admin' | 'User';
  contact?: string; // Added contact field
  token?: string;
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
      // Ensure the restored user has an ID property
      if (!user.id && user._id) user.id = user._id;
      
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
        return false;
      }

      const { token, user } = res.data;
      
      // Normalize user ID immediately
      if (!user.id && user._id) user.id = user._id;

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
    setUsers([]);
    setComplaints([]);
    setServiceRequests([]);
    setLeaveRequests([]);
    setPayments([]);
    setAnnouncements([]);
    setRecentActivity([]);
  };

  // --- Helper: Normalize MongoDB _id to id ---
  // This is the CRITICAL FIX for dropdowns and updates
  const normalizeId = (data: any[]) => {
    return data.map(item => ({
      ...item,
      id: item._id || item.id // Use _id if available, fallback to id
    }));
  };

  // --- Data Fetching ---
  const fetchData = async () => {
    try {
      const [usersRes, complaintsRes, serviceRes, leaveRes, paymentsRes, announceRes] = await Promise.all([
        axios.get(`${API_URL}/users`),
        axios.get(`${API_URL}/complaints`),
        axios.get(`${API_URL}/service-requests`),
        axios.get(`${API_URL}/leave-requests`),
        axios.get(`${API_URL}/payments`),
        axios.get(`${API_URL}/announcements`)
      ]);

      // Apply normalization to all fetched data
      setUsers(normalizeId(usersRes.data));
      setComplaints(normalizeId(complaintsRes.data));
      setServiceRequests(normalizeId(serviceRes.data));
      setLeaveRequests(normalizeId(leaveRes.data));
      setPayments(normalizeId(paymentsRes.data));
      setAnnouncements(normalizeId(announceRes.data));
    } catch (error) {
      console.error("Error fetching data:", error);
      // If unauthorized, logout
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        logout();
      }
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

  // --- Actions ---

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
      // Use _id from response as id
      const newItem = { ...res.data, id: res.data._id };
      setComplaints(prev => [newItem, ...prev]);
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
      const newItem = { ...res.data, id: res.data._id };
      setServiceRequests(prev => [newItem, ...prev]);
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
      const newItem = { ...res.data, id: res.data._id };
      setLeaveRequests(prev => [newItem, ...prev]);
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
      const newItem = { ...res.data, id: res.data._id };
      setAnnouncements(prev => [newItem, ...prev]);
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
      // CRITICAL FIX: Ensure new payment has 'id' property so it works in UI immediately
      const newItem = { ...res.data, id: res.data._id };
      setPayments(prev => [...prev, newItem]);
      
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
      const res = await axios.post(`${API_URL}/auth/register`, { 
        ...userData, 
        role: 'User', 
        isStudent: true 
      });
      
      const newUser = res.data.user;
      // CRITICAL FIX: Ensure new user has 'id' property so it works in UI immediately
      const safeUser = { ...newUser, id: newUser.id || newUser._id };
      
      setUsers(prev => [...prev, safeUser]);
      addActivity('Admin', `created new user account: ${userData.name}`, 'other');
    } catch (error: any) {
      console.error("Error adding user:", error);
      alert(error.response?.data?.message || "Failed to create user");
    }
  };

const deleteUser = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/users/${id}`);
      
      // 1. Remove User from state
      setUsers(prev => prev.filter(u => u.id !== id));

      // 2. Remove associated data from local state so UI updates instantly
      setComplaints(prev => prev.filter(c => (c as any).student !== id));
      setServiceRequests(prev => prev.filter(s => (s as any).student !== id));
      setLeaveRequests(prev => prev.filter(l => (l as any).student !== id));
      setPayments(prev => prev.filter(p => (p as any).student !== id));

      addActivity('Admin', 'deleted a user and their data', 'other');
      
    } catch (error) { 
      console.error(error); 
      alert("Failed to delete user data");
    }
  };

  
  return (
    <DataContext.Provider value={{
      currentUser, isAuthenticated, login, logout,
      users, complaints, serviceRequests, leaveRequests, payments, announcements, recentActivity,
      addComplaint, updateComplaintStatus,
      addServiceRequest, updateServiceRequestStatus,
      addLeaveRequest, updateLeaveRequestStatus,
      addAnnouncement, payBill, updatePaymentStatus, addUser, deleteUser, addPayment 
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