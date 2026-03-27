import { supabase, isSupabaseConfigured } from '../lib/supabase';

export async function getAlumni() {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from('alumni')
    .select('*')
    .order('graduation_year', { ascending: false });

  if (error) throw error;

  return data.map(a => ({
    id: a.id,
    firstName: a.first_name,
    lastName: a.last_name,
    graduationYear: a.graduation_year,
    university: a.university,
    course: a.course,
    scholarship: a.scholarship,
    profession: a.profession,
    status: a.status,
    email: a.email,
    contact: a.contact,
  }));
}

export async function createAlumni(alumni) {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from('alumni')
    .insert({
      first_name: alumni.firstName,
      last_name: alumni.lastName,
      graduation_year: alumni.graduationYear,
      university: alumni.university,
      course: alumni.course,
      scholarship: alumni.scholarship || 'None',
      profession: alumni.profession,
      status: alumni.status || 'Unknown',
      email: alumni.email,
      contact: alumni.contact,
      student_id: alumni.studentId || null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateAlumni(id, updates) {
  if (!isSupabaseConfigured) return null;
  const payload = {};
  if (updates.firstName !== undefined) payload.first_name = updates.firstName;
  if (updates.lastName !== undefined) payload.last_name = updates.lastName;
  if (updates.graduationYear !== undefined) payload.graduation_year = updates.graduationYear;
  if (updates.university !== undefined) payload.university = updates.university;
  if (updates.course !== undefined) payload.course = updates.course;
  if (updates.scholarship !== undefined) payload.scholarship = updates.scholarship;
  if (updates.profession !== undefined) payload.profession = updates.profession;
  if (updates.status !== undefined) payload.status = updates.status;
  if (updates.email !== undefined) payload.email = updates.email;
  if (updates.contact !== undefined) payload.contact = updates.contact;

  const { data, error } = await supabase
    .from('alumni')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteAlumni(id) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from('alumni').delete().eq('id', id);
  if (error) throw error;
}

export async function getAlumniAchievements(alumniId) {
  if (!isSupabaseConfigured) return [];

  let query = supabase
    .from('alumni_achievements')
    .select('*')
    .order('date', { ascending: false });

  if (alumniId) query = query.eq('alumni_id', alumniId);

  const { data, error } = await query;
  if (error) throw error;

  return data.map(a => ({
    id: a.id,
    alumniId: a.alumni_id,
    achievement: a.achievement,
    date: a.date,
    type: a.type,
  }));
}
