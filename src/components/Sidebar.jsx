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
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'students', label: 'Students', icon: Users },
  { id: 'teachers', label: 'Teachers', icon: GraduationCap },
  { id: 'classes', label: 'Classes', icon: School },
  { id: 'attendance', label: 'Attendance', icon: ClipboardCheck },
  { id: 'grades', label: 'Grades', icon: Star },
  { id: 'fees', label: 'Fees', icon: Wallet },
  { id: 'announcements', label: 'Announcements', icon: Megaphone },
  { id: 'behavior', label: 'Behavior', icon: ClipboardList },
  { id: 'wellness', label: 'Wellness', icon: Heart },
  { id: 'alumni', label: 'Alumni', icon: Award },
  { id: 'reports', label: 'DepEd Reports', icon: FileText },
];

export default function Sidebar({ active, setActive, isOpen, setIsOpen }) {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-10 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-56 bg-sidebar z-20 flex flex-col",
          "transform transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0 md:static md:z-auto"
        )}
      >
        {/* Logo */}
        <div className="px-5 py-5">
          <h1 className="text-sidebar-foreground font-bold text-lg tracking-tight">SchoolERP</h1>
          <p className="text-sidebar-foreground/50 text-xs mt-0.5">A.Y. 2025 - 2026</p>
        </div>

        <Separator className="bg-sidebar-border" />

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => { setActive(item.id); setIsOpen(false); }}
                className={cn(
                  "w-full justify-start gap-3 px-3 h-10 text-sm font-medium",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Button>
            );
          })}
        </nav>

        <Separator className="bg-sidebar-border" />

        {/* User */}
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground text-xs font-bold">
                AD
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sidebar-foreground text-xs font-semibold truncate">Admin User</p>
              <p className="text-sidebar-foreground/50 text-xs truncate">Administrator</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
