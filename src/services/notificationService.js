import { supabase, isSupabaseConfigured } from '../lib/supabase';

export async function getNotifications(recipientKey) {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .or(`recipient_key.eq.${recipientKey}`)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map(n => ({
    id: n.id,
    recipientKey: n.recipient_key,
    type: n.type,
    title: n.title,
    message: n.message,
    data: n.data,
    read: n.read,
    createdAt: n.created_at,
  }));
}

export async function addNotification({ recipientKey, type, title, message, data: payload = {} }) {
  if (!isSupabaseConfigured) return null;

  const { data, error } = await supabase
    .from('notifications')
    .insert({
      recipient_key: recipientKey,
      type,
      title,
      message,
      data: payload,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function markAsRead(id) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', id);
  if (error) throw error;
}

export async function markAllRead(recipientKey) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('recipient_key', recipientKey)
    .eq('read', false);
  if (error) throw error;
}

/**
 * Subscribe to real-time notification inserts for a recipient.
 * Returns an unsubscribe function.
 */
export function subscribeToNotifications(recipientKey, onNew) {
  if (!isSupabaseConfigured) return () => {};

  const channel = supabase
    .channel(`notifications:${recipientKey}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `recipient_key=eq.${recipientKey}`,
      },
      (payload) => {
        onNew({
          id: payload.new.id,
          recipientKey: payload.new.recipient_key,
          type: payload.new.type,
          title: payload.new.title,
          message: payload.new.message,
          data: payload.new.data,
          read: payload.new.read,
          createdAt: payload.new.created_at,
        });
      }
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}
