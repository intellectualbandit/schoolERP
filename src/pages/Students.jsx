import { useState, useEffect, useMemo } from 'react';
import { Search, Download, Plus, Eye, Trash2, AlertTriangle, BarChart3, CreditCard, UserPlus, Users, UserCheck, UserX, CalendarPlus, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../components/ui/sheet';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Separator } from '../components/ui/separator';
import { Label } from '../components/ui/label';
import { Skeleton } from '../components/ui/skeleton';
import { Checkbox } from '../components/ui/checkbox';
import { Progress } from '../components/ui/progress';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';

// --- Sample Data ---
const initialStudents = [
  {
    id: 1,
    lrn: '136482790001',
    firstName: 'Juan',
    middleName: 'Santos',
    lastName: 'Dela Cruz',
    dateOfBirth: '2011-03-15',
    gender: 'Male',
    gradeLevel: 'Grade 7',
    section: 'Rizal',
    status: 'Active',
    guardianName: 'Maria Dela Cruz',
    guardianContact: '09171234567',
    enrolledDate: '2024-06-10',
    grades: [
      { subject: 'Filipino', q1: 88, q2: 85, q3: 90, q4: 87 },
      { subject: 'English', q1: 82, q2: 80, q3: 78, q4: 84 },
      { subject: 'Mathematics', q1: 91, q2: 89, q3: 93, q4: 90 },
      { subject: 'Science', q1: 86, q2: 84, q3: 88, q4: 85 },
      { subject: 'Araling Panlipunan', q1: 90, q2: 88, q3: 91, q4: 89 },
    ],
    attendance: { present: 160, absent: 8, late: 12, total: 180 },
    fees: [
      { type: 'Tuition', amount: 15000, paid: 15000, status: 'Paid' },
      { type: 'Miscellaneous', amount: 3500, paid: 3500, status: 'Paid' },
      { type: 'Laboratory', amount: 2000, paid: 1000, status: 'Partial' },
    ],
  },
  {
    id: 2,
    lrn: '136482790002',
    firstName: 'Maria',
    middleName: 'Reyes',
    lastName: 'Santos',
    dateOfBirth: '2010-07-22',
    gender: 'Female',
    gradeLevel: 'Grade 8',
    section: 'Bonifacio',
    status: 'Active',
    guardianName: 'Pedro Santos',
    guardianContact: '09181234568',
    enrolledDate: '2023-06-12',
    grades: [
      { subject: 'Filipino', q1: 92, q2: 94, q3: 91, q4: 93 },
      { subject: 'English', q1: 95, q2: 93, q3: 96, q4: 94 },
      { subject: 'Mathematics', q1: 88, q2: 90, q3: 87, q4: 89 },
      { subject: 'Science', q1: 91, q2: 89, q3: 92, q4: 90 },
      { subject: 'Araling Panlipunan', q1: 93, q2: 95, q3: 94, q4: 92 },
    ],
    attendance: { present: 172, absent: 3, late: 5, total: 180 },
    fees: [
      { type: 'Tuition', amount: 15000, paid: 15000, status: 'Paid' },
      { type: 'Miscellaneous', amount: 3500, paid: 3500, status: 'Paid' },
    ],
  },
  {
    id: 3,
    lrn: '136482790003',
    firstName: 'Andres',
    middleName: 'Luna',
    lastName: 'Bautista',
    dateOfBirth: '2009-11-05',
    gender: 'Male',
    gradeLevel: 'Grade 9',
    section: 'Mabini',
    status: 'Active',
    guardianName: 'Rosa Bautista',
    guardianContact: '09191234569',
    enrolledDate: '2022-06-08',
    grades: [
      { subject: 'Filipino', q1: 78, q2: 80, q3: 76, q4: 79 },
      { subject: 'English', q1: 74, q2: 72, q3: 75, q4: 73 },
      { subject: 'Mathematics', q1: 70, q2: 68, q3: 72, q4: 71 },
      { subject: 'Science', q1: 76, q2: 74, q3: 78, q4: 75 },
      { subject: 'Araling Panlipunan', q1: 80, q2: 82, q3: 79, q4: 81 },
    ],
    attendance: { present: 150, absent: 18, late: 12, total: 180 },
    fees: [
      { type: 'Tuition', amount: 15000, paid: 10000, status: 'Partial' },
      { type: 'Miscellaneous', amount: 3500, paid: 0, status: 'Unpaid' },
    ],
  },
  {
    id: 4,
    lrn: '136482790004',
    firstName: 'Gabriela',
    middleName: 'Aquino',
    lastName: 'Reyes',
    dateOfBirth: '2008-01-19',
    gender: 'Female',
    gradeLevel: 'Grade 10',
    section: 'Aguinaldo',
    status: 'Active',
    guardianName: 'Jose Reyes',
    guardianContact: '09201234570',
    enrolledDate: '2021-06-14',
    grades: [
      { subject: 'Filipino', q1: 95, q2: 97, q3: 94, q4: 96 },
      { subject: 'English', q1: 98, q2: 96, q3: 97, q4: 95 },
      { subject: 'Mathematics', q1: 92, q2: 94, q3: 93, q4: 91 },
      { subject: 'Science', q1: 96, q2: 94, q3: 95, q4: 97 },
      { subject: 'Araling Panlipunan', q1: 94, q2: 96, q3: 95, q4: 93 },
    ],
    attendance: { present: 175, absent: 2, late: 3, total: 180 },
    fees: [
      { type: 'Tuition', amount: 15000, paid: 15000, status: 'Paid' },
      { type: 'Miscellaneous', amount: 3500, paid: 3500, status: 'Paid' },
      { type: 'Laboratory', amount: 2000, paid: 2000, status: 'Paid' },
    ],
  },
  {
    id: 5,
    lrn: '136482790005',
    firstName: 'Jose',
    middleName: 'Garcia',
    lastName: 'Rizal',
    dateOfBirth: '2011-06-30',
    gender: 'Male',
    gradeLevel: 'Grade 7',
    section: 'Rizal',
    status: 'Inactive',
    guardianName: 'Teodora Rizal',
    guardianContact: '09211234571',
    enrolledDate: '2024-06-10',
    grades: [
      { subject: 'Filipino', q1: 85, q2: 83, q3: 86, q4: 84 },
      { subject: 'English', q1: 80, q2: 78, q3: 82, q4: 79 },
      { subject: 'Mathematics', q1: 77, q2: 75, q3: 79, q4: 76 },
    ],
    attendance: { present: 90, absent: 40, late: 10, total: 140 },
    fees: [
      { type: 'Tuition', amount: 15000, paid: 7500, status: 'Partial' },
      { type: 'Miscellaneous', amount: 3500, paid: 0, status: 'Unpaid' },
    ],
  },
  {
    id: 6,
    lrn: '136482790006',
    firstName: 'Corazon',
    middleName: 'Mercado',
    lastName: 'Aquino',
    dateOfBirth: '2010-02-14',
    gender: 'Female',
    gradeLevel: 'Grade 8',
    section: 'Bonifacio',
    status: 'Active',
    guardianName: 'Benigno Aquino',
    guardianContact: '09221234572',
    enrolledDate: '2023-06-12',
    grades: [
      { subject: 'Filipino', q1: 89, q2: 91, q3: 88, q4: 90 },
      { subject: 'English', q1: 87, q2: 85, q3: 89, q4: 86 },
      { subject: 'Mathematics', q1: 83, q2: 81, q3: 85, q4: 82 },
      { subject: 'Science', q1: 88, q2: 86, q3: 90, q4: 87 },
      { subject: 'Araling Panlipunan', q1: 91, q2: 89, q3: 92, q4: 90 },
    ],
    attendance: { present: 168, absent: 5, late: 7, total: 180 },
    fees: [
      { type: 'Tuition', amount: 15000, paid: 15000, status: 'Paid' },
      { type: 'Miscellaneous', amount: 3500, paid: 2000, status: 'Partial' },
    ],
  },
  {
    id: 7,
    lrn: '136482790007',
    firstName: 'Emilio',
    middleName: 'Jacinto',
    lastName: 'Aguinaldo',
    dateOfBirth: '2009-09-12',
    gender: 'Male',
    gradeLevel: 'Grade 9',
    section: 'Mabini',
    status: 'Active',
    guardianName: 'Hilaria Aguinaldo',
    guardianContact: '09231234573',
    enrolledDate: '2025-06-09',
    grades: [],
    attendance: { present: 0, absent: 0, late: 0, total: 0 },
    fees: [],
  },
  {
    id: 8,
    lrn: '136482790008',
    firstName: 'Leni',
    middleName: 'Gerona',
    lastName: 'Robredo',
    dateOfBirth: '2008-04-23',
    gender: 'Female',
    gradeLevel: 'Grade 10',
    section: 'Aguinaldo',
    status: 'Active',
    guardianName: 'Jesse Robredo',
    guardianContact: '09241234574',
    enrolledDate: '2025-06-09',
    grades: [],
    attendance: { present: 0, absent: 0, late: 0, total: 0 },
    fees: [],
  },
  {
    id: 9,
    lrn: '136482790009',
    firstName: 'Manuel',
    middleName: 'Tinio',
    lastName: 'Quezon',
    dateOfBirth: '2011-08-19',
    gender: 'Male',
    gradeLevel: 'Grade 7',
    section: 'Rizal',
    status: 'Active',
    guardianName: 'Aurora Quezon',
    guardianContact: '09251234575',
    enrolledDate: '2025-07-01',
    grades: [],
    attendance: { present: 0, absent: 0, late: 0, total: 0 },
    fees: [],
  },
  {
    id: 10,
    lrn: '136482790010',
    firstName: 'Josefa',
    middleName: 'Llanes',
    lastName: 'Escoda',
    dateOfBirth: '2010-09-20',
    gender: 'Female',
    gradeLevel: 'Grade 8',
    section: 'Bonifacio',
    status: 'Inactive',
    guardianName: 'Antonio Escoda',
    guardianContact: '09261234576',
    enrolledDate: '2023-06-12',
    grades: [
      { subject: 'Filipino', q1: 81, q2: 79, q3: 83, q4: 80 },
      { subject: 'English', q1: 76, q2: 74, q3: 78, q4: 75 },
      { subject: 'Mathematics', q1: 73, q2: 71, q3: 74, q4: 72 },
      { subject: 'Science', q1: 79, q2: 77, q3: 80, q4: 78 },
    ],
    attendance: { present: 100, absent: 50, late: 10, total: 160 },
    fees: [
      { type: 'Tuition', amount: 15000, paid: 5000, status: 'Partial' },
      { type: 'Miscellaneous', amount: 3500, paid: 0, status: 'Unpaid' },
      { type: 'Laboratory', amount: 2000, paid: 0, status: 'Unpaid' },
    ],
  },
];

const gradeOptions = ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'];
const sectionOptions = ['Rizal', 'Bonifacio', 'Mabini', 'Aguinaldo'];
const statusOptions = ['Active', 'Inactive'];

const emptyForm = {
  firstName: '',
  lastName: '',
  middleName: '',
  lrn: '',
  dateOfBirth: '',
  gender: '',
  gradeLevel: '',
  section: '',
  guardianName: '',
  guardianContact: '',
};

// --- Helpers ---
function getInitials(student) {
  return (
    (student.firstName?.[0] || '') + (student.lastName?.[0] || '')
  ).toUpperCase();
}

function getStatusBadgeClass(status) {
  return status === 'Active'
    ? 'bg-green-100 text-green-700'
    : 'bg-red-100 text-red-700';
}

function exportToCSV(list) {
  const headers = ['LRN', 'First Name', 'Middle Name', 'Last Name', 'Date of Birth', 'Gender', 'Grade Level', 'Section', 'Status', 'Guardian Name', 'Guardian Contact', 'Enrolled Date'];
  const rows = list.map(s => [s.lrn, s.firstName, s.middleName, s.lastName, s.dateOfBirth, s.gender, s.gradeLevel, s.section, s.status, s.guardianName, s.guardianContact, s.enrolledDate]);
  const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'students.csv';
  link.click();
  URL.revokeObjectURL(url);
}

// --- Component ---
export default function Students() {
  const { user, isReadOnly: checkReadOnly } = useAuth();
  const readOnly = checkReadOnly('students');
  const [students, setStudents] = useState(initialStudents);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  const [filterSection, setFilterSection] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [viewStudent, setViewStudent] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Simulated loading
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  // Toast auto-dismiss
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  // Filtered students
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        s.firstName.toLowerCase().includes(q) ||
        s.middleName.toLowerCase().includes(q) ||
        s.lastName.toLowerCase().includes(q) ||
        s.lrn.includes(q) ||
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(q);
      const matchesGrade = !filterGrade || s.gradeLevel === filterGrade;
      const matchesSection = !filterSection || s.section === filterSection;
      const matchesStatus = !filterStatus || s.status === filterStatus;
      return matchesSearch && matchesGrade && matchesSection && matchesStatus;
    });
  }, [students, search, filterGrade, filterSection, filterStatus]);

  // Stats
  const totalStudents = students.length;
  const activeCount = students.filter(s => s.status === 'Active').length;
  const inactiveCount = students.filter(s => s.status === 'Inactive').length;
  const newThisYear = students.filter(s => s.enrolledDate >= '2025-06-01').length;

  const allOnPageSelected =
    filteredStudents.length > 0 &&
    filteredStudents.every(s => selectedIds.has(s.id));

  // --- Handlers ---
  function handleAddStudent() {
    const errors = {};
    if (!newStudent.firstName.trim()) errors.firstName = 'Required';
    if (!newStudent.lastName.trim()) errors.lastName = 'Required';
    if (!newStudent.lrn.trim()) {
      errors.lrn = 'Required';
    } else if (!/^\d{12}$/.test(newStudent.lrn.trim())) {
      errors.lrn = 'Must be 12 digits';
    } else if (students.some(s => s.lrn === newStudent.lrn.trim())) {
      errors.lrn = 'LRN already exists';
    }
    if (!newStudent.dateOfBirth) errors.dateOfBirth = 'Required';
    if (!newStudent.gender) errors.gender = 'Required';
    if (!newStudent.gradeLevel) errors.gradeLevel = 'Required';
    if (!newStudent.section) errors.section = 'Required';
    if (!newStudent.guardianName.trim()) errors.guardianName = 'Required';
    if (!newStudent.guardianContact.trim()) errors.guardianContact = 'Required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const created = {
      ...newStudent,
      firstName: newStudent.firstName.trim(),
      lastName: newStudent.lastName.trim(),
      middleName: newStudent.middleName.trim(),
      lrn: newStudent.lrn.trim(),
      guardianName: newStudent.guardianName.trim(),
      guardianContact: newStudent.guardianContact.trim(),
      id: Date.now(),
      status: 'Active',
      enrolledDate: new Date().toISOString().split('T')[0],
      grades: [],
      attendance: { present: 0, absent: 0, late: 0, total: 0 },
      fees: [],
    };

    setStudents(prev => [...prev, created]);
    setShowAddModal(false);
    setNewStudent(emptyForm);
    setFormErrors({});
    setToast({ message: 'Student added successfully', type: 'success' });
  }

  // TODO: Role check — only Admin and Registrar should be able to delete students
  function handleDeleteStudent(id) {
    setConfirmDelete(id);
  }

  function confirmAndDelete() {
    setStudents(prev => prev.filter(s => s.id !== confirmDelete));
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.delete(confirmDelete);
      return next;
    });
    if (viewStudent?.id === confirmDelete) setViewStudent(null);
    setConfirmDelete(null);
    setToast({ message: 'Student deleted', type: 'success' });
  }

  // TODO: Role check — only Admin should be able to bulk-change status
  function handleBulkAction(action) {
    const ids = selectedIds;
    if (action === 'export') {
      const selected = students.filter(s => ids.has(s.id));
      exportToCSV(selected);
      setToast({ message: `Exported ${selected.length} student(s)`, type: 'success' });
    } else if (action === 'activate') {
      setStudents(prev =>
        prev.map(s => (ids.has(s.id) ? { ...s, status: 'Active' } : s))
      );
      setToast({ message: `${ids.size} student(s) activated`, type: 'success' });
    } else if (action === 'deactivate') {
      setStudents(prev =>
        prev.map(s => (ids.has(s.id) ? { ...s, status: 'Inactive' } : s))
      );
      setToast({ message: `${ids.size} student(s) deactivated`, type: 'success' });
    }
    setSelectedIds(new Set());
  }

  function toggleSelectAll() {
    if (allOnPageSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredStudents.map(s => s.id)));
    }
  }

  function toggleSelectOne(id) {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // --- Loading skeleton ---
  if (isLoading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-7 w-32" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
        <Card>
          <CardContent className="p-4 space-y-2">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- Render ---
  return (
    <div>
      {/* A. Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <h2 className="text-xl font-semibold text-gray-800">Students</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportToCSV(students)}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          {!readOnly && (
            <Button size="sm" onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          )}
        </div>
      </div>

      {/* B. Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-indigo-50 border-indigo-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-indigo-600/70">Total Students</CardTitle>
            <Users className="h-4 w-4 text-indigo-600/70" />
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0">
            <p className="text-2xl font-bold text-indigo-700">{totalStudents}</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-green-600/70">Active</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600/70" />
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0">
            <p className="text-2xl font-bold text-green-700">{activeCount}</p>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-red-600/70">Inactive</CardTitle>
            <UserX className="h-4 w-4 text-red-600/70" />
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0">
            <p className="text-2xl font-bold text-red-700">{inactiveCount}</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-amber-600/70">New This Year</CardTitle>
            <CalendarPlus className="h-4 w-4 text-amber-600/70" />
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0">
            <p className="text-2xl font-bold text-amber-700">{newThisYear}</p>
          </CardContent>
        </Card>
      </div>

      {/* C. Search + Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name or LRN..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={filterGrade}
          onChange={e => setFilterGrade(e.target.value)}
        >
          <option value="">All Grades</option>
          {gradeOptions.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </Select>
        <Select
          value={filterSection}
          onChange={e => setFilterSection(e.target.value)}
        >
          <option value="">All Sections</option>
          {sectionOptions.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
        <Select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
        >
          <option value="">All Status</option>
          {statusOptions.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
      </div>

      {/* Bulk actions bar */}
      {selectedIds.size > 0 && (
        <div className="flex flex-wrap items-center gap-3 mb-4 px-4 py-3 bg-indigo-50 rounded-lg border border-indigo-200">
          <span className="text-sm font-medium text-indigo-700">
            {selectedIds.size} student(s) selected
          </span>
          <Button
            variant="outline"
            size="sm"
            className="text-indigo-700 border-indigo-300 hover:bg-indigo-100"
            onClick={() => handleBulkAction('export')}
          >
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-green-700 border-green-300 hover:bg-green-100"
            onClick={() => handleBulkAction('activate')}
          >
            <UserCheck className="h-3.5 w-3.5 mr-1.5" />
            Activate
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-700 border-red-300 hover:bg-red-100"
            onClick={() => handleBulkAction('deactivate')}
          >
            <UserX className="h-3.5 w-3.5 mr-1.5" />
            Deactivate
          </Button>
        </div>
      )}

      {/* D. Students Table */}
      <Card className="mb-4">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={allOnPageSelected}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider">LRN</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider">Full Name</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider">Grade Level</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider">Section</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider">Gender</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider">Status</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-16">
                  <Users className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground font-medium">No students found</p>
                  <p className="text-muted-foreground/70 text-sm mt-1">Try adjusting your search or filters</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map(s => (
                <TableRow key={s.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(s.id)}
                      onCheckedChange={() => toggleSelectOne(s.id)}
                    />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground font-mono">{s.lrn}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs font-bold">
                          {getInitials(s)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">
                        {s.lastName}, {s.firstName} {s.middleName?.[0] ? `${s.middleName[0]}.` : ''}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{s.gradeLevel}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{s.section}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{s.gender}</TableCell>
                  <TableCell>
                    <Badge
                      variant={s.status === 'Active' ? 'success' : 'destructive'}
                      className={getStatusBadgeClass(s.status)}
                    >
                      {s.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-indigo-600 hover:text-indigo-800"
                        onClick={() => { setViewStudent(s); setActiveTab('profile'); }}
                        title="View student"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {!readOnly && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteStudent(s.id)}
                          title="Delete student"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Results count */}
      {filteredStudents.length > 0 && (
        <p className="text-xs text-muted-foreground mb-6">
          Showing {filteredStudents.length} of {totalStudents} student(s)
        </p>
      )}

      {/* E. Add Student Modal */}
      <Dialog open={showAddModal} onOpenChange={(open) => {
        if (!open) {
          setShowAddModal(false);
          setNewStudent(emptyForm);
          setFormErrors({});
        }
      }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription>
              Fill in the details below to enroll a new student.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={newStudent.firstName}
                  onChange={e => setNewStudent(p => ({ ...p, firstName: e.target.value }))}
                  className={cn(formErrors.firstName && 'border-red-400')}
                />
                {formErrors.firstName && <p className="text-xs text-red-500">{formErrors.firstName}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={newStudent.lastName}
                  onChange={e => setNewStudent(p => ({ ...p, lastName: e.target.value }))}
                  className={cn(formErrors.lastName && 'border-red-400')}
                />
                {formErrors.lastName && <p className="text-xs text-red-500">{formErrors.lastName}</p>}
              </div>
            </div>
            {/* Middle name */}
            <div className="space-y-2">
              <Label htmlFor="middleName">Middle Name</Label>
              <Input
                id="middleName"
                type="text"
                value={newStudent.middleName}
                onChange={e => setNewStudent(p => ({ ...p, middleName: e.target.value }))}
              />
            </div>
            {/* LRN */}
            <div className="space-y-2">
              <Label htmlFor="lrn">LRN (Learner Reference Number) *</Label>
              <Input
                id="lrn"
                type="text"
                maxLength={12}
                value={newStudent.lrn}
                onChange={e => setNewStudent(p => ({ ...p, lrn: e.target.value }))}
                className={cn(formErrors.lrn && 'border-red-400')}
                placeholder="12-digit number"
              />
              {formErrors.lrn && <p className="text-xs text-red-500">{formErrors.lrn}</p>}
            </div>
            {/* DOB + Gender */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={newStudent.dateOfBirth}
                  onChange={e => setNewStudent(p => ({ ...p, dateOfBirth: e.target.value }))}
                  className={cn(formErrors.dateOfBirth && 'border-red-400')}
                />
                {formErrors.dateOfBirth && <p className="text-xs text-red-500">{formErrors.dateOfBirth}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select
                  id="gender"
                  value={newStudent.gender}
                  onChange={e => setNewStudent(p => ({ ...p, gender: e.target.value }))}
                  className={cn(formErrors.gender && 'border-red-400')}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Select>
                {formErrors.gender && <p className="text-xs text-red-500">{formErrors.gender}</p>}
              </div>
            </div>
            {/* Grade + Section */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gradeLevel">Grade Level *</Label>
                <Select
                  id="gradeLevel"
                  value={newStudent.gradeLevel}
                  onChange={e => setNewStudent(p => ({ ...p, gradeLevel: e.target.value }))}
                  className={cn(formErrors.gradeLevel && 'border-red-400')}
                >
                  <option value="">Select</option>
                  {gradeOptions.map(g => <option key={g} value={g}>{g}</option>)}
                </Select>
                {formErrors.gradeLevel && <p className="text-xs text-red-500">{formErrors.gradeLevel}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="section">Section *</Label>
                <Select
                  id="section"
                  value={newStudent.section}
                  onChange={e => setNewStudent(p => ({ ...p, section: e.target.value }))}
                  className={cn(formErrors.section && 'border-red-400')}
                >
                  <option value="">Select</option>
                  {sectionOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </Select>
                {formErrors.section && <p className="text-xs text-red-500">{formErrors.section}</p>}
              </div>
            </div>
            {/* Guardian */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="guardianName">Guardian Name *</Label>
                <Input
                  id="guardianName"
                  type="text"
                  value={newStudent.guardianName}
                  onChange={e => setNewStudent(p => ({ ...p, guardianName: e.target.value }))}
                  className={cn(formErrors.guardianName && 'border-red-400')}
                />
                {formErrors.guardianName && <p className="text-xs text-red-500">{formErrors.guardianName}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="guardianContact">Guardian Contact *</Label>
                <Input
                  id="guardianContact"
                  type="text"
                  value={newStudent.guardianContact}
                  onChange={e => setNewStudent(p => ({ ...p, guardianContact: e.target.value }))}
                  className={cn(formErrors.guardianContact && 'border-red-400')}
                />
                {formErrors.guardianContact && <p className="text-xs text-red-500">{formErrors.guardianContact}</p>}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => { setShowAddModal(false); setNewStudent(emptyForm); setFormErrors({}); }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddStudent}>
              <UserPlus className="h-4 w-4 mr-2" />
              Save Student
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* F. View Student Slide Panel */}
      <Sheet open={!!viewStudent} onOpenChange={(open) => { if (!open) setViewStudent(null); }}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto p-0">
          {viewStudent && (
            <>
              {/* Panel header */}
              <div className="px-6 py-5 bg-indigo-50 border-b border-indigo-100">
                <SheetHeader className="mb-4">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="sr-only">
                      {viewStudent.firstName} {viewStudent.lastName}
                    </SheetTitle>
                    <SheetDescription className="sr-only">
                      Student details for {viewStudent.firstName} {viewStudent.lastName}
                    </SheetDescription>
                    <Badge className={getStatusBadgeClass(viewStudent.status)}>
                      {viewStudent.status}
                    </Badge>
                  </div>
                </SheetHeader>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-indigo-200 text-indigo-700 text-lg font-bold">
                      {getInitials(viewStudent)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {viewStudent.firstName} {viewStudent.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">LRN: {viewStudent.lrn}</p>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full rounded-none h-auto p-0 bg-transparent border-b">
                  {['profile', 'grades', 'attendance', 'fees'].map(tab => (
                    <TabsTrigger
                      key={tab}
                      value={tab}
                      className="flex-1 rounded-none py-3 text-xs font-medium capitalize data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 data-[state=active]:bg-transparent"
                    >
                      {tab}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile" className="p-6 mt-0">
                  <div className="space-y-4">
                    {[
                      ['Full Name', `${viewStudent.firstName} ${viewStudent.middleName ? viewStudent.middleName + ' ' : ''}${viewStudent.lastName}`],
                      ['LRN', viewStudent.lrn],
                      ['Date of Birth', viewStudent.dateOfBirth],
                      ['Gender', viewStudent.gender],
                      ['Grade Level', viewStudent.gradeLevel],
                      ['Section', viewStudent.section],
                      ['Guardian', viewStudent.guardianName],
                      ['Contact', viewStudent.guardianContact],
                      ['Enrolled Date', viewStudent.enrolledDate],
                    ].map(([label, value], idx) => (
                      <div key={label}>
                        <div className="flex justify-between items-start">
                          <span className="text-sm text-muted-foreground">{label}</span>
                          <span className="text-sm font-medium text-right">{value}</span>
                        </div>
                        {idx < 8 && <Separator className="mt-4" />}
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Grades Tab */}
                <TabsContent value="grades" className="p-6 mt-0">
                  {viewStudent.grades.length === 0 ? (
                    <div className="text-center py-10">
                      <BarChart3 className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-muted-foreground text-sm">No grades recorded yet</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs font-semibold px-2">Subject</TableHead>
                          <TableHead className="text-xs font-semibold text-center px-2">Q1</TableHead>
                          <TableHead className="text-xs font-semibold text-center px-2">Q2</TableHead>
                          <TableHead className="text-xs font-semibold text-center px-2">Q3</TableHead>
                          <TableHead className="text-xs font-semibold text-center px-2">Q4</TableHead>
                          <TableHead className="text-xs font-semibold text-center px-2">Final</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {viewStudent.grades.map(g => {
                          const final = Math.round((g.q1 + g.q2 + g.q3 + g.q4) / 4);
                          return (
                            <TableRow key={g.subject}>
                              <TableCell className="py-2 px-2 text-sm">{g.subject}</TableCell>
                              <TableCell className={cn('py-2 px-2 text-center text-sm', g.q1 < 75 ? 'text-red-600 font-semibold' : 'text-muted-foreground')}>{g.q1}</TableCell>
                              <TableCell className={cn('py-2 px-2 text-center text-sm', g.q2 < 75 ? 'text-red-600 font-semibold' : 'text-muted-foreground')}>{g.q2}</TableCell>
                              <TableCell className={cn('py-2 px-2 text-center text-sm', g.q3 < 75 ? 'text-red-600 font-semibold' : 'text-muted-foreground')}>{g.q3}</TableCell>
                              <TableCell className={cn('py-2 px-2 text-center text-sm', g.q4 < 75 ? 'text-red-600 font-semibold' : 'text-muted-foreground')}>{g.q4}</TableCell>
                              <TableCell className={cn('py-2 px-2 text-center text-sm font-semibold', final < 75 ? 'text-red-600' : '')}>{final}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                </TabsContent>

                {/* Attendance Tab */}
                <TabsContent value="attendance" className="p-6 mt-0">
                  {(() => {
                    const a = viewStudent.attendance;
                    const pct = a.total > 0 ? Math.round((a.present / a.total) * 100) : 0;
                    return (
                      <div>
                        <div className="grid grid-cols-2 gap-3 mb-6">
                          <Card className="bg-green-50 border-green-100">
                            <CardContent className="p-3 text-center">
                              <p className="text-xs text-green-600 font-medium">Present</p>
                              <p className="text-xl font-bold text-green-700">{a.present}</p>
                            </CardContent>
                          </Card>
                          <Card className="bg-red-50 border-red-100">
                            <CardContent className="p-3 text-center">
                              <p className="text-xs text-red-600 font-medium">Absent</p>
                              <p className="text-xl font-bold text-red-700">{a.absent}</p>
                            </CardContent>
                          </Card>
                          <Card className="bg-amber-50 border-amber-100">
                            <CardContent className="p-3 text-center">
                              <p className="text-xs text-amber-600 font-medium">Late</p>
                              <p className="text-xl font-bold text-amber-700">{a.late}</p>
                            </CardContent>
                          </Card>
                          <Card className="bg-gray-50 border-gray-100">
                            <CardContent className="p-3 text-center">
                              <p className="text-xs text-gray-500 font-medium">Total Days</p>
                              <p className="text-xl font-bold text-gray-700">{a.total}</p>
                            </CardContent>
                          </Card>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-muted-foreground">Attendance Rate</span>
                            <span className="text-sm font-semibold">{pct}%</span>
                          </div>
                          <Progress
                            value={pct}
                            className="h-3"
                            indicatorClassName={cn(
                              pct >= 85 ? 'bg-green-500' : pct >= 70 ? 'bg-amber-500' : 'bg-red-500'
                            )}
                          />
                        </div>
                      </div>
                    );
                  })()}
                </TabsContent>

                {/* Fees Tab */}
                {/* TODO: Role check — only Admin and Finance should see fee details */}
                <TabsContent value="fees" className="p-6 mt-0">
                  {viewStudent.fees.length === 0 ? (
                    <div className="text-center py-10">
                      <CreditCard className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-muted-foreground text-sm">No fee records yet</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs font-semibold px-2">Type</TableHead>
                          <TableHead className="text-xs font-semibold text-right px-2">Amount</TableHead>
                          <TableHead className="text-xs font-semibold text-right px-2">Paid</TableHead>
                          <TableHead className="text-xs font-semibold text-right px-2">Balance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {viewStudent.fees.map(f => (
                          <TableRow key={f.type}>
                            <TableCell className="py-2 px-2 text-sm">{f.type}</TableCell>
                            <TableCell className="py-2 px-2 text-right text-sm text-muted-foreground">{'\u20B1'}{f.amount.toLocaleString()}</TableCell>
                            <TableCell className="py-2 px-2 text-right text-sm text-muted-foreground">{'\u20B1'}{f.paid.toLocaleString()}</TableCell>
                            <TableCell className={cn('py-2 px-2 text-right text-sm font-medium', f.amount - f.paid > 0 ? 'text-red-600' : 'text-green-600')}>
                              {'\u20B1'}{(f.amount - f.paid).toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <tfoot>
                        <TableRow className="border-t-2">
                          <TableCell className="py-2 px-2 font-semibold">Total</TableCell>
                          <TableCell className="py-2 px-2 text-right font-semibold">
                            {'\u20B1'}{viewStudent.fees.reduce((sum, f) => sum + f.amount, 0).toLocaleString()}
                          </TableCell>
                          <TableCell className="py-2 px-2 text-right font-semibold">
                            {'\u20B1'}{viewStudent.fees.reduce((sum, f) => sum + f.paid, 0).toLocaleString()}
                          </TableCell>
                          <TableCell className="py-2 px-2 text-right font-semibold text-red-600">
                            {'\u20B1'}{viewStudent.fees.reduce((sum, f) => sum + (f.amount - f.paid), 0).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      </tfoot>
                    </Table>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* G. Delete Confirmation Modal */}
      <Dialog open={confirmDelete !== null} onOpenChange={(open) => { if (!open) setConfirmDelete(null); }}>
        <DialogContent className="max-w-sm text-center">
          <DialogHeader className="items-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <DialogTitle>Delete Student?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The student record will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button
              variant="outline"
              onClick={() => setConfirmDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmAndDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* H. Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-lg shadow-lg text-sm font-medium text-white bg-green-600 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <CheckCircle className="h-4 w-4" />
          {toast.message}
        </div>
      )}
    </div>
  );
}
