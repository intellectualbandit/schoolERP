import { Menu, Bell, LogOut, User } from 'lucide-react';
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
    <header className="bg-background border-b px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
      {/* Hamburger - mobile only */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(prev => !prev)}
        className="md:hidden h-8 w-8"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Page title */}
      <h2 className="text-base font-semibold text-foreground flex-1">
        {labels[active] || 'Dashboard'}
      </h2>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {roleConfig && (
          <Badge variant="outline" className={`text-xs px-2 py-0.5 hidden sm:inline-flex ${roleConfig.color}`}>
            {roleConfig.shortLabel}
          </Badge>
        )}

        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
          <Bell className="h-4 w-4" />
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
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user ? `${user.firstName} ${user.lastName}` : 'User'}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer">
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
