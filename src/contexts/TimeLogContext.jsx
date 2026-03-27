import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { isSupabaseConfigured } from '../lib/supabase';
import * as timeLogService from '../services/timeLogService';

const STORAGE_KEY = 'schoolerp_timelogs';
const EXPECTED_TIME = '07:30';

function loadLogs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLogs(logs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

function todayStr() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function nowTimeStr() {
  const d = new Date();
  return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
}

function determineStatus(timeIn) {
  return timeIn <= EXPECTED_TIME ? 'on-time' : 'late';
}

const TimeLogContext = createContext(null);

export function TimeLogProvider({ children }) {
  const [logs, setLogs] = useState(loadLogs);

  // Load from Supabase on mount
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    timeLogService.getTimeLogs().then(data => {
      if (data) setLogs(data);
    }).catch(console.error);
  }, []);

  const persist = useCallback((next) => {
    setLogs(next);
    if (!isSupabaseConfigured) saveLogs(next);
  }, []);

  const clockIn = useCallback(async (user) => {
    if (isSupabaseConfigured) {
      try {
        const log = await timeLogService.clockIn(user);
        if (log) {
          const data = await timeLogService.getTimeLogs();
          setLogs(data);
          return log;
        }
      } catch (err) {
        console.error('Clock in failed:', err);
      }
      return null;
    }

    // Fallback: localStorage
    const current = loadLogs();
    const today = todayStr();
    const existing = current.find(l => l.userId === user.id && l.date === today);
    if (existing) return existing;

    const timeIn = nowTimeStr();
    const log = {
      id: `tl_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      userId: user.id,
      role: user.role,
      userName: `${user.firstName} ${user.lastName}`,
      date: today,
      timeIn,
      timeOut: null,
      status: determineStatus(timeIn),
    };
    const updated = [log, ...current];
    persist(updated);
    return log;
  }, [persist]);

  const clockOut = useCallback(async (userId) => {
    if (isSupabaseConfigured) {
      try {
        await timeLogService.clockOut(userId);
        const data = await timeLogService.getTimeLogs();
        setLogs(data);
      } catch (err) {
        console.error('Clock out failed:', err);
      }
      return;
    }

    // Fallback: localStorage
    const current = loadLogs();
    const today = todayStr();
    const updated = current.map(l => {
      if (l.userId === userId && l.date === today && !l.timeOut) {
        return { ...l, timeOut: nowTimeStr() };
      }
      return l;
    });
    persist(updated);
  }, [persist]);

  const getTodayLog = useCallback((userId) => {
    return logs.find(l => l.userId === userId && l.date === todayStr()) || null;
  }, [logs]);

  const getLogsForDate = useCallback((date) => {
    return logs.filter(l => l.date === date);
  }, [logs]);

  const getLogsForUser = useCallback((userId) => {
    return logs.filter(l => l.userId === userId);
  }, [logs]);

  const getStats = useCallback((filterLogs) => {
    const target = filterLogs || logs;
    const total = target.length;
    const onTime = target.filter(l => l.status === 'on-time').length;
    const late = target.filter(l => l.status === 'late').length;
    const rate = total > 0 ? Math.round((onTime / total) * 100) : 0;
    return { total, onTime, late, rate };
  }, [logs]);

  return (
    <TimeLogContext.Provider value={{
      logs,
      clockIn,
      clockOut,
      getTodayLog,
      getLogsForDate,
      getLogsForUser,
      getStats,
    }}>
      {children}
    </TimeLogContext.Provider>
  );
}

export function useTimeLogs() {
  const ctx = useContext(TimeLogContext);
  if (!ctx) throw new Error('useTimeLogs must be used within TimeLogProvider');
  return ctx;
}
