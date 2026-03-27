import { useState, useEffect, useMemo } from 'react';
import {
  Megaphone, Plus, Search, Pin, PinOff, Eye, EyeOff,
  Pencil, Trash2, Calendar, Clock, Users, GraduationCap,
  UserCheck, Shield, ChevronDown, ChevronUp, AlertTriangle,
  Send, X, CheckCircle2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Select } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { isSupabaseConfigured } from '../lib/supabase';
import { useAnnouncements as useAnnouncementsHook } from '../hooks/useAnnouncements';

// ============================================================
// SAMPLE DATA
// ============================================================

const AUDIENCES = ['All', 'Teachers', 'Parents', 'Students', 'Admin'];

const AUDIENCE_CONFIG = {
  All:      { color: 'bg-indigo-100 text-indigo-700',  icon: Users,         label: 'All' },
  Teachers: { color: 'bg-emerald-100 text-emerald-700', icon: GraduationCap, label: 'Teachers' },
  Parents:  { color: 'bg-amber-100 text-amber-700',     icon: UserCheck,     label: 'Parents' },
  Students: { color: 'bg-blue-100 text-blue-700',       icon: Users,         label: 'Students' },
  Admin:    { color: 'bg-red-100 text-red-700',          icon: Shield,        label: 'Admin' },
};

const AUDIENCE_TOTALS = {
  All: 320,
  Teachers: 42,
  Parents: 280,
  Students: 210,
  Admin: 8,
};

const initialAnnouncements = [
  {
    id: 1,
    title: 'Final Examinations Schedule — Second Semester',
    body: 'The final examinations for the second semester will take place from March 30 to April 4, 2026. Students must bring their exam permits and school IDs. Review materials have been uploaded to the student portal. Please coordinate with your subject teachers for any specific requirements.\n\nExam rooms will be posted on the bulletin board by March 27. Late students will not be allowed entry after 15 minutes.',
    audience: 'All',
    pinned: true,
    author: 'Admin User',
    authorInitials: 'AD',
    createdAt: '2026-03-24T08:00:00',
    expiresAt: '2026-04-05',
    readCount: 287,
  },
  {
    id: 2,
    title: 'Faculty Meeting — Grading Deliberation',
    body: 'All teachers are required to attend the grading deliberation meeting on March 28, 2026 at 2:00 PM in the AVR. Please prepare your grade sheets, class records, and any pending incident reports. Attendance is mandatory.',
    audience: 'Teachers',
    pinned: true,
    author: 'Principal Santos',
    authorInitials: 'PS',
    createdAt: '2026-03-23T14:30:00',
    expiresAt: '2026-03-29',
    readCount: 38,
  },
  {
    id: 3,
    title: 'Parent-Teacher Conference Rescheduled',
    body: 'The Parent-Teacher Conference originally scheduled for March 25 has been moved to April 1, 2026. The new schedule is from 8:00 AM to 12:00 PM. Please bring your child\'s report card acknowledgement slip. Light refreshments will be served.',
    audience: 'Parents',
    pinned: false,
    author: 'Admin User',
    authorInitials: 'AD',
    createdAt: '2026-03-22T10:15:00',
    expiresAt: '2026-04-02',
    readCount: 163,
  },
  {
    id: 4,
    title: 'Intramurals Team Registration Now Open',
    body: 'Students may now register for the upcoming Intramurals through their class advisers. Available sports include basketball, volleyball, badminton, chess, and track & field. Registration deadline is March 31. Each student may join up to two individual and one team sport.',
    audience: 'Students',
    pinned: false,
    author: 'Coach Reyes',
    authorInitials: 'CR',
    createdAt: '2026-03-21T09:00:00',
    expiresAt: '2026-04-01',
    readCount: 142,
  },
  {
    id: 5,
    title: 'System Maintenance — Student Portal Downtime',
    body: 'The student information system will undergo scheduled maintenance on March 26 from 10:00 PM to 6:00 AM. During this period, the portal, grade viewer, and fee payment modules will be temporarily unavailable. Please plan accordingly.',
    audience: 'Admin',
    pinned: false,
    author: 'IT Department',
    authorInitials: 'IT',
    createdAt: '2026-03-20T16:45:00',
    expiresAt: '2026-03-27',
    readCount: 7,
  },
  {
    id: 6,
    title: 'Uniform Policy Reminder',
    body: 'This is a reminder that all students must adhere to the prescribed uniform policy starting next week. Monday to Thursday: complete school uniform. Friday: PE uniform or org shirt with school ID. Students not in proper uniform will be asked to change before entering class.',
    audience: 'Students',
    pinned: false,
    author: 'Discipline Office',
    authorInitials: 'DO',
    createdAt: '2026-03-19T07:30:00',
    expiresAt: '2026-04-30',
    readCount: 189,
  },
  {
    id: 7,
    title: 'New Grading System Guidelines Released',
    body: 'The updated DepEd grading system guidelines for SY 2025-2026 are now available. Key changes include revised weight distributions for Written Work (25%), Performance Tasks (50%), and Quarterly Assessment (25%). Please review the memo attached in the Teachers Portal and update your class records accordingly.',
    audience: 'Teachers',
    pinned: false,
    author: 'Academic Head',
    authorInitials: 'AH',
    createdAt: '2026-03-18T11:00:00',
    expiresAt: '2026-06-30',
    readCount: 41,
  },
  {
    id: 8,
    title: 'Tuition Fee Payment Deadline Extended',
    body: 'The deadline for the second semester tuition fee payment has been extended to April 10, 2026. Parents may settle payments at the cashier\'s office (Mon-Fri, 8 AM - 4 PM) or through the online payment portal. A 2% surcharge applies after the deadline.',
    audience: 'Parents',
    pinned: false,
    author: 'Finance Office',
    authorInitials: 'FO',
    createdAt: '2026-03-17T13:20:00',
    expiresAt: '2026-04-10',
    readCount: 201,
  },
];

// ============================================================
// HELPERS
// ============================================================

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function timeAgo(dateStr) {
  const now = new Date('2026-03-24T12:00:00');
  const d = new Date(dateStr);
  const diff = Math.floor((now - d) / 1000);
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  const days = Math.floor(diff / 86400);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return formatDate(dateStr);
}

const emptyForm = {
  title: '',
  body: '',
  audience: 'All',
  pinned: false,
  expiresAt: '',
};

// ============================================================
// COMPONENT
// ============================================================

export default function Announcements() {
  const { isReadOnly: checkReadOnly } = useAuth();
  const readOnly = checkReadOnly('announcements');
  const { announcements: sbAnnouncements, loading: sbLoading, refetch, create: sbCreate, update: sbUpdate, remove: sbRemove } = useAnnouncementsHook();
  const [announcements, setAnnouncements] = useState(initialAnnouncements);

  // Sync from Supabase when available
  useEffect(() => {
    if (isSupabaseConfigured && !sbLoading && sbAnnouncements.length > 0) {
      setAnnouncements(sbAnnouncements);
    }
  }, [sbAnnouncements, sbLoading]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAudience, setFilterAudience] = useState('All');
  const [expandedIds, setExpandedIds] = useState(new Set());

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState('compose');
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [formErrors, setFormErrors] = useState({});

  // Delete confirmation
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

  // Toast
  const [toast, setToast] = useState(null);

  // Filtered & sorted announcements
  const filteredAnnouncements = useMemo(() => {
    let result = [...announcements];

    if (filterAudience !== 'All') {
      result = result.filter(a => a.audience === filterAudience);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.body.toLowerCase().includes(q) ||
        a.author.toLowerCase().includes(q)
      );
    }

    // Pinned first, then by date descending
    result.sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return result;
  }, [announcements, searchQuery, filterAudience]);

  const stats = useMemo(() => {
    const total = announcements.length;
    const pinned = announcements.filter(a => a.pinned).length;
    const totalReads = announcements.reduce((sum, a) => sum + a.readCount, 0);
    const totalPossible = announcements.reduce((sum, a) => sum + AUDIENCE_TOTALS[a.audience], 0);
    return { total, pinned, totalReads, totalPossible };
  }, [announcements]);

  // ---- Actions ----

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  }

  function openCreate() {
    setForm({ ...emptyForm });
    setEditingId(null);
    setFormErrors({});
    setModalTab('compose');
    setModalOpen(true);
  }

  function openEdit(announcement) {
    setForm({
      title: announcement.title,
      body: announcement.body,
      audience: announcement.audience,
      pinned: announcement.pinned,
      expiresAt: announcement.expiresAt || '',
    });
    setEditingId(announcement.id);
    setFormErrors({});
    setModalTab('compose');
    setModalOpen(true);
  }

  function validateForm() {
    const errors = {};
    if (!form.title.trim()) errors.title = 'Title is required';
    if (!form.body.trim()) errors.body = 'Body is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleSubmit() {
    if (!validateForm()) return;

    if (editingId) {
      setAnnouncements(prev =>
        prev.map(a =>
          a.id === editingId
            ? { ...a, title: form.title, body: form.body, audience: form.audience, pinned: form.pinned, expiresAt: form.expiresAt }
            : a
        )
      );
      showToast('Announcement updated successfully');
    } else {
      const newAnnouncement = {
        id: Date.now(),
        title: form.title,
        body: form.body,
        audience: form.audience,
        pinned: form.pinned,
        author: 'Admin User',
        authorInitials: 'AD',
        createdAt: new Date().toISOString(),
        expiresAt: form.expiresAt,
        readCount: 0,
      };
      setAnnouncements(prev => [newAnnouncement, ...prev]);
      if (isSupabaseConfigured) {
        sbCreate(newAnnouncement).then(() => refetch()).catch(console.error);
      }
      showToast('Announcement posted successfully');
    }

    setModalOpen(false);
    setEditingId(null);
    setForm({ ...emptyForm });
  }

  function handleDelete(id) {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    if (isSupabaseConfigured) {
      sbRemove(id).then(() => refetch()).catch(console.error);
    }
    setDeleteDialog({ open: false, id: null });
    showToast('Announcement deleted');
  }

  function togglePin(id) {
    const target = announcements.find(a => a.id === id);
    setAnnouncements(prev =>
      prev.map(a => a.id === id ? { ...a, pinned: !a.pinned } : a)
    );
    if (isSupabaseConfigured && target) {
      sbUpdate(id, { pinned: !target.pinned }).catch(console.error);
    }
  }

  function toggleExpand(id) {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // ---- Render ----

  const pinnedCount = filteredAnnouncements.filter(a => a.pinned).length;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">

      {/* ---- Header Row ---- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <Megaphone className="h-6 w-6 text-indigo-500" />
            Announcements
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {stats.total} announcements &middot; {stats.pinned} pinned &middot; {Math.round((stats.totalReads / stats.totalPossible) * 100)}% avg. read rate
          </p>
        </div>
        {!readOnly && (
          <Button onClick={openCreate} className="gap-2 shrink-0">
            <Plus className="h-4 w-4" />
            Post Announcement
          </Button>
        )}
      </div>

      {/* ---- Filters ---- */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search announcements..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={filterAudience}
          onChange={e => setFilterAudience(e.target.value)}
          className="w-full sm:w-44"
        >
          <option value="All">All Audiences</option>
          {AUDIENCES.filter(a => a !== 'All').map(a => (
            <option key={a} value={a}>{a}</option>
          ))}
        </Select>
      </div>

      {/* ---- Feed ---- */}
      <div className="space-y-3">
        {filteredAnnouncements.length === 0 && (
          <Card>
            <CardContent className="py-16 text-center">
              <Megaphone className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground">No announcements found.</p>
            </CardContent>
          </Card>
        )}

        {/* Pinned section divider */}
        {pinnedCount > 0 && (
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <Pin className="h-3.5 w-3.5" />
            Pinned ({pinnedCount})
            <Separator className="flex-1" />
          </div>
        )}

        {filteredAnnouncements.map((a, idx) => {
          // Insert divider between pinned and unpinned
          const showUnpinnedDivider = pinnedCount > 0 && idx === pinnedCount;
          const isExpanded = expandedIds.has(a.id);
          const isLong = a.body.length > 200;
          const displayBody = isLong && !isExpanded ? a.body.slice(0, 200) + '...' : a.body;
          const audienceConf = AUDIENCE_CONFIG[a.audience];
          const AudienceIcon = audienceConf.icon;
          const total = AUDIENCE_TOTALS[a.audience];
          const readPct = Math.round((a.readCount / total) * 100);

          return (
            <div key={a.id}>
              {showUnpinnedDivider && (
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 mt-4">
                  <Clock className="h-3.5 w-3.5" />
                  Recent
                  <Separator className="flex-1" />
                </div>
              )}

              <Card className={cn(
                "transition-all",
                a.pinned && "border-indigo-200 bg-indigo-50/30"
              )}>
                <CardContent className="p-4 sm:p-5">
                  {/* Top row: meta + actions */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <Avatar className="h-9 w-9 shrink-0">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                          {a.authorInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-foreground">{a.author}</span>
                          <span className="text-xs text-muted-foreground">{timeAgo(a.createdAt)}</span>
                          {a.pinned && <Pin className="h-3.5 w-3.5 text-indigo-500" />}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                            audienceConf.color
                          )}>
                            <AudienceIcon className="h-3 w-3" />
                            {audienceConf.label}
                          </span>
                          {a.expiresAt && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Expires {formatDate(a.expiresAt)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {!readOnly && (
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={() => togglePin(a.id)}
                          title={a.pinned ? 'Unpin' : 'Pin'}
                        >
                          {a.pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={() => openEdit(a)}
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => setDeleteDialog({ open: true, id: a.id })}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-semibold text-foreground mt-3 leading-snug">
                    {a.title}
                  </h3>

                  {/* Body */}
                  <p className="text-sm text-muted-foreground mt-2 whitespace-pre-line leading-relaxed">
                    {displayBody}
                  </p>
                  {isLong && (
                    <button
                      onClick={() => toggleExpand(a.id)}
                      className="text-xs text-primary hover:underline mt-1 inline-flex items-center gap-1 font-medium"
                    >
                      {isExpanded ? (
                        <><ChevronUp className="h-3 w-3" /> Show less</>
                      ) : (
                        <><ChevronDown className="h-3 w-3" /> Read more</>
                      )}
                    </button>
                  )}

                  {/* Read receipts */}
                  <div className="flex items-center gap-3 mt-4 pt-3 border-t">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Eye className="h-3.5 w-3.5" />
                      <span className="font-medium">{a.readCount}/{total}</span>
                      <span>read</span>
                    </div>
                    <div className="flex-1 max-w-[200px]">
                      <Progress value={readPct} className="h-1.5" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">{readPct}%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {/* ---- Create / Edit Modal ---- */}
      <Dialog open={modalOpen} onOpenChange={(open) => { if (!open) { setModalOpen(false); setEditingId(null); } }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Announcement' : 'Post Announcement'}</DialogTitle>
            <DialogDescription>
              {editingId ? 'Update the announcement details below.' : 'Compose a new announcement for your school community.'}
            </DialogDescription>
          </DialogHeader>

          <Tabs value={modalTab} onValueChange={setModalTab}>
            <TabsList className="w-full">
              <TabsTrigger value="compose" className="flex-1">Compose</TabsTrigger>
              <TabsTrigger value="preview" className="flex-1">Preview</TabsTrigger>
            </TabsList>

            {/* ---- Compose Tab ---- */}
            <TabsContent value="compose" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="ann-title">Title <span className="text-destructive">*</span></Label>
                <Input
                  id="ann-title"
                  placeholder="Enter announcement title..."
                  value={form.title}
                  onChange={e => { setForm(f => ({ ...f, title: e.target.value })); setFormErrors(fe => ({ ...fe, title: undefined })); }}
                  className={cn(formErrors.title && "border-destructive")}
                />
                {formErrors.title && <p className="text-xs text-destructive">{formErrors.title}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ann-body">Body <span className="text-destructive">*</span></Label>
                <textarea
                  id="ann-body"
                  rows={6}
                  placeholder="Write your announcement..."
                  value={form.body}
                  onChange={e => { setForm(f => ({ ...f, body: e.target.value })); setFormErrors(fe => ({ ...fe, body: undefined })); }}
                  className={cn(
                    "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y min-h-[120px]",
                    formErrors.body && "border-destructive"
                  )}
                />
                {formErrors.body && <p className="text-xs text-destructive">{formErrors.body}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ann-audience">Audience</Label>
                  <Select
                    id="ann-audience"
                    value={form.audience}
                    onChange={e => setForm(f => ({ ...f, audience: e.target.value }))}
                  >
                    {AUDIENCES.map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ann-expires">Expiry Date</Label>
                  <Input
                    id="ann-expires"
                    type="date"
                    value={form.expiresAt}
                    onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))}
                  />
                </div>
              </div>

              {/* Pin Toggle */}
              <div className="flex items-center justify-between rounded-md border px-4 py-3">
                <div className="flex items-center gap-3">
                  <Pin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Pin this announcement</p>
                    <p className="text-xs text-muted-foreground">Pinned announcements stay at the top of the feed</p>
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={form.pinned}
                  onClick={() => setForm(f => ({ ...f, pinned: !f.pinned }))}
                  className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors",
                    form.pinned ? "bg-primary" : "bg-muted"
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
                      form.pinned ? "translate-x-5" : "translate-x-0"
                    )}
                  />
                </button>
              </div>
            </TabsContent>

            {/* ---- Preview Tab ---- */}
            <TabsContent value="preview" className="mt-4">
              {(!form.title.trim() && !form.body.trim()) ? (
                <div className="py-12 text-center text-muted-foreground">
                  <EyeOff className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Nothing to preview yet. Start composing your announcement.</p>
                </div>
              ) : (
                <Card className={cn(form.pinned && "border-indigo-200 bg-indigo-50/30")}>
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">AD</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">Admin User</span>
                          <span className="text-xs text-muted-foreground">Just now</span>
                          {form.pinned && <Pin className="h-3.5 w-3.5 text-indigo-500" />}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {(() => {
                            const conf = AUDIENCE_CONFIG[form.audience];
                            const Icon = conf.icon;
                            return (
                              <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium", conf.color)}>
                                <Icon className="h-3 w-3" />
                                {conf.label}
                              </span>
                            );
                          })()}
                          {form.expiresAt && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Expires {formatDate(form.expiresAt)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <h3 className="text-base font-semibold text-foreground mt-3 leading-snug">
                      {form.title || 'Untitled Announcement'}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2 whitespace-pre-line leading-relaxed">
                      {form.body || 'No content yet.'}
                    </p>
                    <div className="flex items-center gap-3 mt-4 pt-3 border-t">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Eye className="h-3.5 w-3.5" />
                        <span className="font-medium">0/{AUDIENCE_TOTALS[form.audience]}</span>
                        <span>read</span>
                      </div>
                      <div className="flex-1 max-w-[200px]">
                        <Progress value={0} className="h-1.5" />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">0%</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => { setModalOpen(false); setEditingId(null); }}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="gap-2">
              <Send className="h-4 w-4" />
              {editingId ? 'Update' : 'Post'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ---- Delete Confirmation ---- */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => { if (!open) setDeleteDialog({ open: false, id: null }); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete Announcement
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. The announcement will be permanently removed from the feed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, id: null })}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => handleDelete(deleteDialog.id)} className="gap-2">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ---- Toast ---- */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
          <Card className="border-emerald-200 bg-emerald-50 shadow-lg">
            <CardContent className="flex items-center gap-3 p-4">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <span className="text-sm font-medium text-emerald-800">{toast}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0 text-emerald-600 hover:text-emerald-800" onClick={() => setToast(null)}>
                <X className="h-3.5 w-3.5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
