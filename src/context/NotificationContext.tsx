import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

type NotificationType = 'success' | 'error' | 'info';

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
}

interface NotificationContextType {
  showNotification: (message: string, type?: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback((message: string, type: NotificationType = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000); // clear after 5s
  }, []);

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <div className="fixed top-24 right-8 z-[9999] flex flex-col gap-3 pointer-events-none">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 bg-white rounded-xl shadow-lg border-l-4 min-w-[300px] max-w-[400px] animate-fadeIn ${
              notif.type === 'success' ? 'border-[#606934] text-[#606934]' :
              notif.type === 'error' ? 'border-red-500 text-red-600' :
              'border-[#214573] text-[#214573]'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {notif.type === 'success' ? <CheckCircle size={18} /> :
               notif.type === 'error' ? <AlertCircle size={18} /> :
               <Info size={18} />}
            </div>
            <div className="flex-1 text-[12px] font-bold mt-0.5 text-slate-700">
              {notif.message}
            </div>
            <button
              onClick={() => removeNotification(notif.id)}
              className="shrink-0 text-slate-400 hover:text-slate-600 p-1"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
