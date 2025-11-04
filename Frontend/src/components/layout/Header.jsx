import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';
import {
  Bell,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  Users,
  Calendar,
  Building2,
  DollarSign,
  UserCheck,
  Briefcase,
  Laptop,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react';
import logo from '../../assets/download.jpg';

export const Header = () => {
  const { user, logout, isHR } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDepartmentName = (dept) => {
    if (!dept) return '';
    if (typeof dept === 'string') return dept;
    if (typeof dept === 'object' && dept.name) return dept.name;
    return '';
  };

  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return Sun;
      case 'dark':
        return Moon;
      default:
        return Monitor;
    }
  };
  const ThemeIcon = getThemeIcon();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const navigationItems = isHR
    ? [
        { label: 'Dashboard', href: '/dashboard', icon: Building2 },
        { label: 'Employees', href: '/employees', icon: Users },
        { label: 'Departments', href: '/departments', icon: Building2 },
        { label: 'Attendance', href: '/attendance', icon: UserCheck },
        { label: 'Salary', href: '/salary', icon: DollarSign },
        { label: 'Leave Requests', href: '/leave-requests', icon: Calendar },
        { label: 'Recruitment', href: '/recruitment', icon: Briefcase },
        { label: 'Device Management', href: '/device-management', icon: Laptop },
        { label: 'Calendar', href: '/calendar', icon: Calendar },
        { label: "Goals", href: "/goals", icon: Briefcase },
        { label: "Settings ", href: "/settings", icon: Settings },
      ]
    : [
        { label: 'Dashboard', href: '/dashboard', icon: Building2 },
        { label: 'My Profile', href: '/profile', icon: User },
        { label: 'Attendance', href: '/attendance', icon: UserCheck },
        { label: 'My Salary', href: '/salary', icon: DollarSign },
        { label: 'Leave Requests', href: '/leave-requests', icon: Calendar },
        { label: 'Calendar', href: '/calendar', icon: Calendar },
        { label: 'My Devices', href: '/my-devices', icon: Laptop },
        { label: "Goals", href: "/goals", icon: Briefcase },
        { label: "Settings ", href: "/settings", icon: Settings },
      ];

  return (
    <header className="sticky top-0 z-50 lg:hidden bg-background border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/dashboard"
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <img src={logo} alt="GammoDA Logo" className="w-8 h-8 object-cover" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-foreground">GammoDA</h1>
              <p className="text-xs text-muted-foreground -mt-1">HRM System</p>
            </div>
          </Link>

          {/* User & Menu */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              title={`Current theme: ${theme}`}
            >
              <ThemeIcon className="w-5 h-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 hover:bg-accent">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user?.name?.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <Badge variant={isHR ? 'default' : 'secondary'} className="text-xs">
                      {isHR ? 'HR Manager' : 'Employee'}
                    </Badge>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                  <Badge variant={isHR ? 'default' : 'secondary'} className="text-xs mt-1">
                    {getDepartmentName(user?.department)}
                  </Badge>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="py-4 border-t animate-fade-in">
            <nav className="flex flex-col space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-primary hover:bg-accent transition-all duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
