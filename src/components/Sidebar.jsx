import {
  LayoutDashboard,
  Users,
  GraduationCap,
  School,
  ClipboardCheck,
  Star,
  Wallet,
  Megaphone,
  ClipboardList,
  Heart,
  Award,
  FileText,
  LogOut,
  Settings as SettingsIcon,
  Timer,
  Banknote,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { useAuth } from '../contexts/AuthContext';
import ROLE_CONFIG from '../data/roleConfig';
import { useSchoolConfig } from '../contexts/SchoolConfigContext';

const allMenuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'students', label: 'Students', icon: Users },
  { id: 'teachers', label: 'Teachers', icon: GraduationCap },
  { id: 'attendance', label: 'Attendance', icon: ClipboardCheck },
  { id: 'grades', label: 'Grades', icon: Star },
  { id: 'fees', label: 'Fees', icon: Wallet },
  { id: 'announcements', label: 'Announcements', icon: Megaphone },
  { id: 'behavior', label: 'Behavior', icon: ClipboardList },
  { id: 'wellness', label: 'Wellness', icon: Heart },
  { id: 'alumni', label: 'Alumni', icon: Award },
  { id: 'reports', label: 'DepEd Reports', icon: FileText },
  { id: 'timelogs', label: 'Time Logs', icon: Timer },
  { id: 'payroll', label: 'Payroll', icon: Banknote },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
];

export default function Sidebar({ active, setActive, isOpen, setIsOpen }) {
  const { user, logout } = useAuth();
  const { schoolYear } = useSchoolConfig();
  const roleConfig = user ? ROLE_CONFIG[user.role] : null;
  const allowedPages = roleConfig?.allowedPages || [];

  const menuItems = allMenuItems.filter(item => allowedPages.includes(item.id));

  const initials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    : 'U';

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-10 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-[220px] bg-sidebar z-20 flex flex-col",
          "transform transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0 md:static md:z-auto"
        )}
      >
        {/* Logo */}
        <div className="px-5 py-5">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <GraduationCap className="h-4.5 w-4.5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sidebar-foreground font-bold text-[15px] tracking-tight leading-none">SchoolERP</h1>
              <p className="text-sidebar-foreground/40 text-[10px] mt-0.5 tracking-wide uppercase font-medium">A.Y. {schoolYear.replace('-', ' – ')}</p>
            </div>
          </div>
        </div>

        <div className="mx-4 h-px bg-sidebar-border/60" />

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActive(item.id); setIsOpen(false); }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 h-9 rounded-lg text-[13px] font-medium transition-all duration-150 relative",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm shadow-black/20"
                    : "text-sidebar-foreground/60 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground/90"
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full bg-primary" />
                )}
                <Icon className="h-[16px] w-[16px] shrink-0" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="mx-4 h-px bg-sidebar-border/60" />

        {/* User */}
        <div className="px-3 py-3">
          <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-sidebar-accent/30 transition-colors">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/25 text-primary-foreground text-[11px] font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sidebar-foreground text-[12px] font-semibold truncate leading-tight">
                {user ? `${user.firstName} ${user.lastName}` : 'User'}
              </p>
              <p className="text-sidebar-foreground/40 text-[11px] truncate leading-tight">
                {roleConfig?.label || 'Unknown Role'}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="h-7 w-7 text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 flex-shrink-0"
              title="Sign out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
