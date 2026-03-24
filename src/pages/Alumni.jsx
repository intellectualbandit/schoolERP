import { useState, useEffect, useMemo } from 'react';
import {
  Search, Plus, Edit2, Trash2, GraduationCap, Briefcase, Award, Users,
  ExternalLink, Send, Star, TrendingUp, CheckCircle, BookOpen, X,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Skeleton } from '../components/ui/skeleton';
import { cn } from '../lib/utils';

// --- Sample Alumni Data ---
const initialAlumni = [
  {
    id: 1,
    firstName: 'Maria',
    lastName: 'Santos',
    graduationYear: 2020,
    university: 'University of the Philippines',
    course: 'BS Computer Science',
    scholarship: 'DOST-SEI Merit',
    profession: 'Software Engineer',
    status: 'Employed',
    email: 'maria.santos@email.com',
    contact: '09171234567',
  },
  {
    id: 2,
    firstName: 'Juan',
    lastName: 'Dela Cruz',
    graduationYear: 2021,
    university: 'Ateneo de Manila University',
    course: 'BS Management',
    scholarship: 'None',
    profession: 'Marketing Analyst',
    status: 'Employed',
    email: 'juan.delacruz@email.com',
    contact: '09181234568',
  },
  {
    id: 3,
    firstName: 'Angela',
    lastName: 'Reyes',
    graduationYear: 2022,
    university: 'De La Salle University',
    course: 'BS Biology',
    scholarship: 'Academic Excellence',
    profession: '',
    status: 'In College',
    email: 'angela.reyes@email.com',
    contact: '09191234569',
  },
  {
    id: 4,
    firstName: 'Carlos',
    lastName: 'Garcia',
    graduationYear: 2019,
    university: 'University of Santo Tomas',
    course: 'BS Accountancy',
    scholarship: 'None',
    profession: 'CPA / Auditor',
    status: 'Employed',
    email: 'carlos.garcia@email.com',
    contact: '09201234570',
  },
  {
    id: 5,
    firstName: 'Patricia',
    lastName: 'Lim',
    graduationYear: 2023,
    university: 'University of the Philippines',
    course: 'BS Nursing',
    scholarship: 'Government Grant',
    profession: '',
    status: 'In College',
    email: 'patricia.lim@email.com',
    contact: '09211234571',
  },
  {
    id: 6,
    firstName: 'Marco',
    lastName: 'Aquino',
    graduationYear: 2021,
    university: 'Mapúa University',
    course: 'BS Civil Engineering',
    scholarship: 'DOST-SEI Merit',
    profession: 'Structural Engineer',
    status: 'Employed',
    email: 'marco.aquino@email.com',
    contact: '09221234572',
  },
  {
    id: 7,
    firstName: 'Sofia',
    lastName: 'Torres',
    graduationYear: 2020,
    university: 'Ateneo de Manila University',
    course: 'AB Communication',
    scholarship: 'None',
    profession: 'Journalist',
    status: 'Employed',
    email: 'sofia.torres@email.com',
    contact: '09231234573',
  },
  {
    id: 8,
    firstName: 'Rafael',
    lastName: 'Mendoza',
    graduationYear: 2023,
    university: 'De La Salle University',
    course: 'BS Information Technology',
    scholarship: 'Academic Excellence',
    profession: '',
    status: 'In College',
    email: 'rafael.mendoza@email.com',
    contact: '09241234574',
  },
  {
    id: 9,
    firstName: 'Isabel',
    lastName: 'Cruz',
    graduationYear: 2018,
    university: 'University of the Philippines',
    course: 'BS Education',
    scholarship: 'Government Grant',
    profession: 'Public School Teacher',
    status: 'Employed',
    email: 'isabel.cruz@email.com',
    contact: '09251234575',
  },
  {
    id: 10,
    firstName: 'Diego',
    lastName: 'Rivera',
    graduationYear: 2022,
    university: 'Polytechnic University of the Philippines',
    course: 'BS Entrepreneurship',
    scholarship: 'None',
    profession: 'Business Owner',
    status: 'Employed',
    email: 'diego.rivera@email.com',
    contact: '09261234576',
  },
  {
    id: 11,
    firstName: 'Camille',
    lastName: 'Bautista',
    graduationYear: 2024,
    university: 'University of Santo Tomas',
    course: 'BS Pharmacy',
    scholarship: 'DOST-SEI Merit',
    profession: '',
    status: 'In College',
    email: 'camille.bautista@email.com',
    contact: '09271234577',
  },
  {
    id: 12,
    firstName: 'Enrique',
    lastName: 'Villanueva',
    graduationYear: 2019,
    university: 'Mapúa University',
    course: 'BS Electronics Engineering',
    scholarship: 'None',
    profession: 'Electronics Engineer',
    status: 'Employed',
    email: 'enrique.villanueva@email.com',
    contact: '09281234578',
  },
];

// --- Legacy Feed Data ---
const legacyFeed = [
  {
    id: 1,
    alumniName: 'Maria Santos',
    year: 2020,
    achievement: 'Promoted to Senior Software Engineer at a leading tech company in Makati. She credits her foundation in math and science from our school.',
    date: '2025-12-10',
    type: 'career',
  },
  {
    id: 2,
    alumniName: 'Carlos Garcia',
    year: 2019,
    achievement: 'Passed the CPA Board Exam with flying colors — ranked in the Top 10 nationally. He now mentors current students in accounting.',
    date: '2025-11-22',
    type: 'board',
  },
  {
    id: 3,
    alumniName: 'Isabel Cruz',
    year: 2018,
    achievement: 'Received the Outstanding Teacher Award from DepEd for her innovative classroom strategies in a rural Mindanao school.',
    date: '2025-10-05',
    type: 'award',
  },
  {
    id: 4,
    alumniName: 'Angela Reyes',
    year: 2022,
    achievement: 'Published a research paper on marine biodiversity in a peer-reviewed international journal while still an undergraduate at DLSU.',
    date: '2026-01-15',
    type: 'academic',
  },
  {
    id: 5,
    alumniName: 'Diego Rivera',
    year: 2022,
    achievement: 'Launched a successful social enterprise providing affordable school supplies to underserved communities in Visayas.',
    date: '2026-02-28',
    type: 'career',
  },
];

const emptyForm = {
  firstName: '',
  lastName: '',
  graduationYear: '',
  university: '',
  course: '',
  scholarship: 'None',
  profession: '',
  status: 'In College',
  email: '',
  contact: '',
};

const CHART_COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#818cf8', '#7c3aed'];

const feedTypeConfig = {
  career: { icon: Briefcase, color: 'bg-blue-100 text-blue-700', label: 'Career' },
  board: { icon: Award, color: 'bg-amber-100 text-amber-700', label: 'Board Exam' },
  award: { icon: Star, color: 'bg-emerald-100 text-emerald-700', label: 'Award' },
  academic: { icon: BookOpen, color: 'bg-violet-100 text-violet-700', label: 'Academic' },
};

export default function Alumni() {
  const [alumni, setAlumni] = useState(initialAlumni);
  const [search, setSearch] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  // --- Computed ---
  const stats = useMemo(() => {
    const total = alumni.length;
    const inCollege = alumni.filter(a => a.status === 'In College').length;
    const employed = alumni.filter(a => a.status === 'Employed').length;
    const withScholarship = alumni.filter(a => a.scholarship !== 'None').length;
    return { total, inCollege, employed, withScholarship };
  }, [alumni]);

  const graduationYears = useMemo(
    () => [...new Set(alumni.map(a => a.graduationYear))].sort((a, b) => b - a),
    [alumni]
  );

  const filtered = useMemo(() => {
    return alumni.filter(a => {
      const matchesSearch =
        `${a.firstName} ${a.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        a.university.toLowerCase().includes(search.toLowerCase()) ||
        a.course.toLowerCase().includes(search.toLowerCase()) ||
        a.profession.toLowerCase().includes(search.toLowerCase());
      const matchesYear = !filterYear || a.graduationYear === Number(filterYear);
      const matchesStatus = !filterStatus || a.status === filterStatus;
      return matchesSearch && matchesYear && matchesStatus;
    });
  }, [alumni, search, filterYear, filterStatus]);

  const universityChart = useMemo(() => {
    const counts = {};
    alumni.forEach(a => {
      counts[a.university] = (counts[a.university] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [alumni]);

  // --- Handlers ---
  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (alumnus) => {
    setEditingId(alumnus.id);
    setForm({
      firstName: alumnus.firstName,
      lastName: alumnus.lastName,
      graduationYear: String(alumnus.graduationYear),
      university: alumnus.university,
      course: alumnus.course,
      scholarship: alumnus.scholarship,
      profession: alumnus.profession,
      status: alumnus.status,
      email: alumnus.email,
      contact: alumnus.contact,
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.firstName || !form.lastName || !form.graduationYear || !form.university || !form.course) {
      setToast({ type: 'error', message: 'Please fill in all required fields.' });
      return;
    }

    if (editingId) {
      setAlumni(prev =>
        prev.map(a =>
          a.id === editingId
            ? { ...a, ...form, graduationYear: Number(form.graduationYear) }
            : a
        )
      );
      setToast({ type: 'success', message: 'Alumni record updated successfully.' });
    } else {
      const newAlumnus = {
        ...form,
        id: Math.max(...alumni.map(a => a.id)) + 1,
        graduationYear: Number(form.graduationYear),
      };
      setAlumni(prev => [...prev, newAlumnus]);
      setToast({ type: 'success', message: 'New alumni added successfully.' });
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    setAlumni(prev => prev.filter(a => a.id !== id));
    setToast({ type: 'success', message: 'Alumni record removed.' });
  };

  const handleSendUpdateLink = () => {
    setToast({ type: 'success', message: 'Profile update link sent to all alumni emails.' });
  };

  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  // --- Render ---
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ===== Stats Bar ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Alumni', value: stats.total, icon: Users, bg: 'bg-indigo-50', text: 'text-indigo-600', iconBg: 'bg-indigo-100' },
          { label: 'In College', value: stats.inCollege, icon: GraduationCap, bg: 'bg-sky-50', text: 'text-sky-600', iconBg: 'bg-sky-100' },
          { label: 'Employed', value: stats.employed, icon: Briefcase, bg: 'bg-emerald-50', text: 'text-emerald-600', iconBg: 'bg-emerald-100' },
          { label: 'With Scholarship', value: stats.withScholarship, icon: Award, bg: 'bg-amber-50', text: 'text-amber-600', iconBg: 'bg-amber-100' },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className={cn('border-0 shadow-sm', stat.bg)}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                    <p className={cn('text-2xl font-bold mt-1', stat.text)}>{stat.value}</p>
                  </div>
                  <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', stat.iconBg)}>
                    <Icon className={cn('h-5 w-5', stat.text)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ===== Alumni Directory ===== */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <CardTitle className="text-lg">Alumni Directory</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search alumni..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9 w-48"
                />
              </div>
              <Select value={filterYear} onChange={e => setFilterYear(e.target.value)} className="w-36">
                <option value="">All Years</option>
                {graduationYears.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </Select>
              <Select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="w-36">
                <option value="">All Status</option>
                <option value="In College">In College</option>
                <option value="Employed">Employed</option>
              </Select>
              <Button size="sm" onClick={openAdd}>
                <Plus className="h-4 w-4 mr-1" /> Add Alumni
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-center">Grad Year</TableHead>
                  <TableHead>University</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Scholarship</TableHead>
                  <TableHead>Profession</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                      No alumni found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map(a => (
                    <TableRow key={a.id}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs font-bold">
                              {a.firstName[0]}{a.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{a.firstName} {a.lastName}</p>
                            <p className="text-xs text-muted-foreground">{a.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-medium">{a.graduationYear}</TableCell>
                      <TableCell className="text-sm max-w-[180px] truncate">{a.university}</TableCell>
                      <TableCell className="text-sm">{a.course}</TableCell>
                      <TableCell>
                        {a.scholarship !== 'None' ? (
                          <Badge className="bg-amber-100 text-amber-700 border-0">{a.scholarship}</Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">{a.profession || <span className="text-muted-foreground">—</span>}</TableCell>
                      <TableCell className="text-center">
                        <Badge className={cn(
                          'border-0',
                          a.status === 'Employed' ? 'bg-emerald-100 text-emerald-700' : 'bg-sky-100 text-sky-700'
                        )}>
                          {a.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => openEdit(a)} className="h-8 w-8 p-0">
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(a.id)} className="h-8 w-8 p-0 text-red-500 hover:text-red-700">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="px-5 py-3 border-t flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Showing {filtered.length} of {alumni.length} alumni
            </p>
            <Button variant="outline" size="sm" onClick={handleSendUpdateLink}>
              <Send className="h-3.5 w-3.5 mr-1.5" /> Send Update Profile Link
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ===== Bottom Section: Chart + Legacy Feed ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Universities Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-500" />
              Top Universities
            </CardTitle>
            <p className="text-xs text-muted-foreground">Where our graduates enrolled</p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={universityChart} layout="vertical" margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={160}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => v.length > 24 ? v.slice(0, 22) + '…' : v}
                  />
                  <RechartsTooltip
                    contentStyle={{ borderRadius: 8, fontSize: 13, border: '1px solid #e5e7eb' }}
                    formatter={(value) => [`${value} alumni`, 'Count']}
                  />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={24}>
                    {universityChart.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Legacy Feed */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500" />
              Legacy Feed
            </CardTitle>
            <p className="text-xs text-muted-foreground">Recent alumni achievements — visible to students</p>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {legacyFeed.map(item => {
              const config = feedTypeConfig[item.type] || feedTypeConfig.career;
              const FeedIcon = config.icon;
              return (
                <div key={item.id} className="flex gap-3 p-3 rounded-lg border bg-muted/30 hover:bg-muted/60 transition-colors">
                  <div className={cn('h-9 w-9 rounded-lg flex items-center justify-center shrink-0', config.color)}>
                    <FeedIcon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold">{item.alumniName}</p>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">{config.label}</Badge>
                      <span className="text-[10px] text-muted-foreground">Class of {item.year}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.achievement}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">{new Date(item.date).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* ===== Add / Edit Modal ===== */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Alumni' : 'Add New Alumni'}</DialogTitle>
            <DialogDescription>
              {editingId ? 'Update alumni information below.' : 'Fill in the details for the new alumni record.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="space-y-1.5">
              <Label>First Name *</Label>
              <Input value={form.firstName} onChange={e => updateField('firstName', e.target.value)} placeholder="e.g. Maria" />
            </div>
            <div className="space-y-1.5">
              <Label>Last Name *</Label>
              <Input value={form.lastName} onChange={e => updateField('lastName', e.target.value)} placeholder="e.g. Santos" />
            </div>
            <div className="space-y-1.5">
              <Label>Graduation Year *</Label>
              <Input type="number" value={form.graduationYear} onChange={e => updateField('graduationYear', e.target.value)} placeholder="e.g. 2023" />
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={form.status} onChange={e => updateField('status', e.target.value)}>
                <option value="In College">In College</option>
                <option value="Employed">Employed</option>
              </Select>
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>University *</Label>
              <Input value={form.university} onChange={e => updateField('university', e.target.value)} placeholder="e.g. University of the Philippines" />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Course *</Label>
              <Input value={form.course} onChange={e => updateField('course', e.target.value)} placeholder="e.g. BS Computer Science" />
            </div>
            <div className="space-y-1.5">
              <Label>Scholarship</Label>
              <Input value={form.scholarship} onChange={e => updateField('scholarship', e.target.value)} placeholder="None" />
            </div>
            <div className="space-y-1.5">
              <Label>Profession</Label>
              <Input value={form.profession} onChange={e => updateField('profession', e.target.value)} placeholder="e.g. Software Engineer" />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={e => updateField('email', e.target.value)} placeholder="email@example.com" />
            </div>
            <div className="space-y-1.5">
              <Label>Contact</Label>
              <Input value={form.contact} onChange={e => updateField('contact', e.target.value)} placeholder="09XX XXX XXXX" />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSave}>
              {editingId ? 'Update' : 'Add Alumni'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== Toast ===== */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 fade-in">
          <Card className={cn(
            'shadow-lg border-0 w-80',
            toast.type === 'success' ? 'bg-emerald-50' : 'bg-red-50'
          )}>
            <CardContent className="p-4 flex items-center gap-3">
              {toast.type === 'success' ? (
                <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
              ) : (
                <X className="h-5 w-5 text-red-600 shrink-0" />
              )}
              <p className={cn(
                'text-sm font-medium',
                toast.type === 'success' ? 'text-emerald-800' : 'text-red-800'
              )}>
                {toast.message}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
