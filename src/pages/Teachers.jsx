import { useState, useEffect, useMemo } from 'react';
import { Search, Download, Plus, Eye, Trash2, LayoutGrid, List, AlertTriangle, BookOpen, CalendarDays, Users } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../components/ui/sheet';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Separator } from '../components/ui/separator';
import { Skeleton } from '../components/ui/skeleton';
import { Checkbox } from '../components/ui/checkbox';

// --- Sample Data ---
const initialTeachers = [
  {
    id: 1,
    employeeId: 'TCH-2024-001',
    fullName: 'Rosa Lina Montoya',
    specialization: 'Algebra & Geometry',
    department: 'Mathematics',
    employmentType: 'Full-time',
    status: 'Active',
    dateHired: '2018-06-15',
    contactNumber: '09171234501',
    email: 'rosa.montoya@school.edu.ph',
    assignedSections: ['Grade 7 - Rizal', 'Grade 8 - Bonifacio', 'Grade 9 - Mabini'],
    schedule: [
      { day: 'Monday', time: '7:30 - 8:30', subject: 'Math 7', section: 'Grade 7 - Rizal' },
      { day: 'Monday', time: '9:00 - 10:00', subject: 'Math 8', section: 'Grade 8 - Bonifacio' },
      { day: 'Tuesday', time: '7:30 - 8:30', subject: 'Math 9', section: 'Grade 9 - Mabini' },
      { day: 'Wednesday', time: '7:30 - 8:30', subject: 'Math 7', section: 'Grade 7 - Rizal' },
      { day: 'Thursday', time: '9:00 - 10:00', subject: 'Math 8', section: 'Grade 8 - Bonifacio' },
    ],
  },
  {
    id: 2,
    employeeId: 'TCH-2024-002',
    fullName: 'Carlos Andrade Santos',
    specialization: 'Biology & General Science',
    department: 'Science',
    employmentType: 'Full-time',
    status: 'Active',
    dateHired: '2019-06-10',
    contactNumber: '09181234502',
    email: 'carlos.santos@school.edu.ph',
    assignedSections: ['Grade 7 - Rizal', 'Grade 10 - Aguinaldo'],
    schedule: [
      { day: 'Monday', time: '10:30 - 11:30', subject: 'Science 7', section: 'Grade 7 - Rizal' },
      { day: 'Tuesday', time: '10:30 - 11:30', subject: 'Science 10', section: 'Grade 10 - Aguinaldo' },
      { day: 'Wednesday', time: '10:30 - 11:30', subject: 'Science 7', section: 'Grade 7 - Rizal' },
      { day: 'Friday', time: '10:30 - 11:30', subject: 'Science 10', section: 'Grade 10 - Aguinaldo' },
    ],
  },
  {
    id: 3,
    employeeId: 'TCH-2024-003',
    fullName: 'Maria Fe Dela Rosa',
    specialization: 'Filipino Literature',
    department: 'Filipino',
    employmentType: 'Full-time',
    status: 'Active',
    dateHired: '2017-06-12',
    contactNumber: '09191234503',
    email: 'mariafe.delarosa@school.edu.ph',
    assignedSections: ['Grade 8 - Bonifacio', 'Grade 9 - Mabini', 'Grade 10 - Aguinaldo'],
    schedule: [
      { day: 'Monday', time: '8:30 - 9:30', subject: 'Filipino 8', section: 'Grade 8 - Bonifacio' },
      { day: 'Tuesday', time: '8:30 - 9:30', subject: 'Filipino 9', section: 'Grade 9 - Mabini' },
      { day: 'Wednesday', time: '8:30 - 9:30', subject: 'Filipino 10', section: 'Grade 10 - Aguinaldo' },
      { day: 'Thursday', time: '8:30 - 9:30', subject: 'Filipino 8', section: 'Grade 8 - Bonifacio' },
      { day: 'Friday', time: '8:30 - 9:30', subject: 'Filipino 9', section: 'Grade 9 - Mabini' },
    ],
  },
  {
    id: 4,
    employeeId: 'TCH-2024-004',
    fullName: 'Jerome Pascual Bautista',
    specialization: 'English Communication',
    department: 'English',
    employmentType: 'Part-time',
    status: 'Active',
    dateHired: '2022-08-01',
    contactNumber: '09201234504',
    email: 'jerome.bautista@school.edu.ph',
    assignedSections: ['Grade 7 - Rizal'],
    schedule: [
      { day: 'Monday', time: '1:00 - 2:00', subject: 'English 7', section: 'Grade 7 - Rizal' },
      { day: 'Wednesday', time: '1:00 - 2:00', subject: 'English 7', section: 'Grade 7 - Rizal' },
      { day: 'Friday', time: '1:00 - 2:00', subject: 'English 7', section: 'Grade 7 - Rizal' },
    ],
  },
  {
    id: 5,
    employeeId: 'TCH-2024-005',
    fullName: 'Lourdes Reyes Villanueva',
    specialization: 'Philippine History',
    department: 'Araling Panlipunan',
    employmentType: 'Full-time',
    status: 'On Leave',
    dateHired: '2016-06-13',
    contactNumber: '09211234505',
    email: 'lourdes.villanueva@school.edu.ph',
    assignedSections: ['Grade 8 - Bonifacio', 'Grade 9 - Mabini'],
    schedule: [
      { day: 'Tuesday', time: '1:00 - 2:00', subject: 'AP 8', section: 'Grade 8 - Bonifacio' },
      { day: 'Thursday', time: '1:00 - 2:00', subject: 'AP 9', section: 'Grade 9 - Mabini' },
    ],
  },
  {
    id: 6,
    employeeId: 'TCH-2024-006',
    fullName: 'Ricardo Gabriel Mendoza',
    specialization: 'Electrical & Woodwork',
    department: 'TLE',
    employmentType: 'Full-time',
    status: 'Active',
    dateHired: '2020-01-06',
    contactNumber: '09221234506',
    email: 'ricardo.mendoza@school.edu.ph',
    assignedSections: ['Grade 9 - Mabini', 'Grade 10 - Aguinaldo'],
    schedule: [
      { day: 'Monday', time: '2:00 - 3:30', subject: 'TLE 9', section: 'Grade 9 - Mabini' },
      { day: 'Wednesday', time: '2:00 - 3:30', subject: 'TLE 10', section: 'Grade 10 - Aguinaldo' },
      { day: 'Friday', time: '2:00 - 3:30', subject: 'TLE 9', section: 'Grade 9 - Mabini' },
    ],
  },
  {
    id: 7,
    employeeId: 'TCH-2024-007',
    fullName: 'Anna Patricia Cruz',
    specialization: 'Music & Physical Education',
    department: 'MAPEH',
    employmentType: 'Part-time',
    status: 'Active',
    dateHired: '2023-06-05',
    contactNumber: '09231234507',
    email: 'anna.cruz@school.edu.ph',
    assignedSections: ['Grade 7 - Rizal', 'Grade 8 - Bonifacio'],
    schedule: [
      { day: 'Tuesday', time: '2:00 - 3:00', subject: 'MAPEH 7', section: 'Grade 7 - Rizal' },
      { day: 'Thursday', time: '2:00 - 3:00', subject: 'MAPEH 8', section: 'Grade 8 - Bonifacio' },
    ],
  },
  {
    id: 8,
    employeeId: 'TCH-2024-008',
    fullName: 'Fernando Jose Aguilar',
    specialization: 'Advanced Mathematics',
    department: 'Mathematics',
    employmentType: 'Full-time',
    status: 'On Leave',
    dateHired: '2015-06-08',
    contactNumber: '09241234508',
    email: 'fernando.aguilar@school.edu.ph',
    assignedSections: ['Grade 10 - Aguinaldo'],
    schedule: [
      { day: 'Monday', time: '8:30 - 9:30', subject: 'Math 10', section: 'Grade 10 - Aguinaldo' },
      { day: 'Wednesday', time: '8:30 - 9:30', subject: 'Math 10', section: 'Grade 10 - Aguinaldo' },
      { day: 'Friday', time: '8:30 - 9:30', subject: 'Math 10', section: 'Grade 10 - Aguinaldo' },
    ],
  },
];

const departmentOptions = ['Mathematics', 'Science', 'Filipino', 'English', 'Araling Panlipunan', 'TLE', 'MAPEH'];
const employmentTypeOptions = ['Full-time', 'Part-time'];
const statusOptions = ['Active', 'On Leave'];

const emptyForm = {
  fullName: '',
  employeeId: '',
  specialization: '',
  department: '',
  employmentType: '',
  dateHired: '',
  contactNumber: '',
  email: '',
};

// --- Helpers ---
function getInitials(teacher) {
  const parts = teacher.fullName.trim().split(/\s+/);
  return ((parts[0]?.[0] || '') + (parts[parts.length - 1]?.[0] || '')).toUpperCase();
}

function getStatusBadgeVariant(status) {
  if (status === 'Active') return 'success';
  if (status === 'On Leave') return 'destructive';
  return 'warning';
}

function getEmploymentBadgeVariant(type) {
  return type === 'Full-time' ? 'default' : 'warning';
}

function exportToCSV(list) {
  const headers = ['Employee ID', 'Full Name', 'Specialization', 'Department', 'Employment Type', 'Status', 'Date Hired', 'Contact Number', 'Email', 'Assigned Sections'];
  const rows = list.map(t => [t.employeeId, t.fullName, t.specialization, t.department, t.employmentType, t.status, t.dateHired, t.contactNumber, t.email, t.assignedSections.join('; ')]);
  const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'teachers.csv';
  link.click();
  URL.revokeObjectURL(url);
}

// --- Component ---
export default function Teachers() {
  const [teachers, setTeachers] = useState(initialTeachers);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTeacher, setNewTeacher] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [viewTeacher, setViewTeacher] = useState(null);
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

  // Filtered teachers
  const filteredTeachers = useMemo(() => {
    return teachers.filter(t => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        t.fullName.toLowerCase().includes(q) ||
        t.employeeId.toLowerCase().includes(q);
      const matchesDept = !filterDepartment || t.department === filterDepartment;
      const matchesType = !filterType || t.employmentType === filterType;
      const matchesStatus = !filterStatus || t.status === filterStatus;
      return matchesSearch && matchesDept && matchesType && matchesStatus;
    });
  }, [teachers, search, filterDepartment, filterType, filterStatus]);

  // Stats
  const totalTeachers = teachers.length;
  const fullTimeCount = teachers.filter(t => t.employmentType === 'Full-time').length;
  const partTimeCount = teachers.filter(t => t.employmentType === 'Part-time').length;
  const onLeaveCount = teachers.filter(t => t.status === 'On Leave').length;

  const allOnPageSelected =
    filteredTeachers.length > 0 &&
    filteredTeachers.every(t => selectedIds.has(t.id));

  // --- Handlers ---
  function handleAddTeacher() {
    const errors = {};
    if (!newTeacher.fullName.trim()) errors.fullName = 'Required';
    if (!newTeacher.employeeId.trim()) {
      errors.employeeId = 'Required';
    } else if (teachers.some(t => t.employeeId === newTeacher.employeeId.trim())) {
      errors.employeeId = 'Employee ID already exists';
    }
    if (!newTeacher.specialization.trim()) errors.specialization = 'Required';
    if (!newTeacher.department) errors.department = 'Required';
    if (!newTeacher.employmentType) errors.employmentType = 'Required';
    if (!newTeacher.dateHired) errors.dateHired = 'Required';
    if (!newTeacher.contactNumber.trim()) errors.contactNumber = 'Required';
    if (!newTeacher.email.trim()) {
      errors.email = 'Required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newTeacher.email.trim())) {
      errors.email = 'Invalid email format';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const created = {
      fullName: newTeacher.fullName.trim(),
      employeeId: newTeacher.employeeId.trim(),
      specialization: newTeacher.specialization.trim(),
      department: newTeacher.department,
      employmentType: newTeacher.employmentType,
      dateHired: newTeacher.dateHired,
      contactNumber: newTeacher.contactNumber.trim(),
      email: newTeacher.email.trim(),
      id: Date.now(),
      status: 'Active',
      assignedSections: [],
      schedule: [],
    };

    setTeachers(prev => [...prev, created]);
    setShowAddModal(false);
    setNewTeacher(emptyForm);
    setFormErrors({});
    setToast({ message: 'Teacher added successfully', type: 'success' });
  }

  // TODO: Role check — only Admin and HR should be able to delete teachers
  function handleDeleteTeacher(id) {
    setConfirmDelete(id);
  }

  function confirmAndDelete() {
    setTeachers(prev => prev.filter(t => t.id !== confirmDelete));
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.delete(confirmDelete);
      return next;
    });
    if (viewTeacher?.id === confirmDelete) setViewTeacher(null);
    setConfirmDelete(null);
    setToast({ message: 'Teacher deleted', type: 'success' });
  }

  // TODO: Role check — only Admin and HR should be able to bulk-change status
  function handleBulkAction(action) {
    const ids = selectedIds;
    if (action === 'export') {
      const selected = teachers.filter(t => ids.has(t.id));
      exportToCSV(selected);
      setToast({ message: `Exported ${selected.length} teacher(s)`, type: 'success' });
    } else if (action === 'activate') {
      setTeachers(prev =>
        prev.map(t => (ids.has(t.id) ? { ...t, status: 'Active' } : t))
      );
      setToast({ message: `${ids.size} teacher(s) activated`, type: 'success' });
    } else if (action === 'deactivate') {
      setTeachers(prev =>
        prev.map(t => (ids.has(t.id) ? { ...t, status: 'On Leave' } : t))
      );
      setToast({ message: `${ids.size} teacher(s) set to On Leave`, type: 'success' });
    }
    setSelectedIds(new Set());
  }

  function toggleSelectAll() {
    if (allOnPageSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredTeachers.map(t => t.id)));
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
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // --- Render ---
  return (
    <div>
      {/* A. Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <h2 className="text-xl font-semibold text-gray-800">Teachers</h2>
        <div className="flex flex-wrap gap-2">
          {/* View toggle */}
          <div className="inline-flex rounded-lg border overflow-hidden">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-none"
              title="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="rounded-none"
              title="Table view"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={() => exportToCSV(teachers)}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          {/* TODO: Role check — only Admin and HR should see Add Teacher */}
          <Button size="sm" onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Teacher
          </Button>
        </div>
      </div>

      {/* B. Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-indigo-50 border-indigo-100">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-indigo-700 opacity-70">Total Teachers</p>
            <p className="text-2xl font-bold mt-1 text-indigo-700">{totalTeachers}</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-100">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-green-700 opacity-70">Full-time</p>
            <p className="text-2xl font-bold mt-1 text-green-700">{fullTimeCount}</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-100">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-amber-700 opacity-70">Part-time</p>
            <p className="text-2xl font-bold mt-1 text-amber-700">{partTimeCount}</p>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-100">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-red-700 opacity-70">On Leave</p>
            <p className="text-2xl font-bold mt-1 text-red-700">{onLeaveCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* C. Search + Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name or employee ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={filterDepartment}
          onChange={e => setFilterDepartment(e.target.value)}
        >
          <option value="">All Departments</option>
          {departmentOptions.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </Select>
        <Select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
        >
          <option value="">All Types</option>
          {employmentTypeOptions.map(t => (
            <option key={t} value={t}>{t}</option>
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
        <Card className="mb-4 bg-indigo-50 border-indigo-200">
          <CardContent className="flex flex-wrap items-center gap-3 p-3">
            <span className="text-sm font-medium text-indigo-700">
              {selectedIds.size} teacher(s) selected
            </span>
            <Button variant="outline" size="sm" onClick={() => handleBulkAction('export')}>
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-green-700 border-green-300 hover:bg-green-100"
              onClick={() => handleBulkAction('activate')}
            >
              Activate
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-700 border-red-300 hover:bg-red-100"
              onClick={() => handleBulkAction('deactivate')}
            >
              Deactivate
            </Button>
          </CardContent>
        </Card>
      )}

      {/* D. Card Grid View */}
      {viewMode === 'grid' && (
        <>
          {filteredTeachers.length === 0 ? (
            <div className="text-center py-16">
              <Users className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground font-medium">No teachers found</p>
              <p className="text-muted-foreground/70 text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {filteredTeachers.map(t => (
                <Card key={t.id} className="relative">
                  <CardContent className="p-5">
                    {/* Checkbox */}
                    <div className="absolute top-4 left-4">
                      <Checkbox
                        checked={selectedIds.has(t.id)}
                        onCheckedChange={() => toggleSelectOne(t.id)}
                      />
                    </div>
                    {/* Top: avatar + name + status */}
                    <div className="flex items-center gap-3 mb-4 ml-6">
                      <Avatar className="h-10 w-10 bg-teal-100">
                        <AvatarFallback className="bg-teal-100 text-teal-700 text-sm font-bold">
                          {getInitials(t)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-gray-800 truncate">{t.fullName}</h3>
                        <Badge variant={getStatusBadgeVariant(t.status)} className="mt-0.5">
                          {t.status}
                        </Badge>
                      </div>
                    </div>
                    {/* Middle: details */}
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Specialization</span>
                        <span className="text-gray-800 font-medium text-right truncate ml-2">{t.specialization}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Department</span>
                        <span className="text-gray-800 font-medium">{t.department}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Type</span>
                        <Badge variant={getEmploymentBadgeVariant(t.employmentType)}>
                          {t.employmentType}
                        </Badge>
                      </div>
                    </div>
                    {/* Bottom row */}
                    <Separator />
                    <div className="flex items-center justify-between pt-3">
                      <Badge variant="secondary">
                        {t.assignedSections.length} section{t.assignedSections.length !== 1 ? 's' : ''}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-indigo-600 hover:text-indigo-800"
                          onClick={() => { setViewTeacher(t); setActiveTab('profile'); }}
                          title="View teacher"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {/* TODO: Role check — only Admin and HR should see delete */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteTeacher(t.id)}
                          title="Delete teacher"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* E. Table View */}
      {viewMode === 'table' && (
        <Card className="mb-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    checked={allOnPageSelected}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>Employee ID</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeachers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-16">
                    <Users className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground font-medium">No teachers found</p>
                    <p className="text-muted-foreground/70 text-sm mt-1">Try adjusting your search or filters</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTeachers.map(t => (
                  <TableRow key={t.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(t.id)}
                        onCheckedChange={() => toggleSelectOne(t.id)}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-muted-foreground">{t.employeeId}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 bg-teal-100">
                          <AvatarFallback className="bg-teal-100 text-teal-700 text-xs font-bold">
                            {getInitials(t)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-gray-800">{t.fullName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{t.specialization}</TableCell>
                    <TableCell className="text-muted-foreground">{t.department}</TableCell>
                    <TableCell>
                      <Badge variant={getEmploymentBadgeVariant(t.employmentType)}>
                        {t.employmentType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(t.status)}>
                        {t.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-indigo-600 hover:text-indigo-800"
                          onClick={() => { setViewTeacher(t); setActiveTab('profile'); }}
                          title="View teacher"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {/* TODO: Role check — only Admin and HR should see delete */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteTeacher(t.id)}
                          title="Delete teacher"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Results count */}
      {filteredTeachers.length > 0 && (
        <p className="text-xs text-muted-foreground mb-6">
          Showing {filteredTeachers.length} of {totalTeachers} teacher(s)
        </p>
      )}

      {/* F. Add Teacher Modal */}
      <Dialog open={showAddModal} onOpenChange={(open) => {
        if (!open) {
          setShowAddModal(false);
          setNewTeacher(emptyForm);
          setFormErrors({});
        }
      }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Teacher</DialogTitle>
            <DialogDescription>Fill in the details below to add a new teacher record.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Full Name */}
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                type="text"
                value={newTeacher.fullName}
                onChange={e => setNewTeacher(p => ({ ...p, fullName: e.target.value }))}
                className={cn(formErrors.fullName && 'border-red-400')}
              />
              {formErrors.fullName && <p className="text-xs text-destructive">{formErrors.fullName}</p>}
            </div>
            {/* Employee ID + Specialization */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="employeeId">Employee ID *</Label>
                <Input
                  id="employeeId"
                  type="text"
                  value={newTeacher.employeeId}
                  onChange={e => setNewTeacher(p => ({ ...p, employeeId: e.target.value }))}
                  placeholder="e.g. TCH-2024-009"
                  className={cn(formErrors.employeeId && 'border-red-400')}
                />
                {formErrors.employeeId && <p className="text-xs text-destructive">{formErrors.employeeId}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="specialization">Specialization *</Label>
                <Input
                  id="specialization"
                  type="text"
                  value={newTeacher.specialization}
                  onChange={e => setNewTeacher(p => ({ ...p, specialization: e.target.value }))}
                  className={cn(formErrors.specialization && 'border-red-400')}
                />
                {formErrors.specialization && <p className="text-xs text-destructive">{formErrors.specialization}</p>}
              </div>
            </div>
            {/* Department + Employment Type */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="department">Department *</Label>
                <Select
                  id="department"
                  value={newTeacher.department}
                  onChange={e => setNewTeacher(p => ({ ...p, department: e.target.value }))}
                  className={cn(formErrors.department && 'border-red-400')}
                >
                  <option value="">Select</option>
                  {departmentOptions.map(d => <option key={d} value={d}>{d}</option>)}
                </Select>
                {formErrors.department && <p className="text-xs text-destructive">{formErrors.department}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="employmentType">Employment Type *</Label>
                <Select
                  id="employmentType"
                  value={newTeacher.employmentType}
                  onChange={e => setNewTeacher(p => ({ ...p, employmentType: e.target.value }))}
                  className={cn(formErrors.employmentType && 'border-red-400')}
                >
                  <option value="">Select</option>
                  {employmentTypeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                </Select>
                {formErrors.employmentType && <p className="text-xs text-destructive">{formErrors.employmentType}</p>}
              </div>
            </div>
            {/* Date Hired + Contact */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="dateHired">Date Hired *</Label>
                <Input
                  id="dateHired"
                  type="date"
                  value={newTeacher.dateHired}
                  onChange={e => setNewTeacher(p => ({ ...p, dateHired: e.target.value }))}
                  className={cn(formErrors.dateHired && 'border-red-400')}
                />
                {formErrors.dateHired && <p className="text-xs text-destructive">{formErrors.dateHired}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="contactNumber">Contact Number *</Label>
                <Input
                  id="contactNumber"
                  type="text"
                  value={newTeacher.contactNumber}
                  onChange={e => setNewTeacher(p => ({ ...p, contactNumber: e.target.value }))}
                  className={cn(formErrors.contactNumber && 'border-red-400')}
                />
                {formErrors.contactNumber && <p className="text-xs text-destructive">{formErrors.contactNumber}</p>}
              </div>
            </div>
            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={newTeacher.email}
                onChange={e => setNewTeacher(p => ({ ...p, email: e.target.value }))}
                className={cn(formErrors.email && 'border-red-400')}
              />
              {formErrors.email && <p className="text-xs text-destructive">{formErrors.email}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => { setShowAddModal(false); setNewTeacher(emptyForm); setFormErrors({}); }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddTeacher}>
              Save Teacher
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* G. View Teacher Slide Panel */}
      <Sheet open={!!viewTeacher} onOpenChange={(open) => { if (!open) setViewTeacher(null); }}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto p-0">
          {viewTeacher && (
            <>
              {/* Panel header */}
              <div className="px-6 py-5 bg-teal-50 border-b border-teal-100">
                <SheetHeader className="mb-4">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="sr-only">{viewTeacher.fullName}</SheetTitle>
                    <SheetDescription className="sr-only">Teacher details for {viewTeacher.fullName}</SheetDescription>
                    <Badge variant={getStatusBadgeVariant(viewTeacher.status)}>
                      {viewTeacher.status}
                    </Badge>
                  </div>
                </SheetHeader>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 bg-teal-200">
                    <AvatarFallback className="bg-teal-200 text-teal-700 text-lg font-bold">
                      {getInitials(viewTeacher)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {viewTeacher.fullName}
                    </h3>
                    <p className="text-sm text-muted-foreground">ID: {viewTeacher.employeeId}</p>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full rounded-none border-b h-auto p-0 bg-transparent">
                  <TabsTrigger
                    value="profile"
                    className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none capitalize"
                  >
                    Profile
                  </TabsTrigger>
                  <TabsTrigger
                    value="classes"
                    className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none capitalize"
                  >
                    Classes
                  </TabsTrigger>
                  <TabsTrigger
                    value="schedule"
                    className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none capitalize"
                  >
                    Schedule
                  </TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile" className="p-6 mt-0">
                  <div className="space-y-4">
                    {[
                      ['Full Name', viewTeacher.fullName],
                      ['Employee ID', viewTeacher.employeeId],
                      ['Specialization', viewTeacher.specialization],
                      ['Department', viewTeacher.department],
                      ['Employment Type', viewTeacher.employmentType],
                      ['Date Hired', viewTeacher.dateHired],
                      ['Contact', viewTeacher.contactNumber],
                      ['Email', viewTeacher.email],
                      ['Status', viewTeacher.status],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between items-start">
                        <span className="text-sm text-muted-foreground">{label}</span>
                        <span className="text-sm font-medium text-gray-800 text-right">{value}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Classes Tab */}
                <TabsContent value="classes" className="p-6 mt-0">
                  {viewTeacher.assignedSections.length === 0 ? (
                    <div className="text-center py-10">
                      <BookOpen className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-muted-foreground text-sm">No classes assigned yet</p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {viewTeacher.assignedSections.map(section => (
                        <Badge
                          key={section}
                          variant="outline"
                          className="px-3 py-1.5 text-sm font-medium bg-teal-50 text-teal-700 border-teal-200"
                        >
                          {section}
                        </Badge>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Schedule Tab */}
                <TabsContent value="schedule" className="p-6 mt-0">
                  {viewTeacher.schedule.length === 0 ? (
                    <div className="text-center py-10">
                      <CalendarDays className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-muted-foreground text-sm">No schedule set yet</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">Day</TableHead>
                          <TableHead className="text-xs">Time</TableHead>
                          <TableHead className="text-xs">Subject</TableHead>
                          <TableHead className="text-xs">Section</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {viewTeacher.schedule.map((s, i) => (
                          <TableRow key={i}>
                            <TableCell className="text-gray-700">{s.day}</TableCell>
                            <TableCell className="text-muted-foreground">{s.time}</TableCell>
                            <TableCell className="text-muted-foreground">{s.subject}</TableCell>
                            <TableCell className="text-muted-foreground">{s.section}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* H. Delete Confirmation Modal */}
      <Dialog open={confirmDelete !== null} onOpenChange={(open) => { if (!open) setConfirmDelete(null); }}>
        <DialogContent className="max-w-sm text-center">
          <DialogHeader className="items-center">
            <AlertTriangle className="h-10 w-10 text-destructive mb-2" />
            <DialogTitle>Delete Teacher?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The teacher record will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmAndDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* I. Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-lg shadow-lg text-sm font-medium text-white bg-green-600 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {toast.message}
        </div>
      )}
    </div>
  );
}
