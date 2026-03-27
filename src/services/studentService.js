import { supabase, isSupabaseConfigured } from '../lib/supabase';

export async function getStudents(filters = {}) {
  if (!isSupabaseConfigured) return [];
  let query = supabase
    .from('students')
    .select(`
      *,
      grade_levels(id, name),
      sections(id, name)
    `)
    .order('last_name');

  if (filters.sectionId) query = query.eq('section_id', filters.sectionId);
  if (filters.gradeLevelId) query = query.eq('grade_level_id', filters.gradeLevelId);
  if (filters.status) query = query.eq('status', filters.status);

  const { data, error } = await query;
  if (error) throw error;

  return data.map(s => ({
    id: s.id,
    lrn: s.lrn,
    firstName: s.first_name,
    middleName: s.middle_name,
    lastName: s.last_name,
    dateOfBirth: s.date_of_birth,
    gender: s.gender,
    gradeLevel: s.grade_levels?.name,
    gradeLevelId: s.grade_level_id,
    section: s.sections?.name,
    sectionId: s.section_id,
    status: s.status,
    guardianName: s.guardian_name,
    guardianContact: s.guardian_contact,
    enrolledDate: s.enrolled_date,
  }));
}

export async function getStudentById(id) {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from('students')
    .select('*, grade_levels(name), sections(name)')
    .eq('id', id)
    .single();

  if (error) throw error;
  return {
    id: data.id,
    lrn: data.lrn,
    firstName: data.first_name,
    middleName: data.middle_name,
    lastName: data.last_name,
    dateOfBirth: data.date_of_birth,
    gender: data.gender,
    gradeLevel: data.grade_levels?.name,
    gradeLevelId: data.grade_level_id,
    section: data.sections?.name,
    sectionId: data.section_id,
    status: data.status,
    guardianName: data.guardian_name,
    guardianContact: data.guardian_contact,
    enrolledDate: data.enrolled_date,
  };
}

export async function createStudent(student) {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from('students')
    .insert({
      lrn: student.lrn,
      first_name: student.firstName,
      middle_name: student.middleName,
      last_name: student.lastName,
      date_of_birth: student.dateOfBirth,
      gender: student.gender,
      grade_level_id: student.gradeLevelId,
      section_id: student.sectionId,
      status: student.status || 'Active',
      guardian_name: student.guardianName,
      guardian_contact: student.guardianContact,
      enrolled_date: student.enrolledDate || new Date().toISOString().split('T')[0],
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateStudent(id, updates) {
  if (!isSupabaseConfigured) return null;
  const payload = {};
  if (updates.lrn !== undefined) payload.lrn = updates.lrn;
  if (updates.firstName !== undefined) payload.first_name = updates.firstName;
  if (updates.middleName !== undefined) payload.middle_name = updates.middleName;
  if (updates.lastName !== undefined) payload.last_name = updates.lastName;
  if (updates.dateOfBirth !== undefined) payload.date_of_birth = updates.dateOfBirth;
  if (updates.gender !== undefined) payload.gender = updates.gender;
  if (updates.gradeLevelId !== undefined) payload.grade_level_id = updates.gradeLevelId;
  if (updates.sectionId !== undefined) payload.section_id = updates.sectionId;
  if (updates.status !== undefined) payload.status = updates.status;
  if (updates.guardianName !== undefined) payload.guardian_name = updates.guardianName;
  if (updates.guardianContact !== undefined) payload.guardian_contact = updates.guardianContact;

  const { data, error } = await supabase
    .from('students')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteStudent(id) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from('students').delete().eq('id', id);
  if (error) throw error;
}
