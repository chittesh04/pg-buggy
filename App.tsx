import React, { useState } from 'react';
import { Header } from './components/Header';
import { LoginCard } from './components/LoginCard';
import { FeatureCard } from './components/FeatureCard';
import { ChatWidget } from './components/ChatWidget';
import { UserLoginForm } from './components/UserLoginForm';
import { AdminLoginForm } from './components/AdminLoginForm';
import { UserDashboard } from './components/UserDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { User, ShieldCheck, LayoutDashboard, Zap, Server } from 'lucide-react';

type ViewState = 'landing' | 'user-login' | 'admin-login' | 'user-dashboard' | 'admin-dashboard';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('landing');

  const handleLoginClick = (role: string) => {
    if (role === 'User') {
      setCurrentView('user-login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (role === 'Admin') {
      setCurrentView('admin-login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackToHome = () => {
    setCurrentView('landing');
  };

  const handleUserLoginSuccess = () => {
    setCurrentView('user-dashboard');
  };

  const handleAdminLoginSuccess = () => {
    setCurrentView('admin-dashboard');
  };

  const handleLogout = () => {
    setCurrentView('landing');
  };

  // User Dashboard View
  if (currentView === 'user-dashboard') {
    return (
      <>
        <UserDashboard onLogout={handleLogout} />
        <ChatWidget />
      </>
    );
  }

  // Admin Dashboard View
  if (currentView === 'admin-dashboard') {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      <main className="flex-grow flex flex-col items-center justify-center px-4 py-12 md:py-16">
        
        {currentView === 'landing' ? (
          <>
            <div className="text-center mb-12 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">
                Welcome to Hostel Portal
              </h2>
              <h3 className="text-blue-600 text-lg md:text-xl font-medium mb-4">
                Manage your hostel life efficiently
              </h3>
              <p className="text-slate-400 text-sm">
                Select your login type to continue
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-6 md:gap-10 w-full max-w-4xl justify-center items-stretch mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
              <LoginCard
                role="User"
                icon={<User size={32} className="text-blue-600" />}
                description="Complaints, Services & More"
                buttonColor="bg-slate-950 hover:bg-slate-800"
                accentColor="bg-blue-50"
                onClick={() => handleLoginClick('User')}
              />
              <LoginCard
                role="Admin"
                icon={<ShieldCheck size={32} className="text-purple-600" />}
                description="Monitor & Control"
                buttonColor="bg-purple-600 hover:bg-purple-700"
                accentColor="bg-purple-50"
                onClick={() => handleLoginClick('Admin')}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl px-2 md:px-0 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-200">
              <FeatureCard
                title="Feature 1"
                description="Easy to use interface"
                subDescription="Fast & Reliable service"
                icon={<LayoutDashboard size={24} />}
              />
              <FeatureCard
                title="Feature 2"
                description="Real-time Notifications"
                subDescription="Stay updated instantly"
                icon={<Zap size={24} />}
              />
              <FeatureCard
                title="Feature 3"
                description="Secure Database"
                subDescription="Your data is safe with us"
                icon={<Server size={24} />}
              />
            </div>
          </>
        ) : currentView === 'user-login' ? (
          <UserLoginForm onBack={handleBackToHome} onLogin={handleUserLoginSuccess} />
        ) : (
          <AdminLoginForm onBack={handleBackToHome} onLogin={handleAdminLoginSuccess} />
        )}

      </main>

      <footer className="py-6 text-center text-slate-400 text-sm">
        © {new Date().getFullYear()} Hostel Management System. All rights reserved.
      </footer>
      
      {currentView === 'landing' && <ChatWidget />}
    </div>
  );
}

export default App;