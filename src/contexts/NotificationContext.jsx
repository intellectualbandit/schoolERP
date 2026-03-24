import { createContext, useContext, useState, useCallback } from 'react';

const STORAGE_KEY = 'schoolerp_notifications';

function loadNotifications() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveNotifications(notifications) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
}

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(loadNotifications);

  const persist = useCallback((next) => {
    setNotifications(next);
    saveNotifications(next);
  }, []);

  const addNotification = useCallback(({ recipientKey, type, title, message, data = {} }) => {
    const notif = {
      id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      recipientKey,
      type,
      title,
      message,
      data,
      read: false,
      createdAt: new Date().toISOString(),
    };
    const updated = [notif, ...loadNotifications()];
    persist(updated);
    return notif;
  }, [persist]);

  const getNotificationsForUser = useCallback((recipientKey) => {
    return notifications.filter(n => n.recipientKey === recipientKey);
  }, [notifications]);

  const getUnreadCount = useCallback((recipientKey) => {
    return notifications.filter(n => n.recipientKey === recipientKey && !n.read).length;
  }, [notifications]);

  const markAsRead = useCallback((id) => {
    const updated = loadNotifications().map(n => n.id === id ? { ...n, read: true } : n);
    persist(updated);
  }, [persist]);

  const markAllRead = useCallback((recipientKey) => {
    const updated = loadNotifications().map(n =>
      n.recipientKey === recipientKey ? { ...n, read: true } : n
    );
    persist(updated);
  }, [persist]);

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      getNotificationsForUser,
      getUnreadCount,
      markAsRead,
      markAllRead,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
