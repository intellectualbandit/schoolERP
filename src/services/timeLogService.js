import { supabase, isSupabaseConfigured } from '../lib/supabase';

const EXPECTED_TIME = '07:30';

function todayStr() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function nowTimeStr() {
  const d = new Date();
  return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
}

export async function getTimeLogs(filters = {}) {
  if (!isSupabaseConfigured) return [];

  let query = supabase
    .from('time_logs')
    .select('*')
    .order('date', { ascending: false });

  if (filters.userId) query = query.eq('user_id', filters.userId);
  if (filters.date) query = query.eq('date', filters.date);

  const { data, error } = await query;
  if (error) throw error;

  return data.map(l => ({
    id: l.id,
    userId: l.user_id,
    role: l.role,
    userName: l.user_name,
    date: l.date,
    timeIn: l.time_in?.substring(0, 5),
    timeOut: l.time_out?.substring(0, 5) || null,
    status: l.status,
  }));
}

export async function clockIn(user) {
  if (!isSupabaseConfigured) return null;

  const today = todayStr();
  const timeIn = nowTimeStr();
  const status = timeIn <= EXPECTED_TIME ? 'on-time' : 'late';

  const { data, error } = await supabase
    .from('time_logs')
    .upsert(
      {
        user_id: user.id,
        role: user.role,
        user_name: `${user.firstName} ${user.lastName}`,
        date: today,
        time_in: timeIn,
        status,
      },
      { onConflict: 'user_id,date', ignoreDuplicates: true }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function clockOut(userId) {
  if (!isSupabaseConfigured) return null;

  const today = todayStr();
  const timeOut = nowTimeStr();

  const { data, error } = await supabase
    .from('time_logs')
    .update({ time_out: timeOut })
    .eq('user_id', userId)
    .eq('date', today)
    .is('time_out', null)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getTodayLog(userId) {
  if (!isSupabaseConfigured) return null;

  const { data, error } = await supabase
    .from('time_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('date', todayStr())
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    userId: data.user_id,
    role: data.role,
    userName: data.user_name,
    date: data.date,
    timeIn: data.time_in?.substring(0, 5),
    timeOut: data.time_out?.substring(0, 5) || null,
    status: data.status,
  };
}
