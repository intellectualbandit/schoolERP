import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { isSupabaseConfigured } from '../lib/supabase';
import * as notifService from '../services/notificationService';

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
  const unsubRef = useRef(null);

  const persist = useCallback((next) => {
    setNotifications(next);
    if (!isSupabaseConfigured) saveNotifications(next);
  }, []);

  // Load notifications for a user from Supabase
  const loadForUser = useCallback(async (recipientKey) => {
    if (!isSupabaseConfigured || !recipientKey) return;
    try {
      const data = await notifService.getNotifications(recipientKey);
      setNotifications(data);

      // Subscribe to real-time updates
      unsubRef.current?.();
      unsubRef.current = notifService.subscribeToNotifications(recipientKey, (newNotif) => {
        setNotifications(prev => [newNotif, ...prev]);
      });
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  }, []);

  useEffect(() => {
    return () => { unsubRef.current?.(); };
  }, []);

  const addNotification = useCallback(async ({ recipientKey, type, title, message, data: payload = {} }) => {
    if (isSupabaseConfigured) {
      try {
        const notif = await notifService.addNotification({ recipientKey, type, title, message, data: payload });
        return notif;
      } catch (err) {
        console.error('Failed to add notification:', err);
        return null;
      }
    }

    // Fallback: localStorage
    const notif = {
      id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      recipientKey,
      type,
      title,
      message,
      data: payload,
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

  const markAsRead = useCallback(async (id) => {
    if (isSupabaseConfigured) {
      try {
        await notifService.markAsRead(id);
      } catch (err) {
        console.error('Failed to mark as read:', err);
      }
    }
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    persist(updated);
  }, [notifications, persist]);

  const markAllRead = useCallback(async (recipientKey) => {
    if (isSupabaseConfigured) {
      try {
        await notifService.markAllRead(recipientKey);
      } catch (err) {
        console.error('Failed to mark all read:', err);
      }
    }
    const updated = notifications.map(n =>
      n.recipientKey === recipientKey ? { ...n, read: true } : n
    );
    persist(updated);
  }, [notifications, persist]);

  return (
    <NotificationContext.Provider value={{
      notifications,
      loadForUser,
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
