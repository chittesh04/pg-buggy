import React from 'react';
import { Bell, Pin, Calendar, Info, AlertTriangle } from 'lucide-react';
import { useMockData, Announcement } from '../services/MockDataContext';

export const AnnouncementsTab: React.FC = () => {
  const { announcements } = useMockData();

  const pinnedAnnouncements = announcements.filter(a => a.isPinned);
  const otherAnnouncements = announcements.filter(a => !a.isPinned);

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'urgent': return { badge: 'bg-red-100 text-red-600', icon: <AlertTriangle size={18} className="text-red-500" />, border: 'border-l-4 border-l-red-500' };
      case 'event': return { badge: 'bg-blue-100 text-blue-600', icon: <Calendar size={18} className="text-blue-500" />, border: 'border-l-4 border-l-blue-500' };
      default: return { badge: 'bg-slate-100 text-slate-600', icon: <Info size={18} className="text-slate-500" />, border: 'border-l-4 border-l-slate-400' };
    }
  };

  const AnnouncementCard: React.FC<{ item: Announcement }> = ({ item }) => {
    const styles = getTypeStyles(item.type);
    
    return (
      <div className={`bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow ${styles.border}`}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            {styles.icon}
            <h3 className="font-semibold text-slate-800">{item.title}</h3>
          </div>
          {item.isPinned && <Pin size={16} className="text-slate-400 rotate-45" />}
        </div>
        <p className="text-slate-600 text-sm mb-4 leading-relaxed">{item.content}</p>
        <div className="flex items-center gap-3 text-xs">
          <span className={`px-2 py-0.5 rounded font-medium ${styles.badge}`}>
            {item.type}
          </span>
          <span className="text-slate-400">{item.date}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Announcements</h2>
          <p className="text-slate-500 text-sm mt-1">Stay updated with hostel news and notices</p>
        </div>
        <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
          <Bell size={18} />
          <span>{announcements.length} Total</span>
        </div>
      </div>

      {pinnedAnnouncements.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4 text-slate-500 text-sm font-medium uppercase tracking-wider">
             <Pin size={14} /> Pinned Announcements
          </div>
          <div className="space-y-4">
            {pinnedAnnouncements.map(item => (
              <AnnouncementCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="mb-4 text-slate-500 text-sm font-medium uppercase tracking-wider">
          All Announcements
        </div>
        <div className="space-y-4">
          {otherAnnouncements.map(item => (
            <AnnouncementCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};