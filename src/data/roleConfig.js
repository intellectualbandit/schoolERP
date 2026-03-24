import {
  Shield, GraduationCap, BookOpen, Users, UserCheck,
  ClipboardList, Wallet, Heart,
} from 'lucide-react';

// Permission levels: 'rw' = read-write, 'r' = read-only, 'r*' = read scoped to own data, 'rw*' = rw scoped, 'r+' = read + can create
// null / undefined = no access (page hidden)

const ROLE_CONFIG = {
  admin: {
    label: 'Administrator',
    shortLabel: 'Admin',
    color: 'bg-red-100 text-red-700 border-red-200',
    badgeColor: 'bg-red-500',
    icon: Shield,
    allowedPages: ['dashboard','students','teachers','attendance','grades','fees','announcements','behavior','wellness','alumni','reports'],
    permissions: {
      dashboard: 'rw', students: 'rw', teachers: 'rw', attendance: 'rw',
      grades: 'rw', fees: 'rw', announcements: 'rw', behavior: 'rw',
      wellness: 'rw', alumni: 'rw', reports: 'rw',
    },
  },
  principal: {
    label: 'Principal',
    shortLabel: 'Principal',
    color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    badgeColor: 'bg-indigo-500',
    icon: GraduationCap,
    allowedPages: ['dashboard','students','teachers','attendance','grades','fees','announcements','behavior','wellness','alumni','reports'],
    permissions: {
      dashboard: 'r', students: 'r', teachers: 'r', attendance: 'r',
      grades: 'r', fees: 'r', announcements: 'rw', behavior: 'r',
      wellness: 'r', alumni: 'r', reports: 'r',
    },
  },
  teacher: {
    label: 'Teacher',
    shortLabel: 'Teacher',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    badgeColor: 'bg-emerald-500',
    icon: BookOpen,
    allowedPages: ['dashboard','students','attendance','grades','announcements','behavior','wellness'],
    permissions: {
      dashboard: 'r', students: 'r*', attendance: 'rw*',
      grades: 'rw*', announcements: 'r+', behavior: 'rw*',
      wellness: 'r*',
    },
  },
  student: {
    label: 'Student',
    shortLabel: 'Student',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    badgeColor: 'bg-blue-500',
    icon: Users,
    allowedPages: ['dashboard','attendance','grades','fees','announcements','wellness'],
    permissions: {
      dashboard: 'r', attendance: 'r*', grades: 'r*',
      fees: 'r*', announcements: 'r', wellness: 'rw*',
    },
  },
  parent: {
    label: 'Parent',
    shortLabel: 'Parent',
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    badgeColor: 'bg-amber-500',
    icon: UserCheck,
    allowedPages: ['dashboard','attendance','grades','fees','announcements','behavior'],
    permissions: {
      dashboard: 'r', attendance: 'r*', grades: 'r*',
      fees: 'r*', announcements: 'r', behavior: 'r*',
    },
  },
  registrar: {
    label: 'Registrar',
    shortLabel: 'Registrar',
    color: 'bg-violet-100 text-violet-700 border-violet-200',
    badgeColor: 'bg-violet-500',
    icon: ClipboardList,
    allowedPages: ['dashboard','students','attendance','grades','announcements','alumni','reports'],
    permissions: {
      dashboard: 'r', students: 'rw', attendance: 'r',
      grades: 'r', announcements: 'r', alumni: 'rw', reports: 'rw',
    },
  },
  cashier: {
    label: 'Cashier',
    shortLabel: 'Cashier',
    color: 'bg-teal-100 text-teal-700 border-teal-200',
    badgeColor: 'bg-teal-500',
    icon: Wallet,
    allowedPages: ['dashboard','fees','announcements','reports'],
    permissions: {
      dashboard: 'r', fees: 'rw', announcements: 'r', reports: 'r',
    },
  },
  counselor: {
    label: 'Guidance Counselor',
    shortLabel: 'Counselor',
    color: 'bg-pink-100 text-pink-700 border-pink-200',
    badgeColor: 'bg-pink-500',
    icon: Heart,
    allowedPages: ['dashboard','students','attendance','grades','behavior','wellness'],
    permissions: {
      dashboard: 'r', students: 'r', attendance: 'r',
      grades: 'r', behavior: 'rw', wellness: 'rw',
    },
  },
};

export default ROLE_CONFIG;
