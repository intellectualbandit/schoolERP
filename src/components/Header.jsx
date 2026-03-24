import { Menu, Bell, LogOut, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
} from './ui/dropdown-menu';
import { useAuth } from '../contexts/AuthContext';
import ROLE_CONFIG from '../data/roleConfig';

const labels = {
  dashboard: 'Dashboard',
  students: 'Students',
  teachers: 'Teachers',
  classes: 'Classes',
  attendance: 'Attendance',
  grades: 'Grades',
  fees: 'Fees',
  announcements: 'Announcements',
  behavior: 'Behavior Log',
  wellness: 'Student Wellness',
  alumni: 'Alumni Tracker',
  reports: 'DepEd Reports',
};

export default function Header({ active, setIsOpen }) {
  const { user, logout } = useAuth();
  const roleConfig = user ? ROLE_CONFIG[user.role] : null;

  const initials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    : 'U';

  return (
    <header className="bg-background/80 backdrop-blur-md border-b px-4 lg:px-6 py-2.5 flex items-center gap-3 sticky top-0 z-10">
      {/* Hamburger - mobile only */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(prev => !prev)}
        className="md:hidden h-8 w-8 text-muted-foreground"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Page title */}
      <div className="flex items-center gap-1.5 flex-1 min-w-0">
        <h2 className="text-sm font-semibold text-foreground truncate">
          {labels[active] || 'Dashboard'}
        </h2>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1.5">
        {roleConfig && (
          <Badge variant="outline" className={`text-[11px] px-2 py-0.5 hidden sm:inline-flex font-medium ${roleConfig.color}`}>
            {roleConfig.shortLabel}
          </Badge>
        )}

        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold">{user ? `${user.firstName} ${user.lastName}` : 'User'}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50">
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
