import { supabase, isSupabaseConfigured } from '../lib/supabase';

export async function getIncidents(filters = {}) {
  if (!isSupabaseConfigured) return [];

  let query = supabase
    .from('behavior_incidents')
    .select('*, students(id, first_name, last_name, section_id, sections(name))')
    .order('date', { ascending: false });

  if (filters.studentId) query = query.eq('student_id', filters.studentId);
  if (filters.type) query = query.eq('type', filters.type);
  if (filters.studentIds) query = query.in('student_id', filters.studentIds);

  const { data, error } = await query;
  if (error) throw error;

  return data.map(i => ({
    id: i.id,
    studentId: i.student_id,
    studentName: i.students ? `${i.students.first_name} ${i.students.last_name}` : '',
    section: i.students?.sections?.name,
    type: i.type,
    category: i.category,
    description: i.description,
    actionTaken: i.action_taken,
    date: i.date,
    loggedBy: i.logged_by,
  }));
}

export async function createIncident(incident) {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from('behavior_incidents')
    .insert({
      student_id: incident.studentId,
      type: incident.type,
      category: incident.category,
      description: incident.description,
      action_taken: incident.actionTaken,
      date: incident.date || new Date().toISOString().split('T')[0],
      logged_by: incident.loggedBy,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateIncident(id, updates) {
  if (!isSupabaseConfigured) return null;
  const payload = {};
  if (updates.type !== undefined) payload.type = updates.type;
  if (updates.category !== undefined) payload.category = updates.category;
  if (updates.description !== undefined) payload.description = updates.description;
  if (updates.actionTaken !== undefined) payload.action_taken = updates.actionTaken;

  const { data, error } = await supabase
    .from('behavior_incidents')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteIncident(id) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from('behavior_incidents').delete().eq('id', id);
  if (error) throw error;
}
