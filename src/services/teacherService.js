import { supabase, isSupabaseConfigured } from '../lib/supabase';

export async function getTeachers() {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('teachers')
    .select('*')
    .order('full_name');

  if (error) throw error;

  // Fetch sections and schedules for all teachers
  const teacherIds = data.map(t => t.id);

  const [{ data: sections }, { data: schedules }] = await Promise.all([
    supabase
      .from('teacher_sections')
      .select('teacher_id, sections(name), subjects(name)')
      .in('teacher_id', teacherIds),
    supabase
      .from('teacher_schedules')
      .select('teacher_id, day_of_week, time_slot, sections(name), subjects(name)')
      .in('teacher_id', teacherIds),
  ]);

  return data.map(t => {
    const ts = (sections || []).filter(s => s.teacher_id === t.id);
    const sch = (schedules || []).filter(s => s.teacher_id === t.id);

    return {
      id: t.id,
      employeeId: t.employee_id,
      fullName: t.full_name,
      specialization: t.specialization,
      department: t.department,
      employmentType: t.employment_type,
      status: t.status,
      dateHired: t.date_hired,
      contactNumber: t.contact_number,
      email: t.email,
      baseSalary: parseFloat(t.base_salary) || 0,
      transportAllowance: parseFloat(t.transport_allowance) || 0,
      riceAllowance: parseFloat(t.rice_allowance) || 0,
      clothingAllowance: parseFloat(t.clothing_allowance) || 0,
      assignedSections: [...new Set(ts.map(s => s.sections?.name).filter(Boolean))],
      schedule: sch.map(s => ({
        day: s.day_of_week,
        time: s.time_slot,
        subject: s.subjects?.name,
        section: s.sections?.name,
      })),
    };
  });
}

export async function getTeacherById(id) {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from('teachers')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function createTeacher(teacher) {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from('teachers')
    .insert({
      employee_id: teacher.employeeId,
      full_name: teacher.fullName,
      specialization: teacher.specialization,
      department: teacher.department,
      employment_type: teacher.employmentType || 'Full-time',
      status: teacher.status || 'Active',
      date_hired: teacher.dateHired,
      contact_number: teacher.contactNumber,
      email: teacher.email,
      base_salary: teacher.baseSalary || 0,
      transport_allowance: teacher.transportAllowance || 0,
      rice_allowance: teacher.riceAllowance || 0,
      clothing_allowance: teacher.clothingAllowance || 0,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateTeacher(id, updates) {
  if (!isSupabaseConfigured) return null;
  const payload = {};
  if (updates.employeeId !== undefined) payload.employee_id = updates.employeeId;
  if (updates.fullName !== undefined) payload.full_name = updates.fullName;
  if (updates.specialization !== undefined) payload.specialization = updates.specialization;
  if (updates.department !== undefined) payload.department = updates.department;
  if (updates.employmentType !== undefined) payload.employment_type = updates.employmentType;
  if (updates.status !== undefined) payload.status = updates.status;
  if (updates.dateHired !== undefined) payload.date_hired = updates.dateHired;
  if (updates.contactNumber !== undefined) payload.contact_number = updates.contactNumber;
  if (updates.email !== undefined) payload.email = updates.email;
  if (updates.baseSalary !== undefined) payload.base_salary = updates.baseSalary;

  const { data, error } = await supabase
    .from('teachers')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteTeacher(id) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from('teachers').delete().eq('id', id);
  if (error) throw error;
}

export async function updateTeacherSections(teacherId, sectionAssignments) {
  if (!isSupabaseConfigured) return;
  // Delete existing assignments, then insert new ones
  await supabase.from('teacher_sections').delete().eq('teacher_id', teacherId);

  if (sectionAssignments.length > 0) {
    const { error } = await supabase
      .from('teacher_sections')
      .insert(sectionAssignments.map(a => ({
        teacher_id: teacherId,
        section_id: a.sectionId,
        subject_id: a.subjectId,
      })));
    if (error) throw error;
  }
}

export async function updateTeacherSchedule(teacherId, scheduleEntries) {
  if (!isSupabaseConfigured) return;
  await supabase.from('teacher_schedules').delete().eq('teacher_id', teacherId);

  if (scheduleEntries.length > 0) {
    const { error } = await supabase
      .from('teacher_schedules')
      .insert(scheduleEntries.map(s => ({
        teacher_id: teacherId,
        section_id: s.sectionId,
        subject_id: s.subjectId,
        day_of_week: s.day,
        time_slot: s.time,
      })));
    if (error) throw error;
  }
}
