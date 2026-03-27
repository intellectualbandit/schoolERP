import { supabase, isSupabaseConfigured } from '../lib/supabase';

export async function getAnnouncements(filters = {}) {
  if (!isSupabaseConfigured) return [];

  let query = supabase
    .from('announcements')
    .select('*')
    .order('pinned', { ascending: false })
    .order('created_at', { ascending: false });

  if (filters.audience) query = query.eq('audience', filters.audience);

  const { data, error } = await query;
  if (error) throw error;

  return data.map(a => ({
    id: a.id,
    title: a.title,
    body: a.body,
    audience: a.audience,
    pinned: a.pinned,
    author: a.author,
    authorInitials: a.author_initials,
    authorId: a.author_id,
    readCount: a.read_count,
    expiresAt: a.expires_at,
    createdAt: a.created_at,
  }));
}

export async function createAnnouncement(announcement) {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from('announcements')
    .insert({
      title: announcement.title,
      body: announcement.body,
      audience: announcement.audience || 'All',
      pinned: announcement.pinned || false,
      author: announcement.author,
      author_initials: announcement.authorInitials,
      author_id: announcement.authorId,
      expires_at: announcement.expiresAt,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateAnnouncement(id, updates) {
  if (!isSupabaseConfigured) return null;
  const payload = {};
  if (updates.title !== undefined) payload.title = updates.title;
  if (updates.body !== undefined) payload.body = updates.body;
  if (updates.audience !== undefined) payload.audience = updates.audience;
  if (updates.pinned !== undefined) payload.pinned = updates.pinned;
  if (updates.expiresAt !== undefined) payload.expires_at = updates.expiresAt;

  const { data, error } = await supabase
    .from('announcements')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteAnnouncement(id) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from('announcements').delete().eq('id', id);
  if (error) throw error;
}
