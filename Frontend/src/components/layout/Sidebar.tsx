"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { useTheme } from "../../contexts/ThemeContext"
import { Button } from "../ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu"
import { Badge } from "../ui/badge"
import {
  Settings,
  User,
  LogOut,
  Users,
  Calendar,
  Building2,
  DollarSign,
  UserCheck,
  Briefcase,
  Sun,
  Moon,
  Monitor,
  Laptop,
  ChevronDown,
} from "lucide-react"
import logo  from '../../assets/download.jpg';

export const Sidebar = () => {
  const { user, logout, isHR } = useAuth()
  const { theme, setTheme } = useTheme()
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const getDepartmentName = (dept) => {
    if (!dept) return ""
    if (typeof dept === "string") return dept
    if (typeof dept === "object" && dept.name) return dept.name
    return ""
  }

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark")
    } else if (theme === "dark") {
      setTheme("system")
    } else {
      setTheme("light")
    }
  }

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return Sun
      case "dark":
        return Moon
      default:
        return Monitor
    }
  }

  const ThemeIcon = getThemeIcon()

  const handleLogout = () => {
    logout()
  }

  const navigationItems = isHR
    ? [
        { label: "Dashboard", href: "/dashboard", icon: Building2 },
        { label: "Employees", href: "/employees", icon: Users },
        { label: "Departments", href: "/departments", icon: Building2 },
        { label: "Attendance", href: "/attendance", icon: UserCheck },
        { label: "Salary", href: "/salary", icon: DollarSign },
        { label: "Leave Requests", href: "/leave-requests", icon: Calendar },
        { label: "Recruitment", href: "/recruitment", icon: Briefcase },
        { label: "Device Management", href: "/device-management", icon: Laptop },
        { label: 'Calendar', href: '/calendar', icon: Calendar },
        { label: "Goals", href: "/goals", icon: Briefcase },
        { label: "Settings ", href: "/settings", icon: Settings },
      ]
    : [
        { label: "Dashboard", href: "/dashboard", icon: Building2 },
        { label: "My Profile", href: "/profile", icon: User },
        { label: "Attendance", href: "/attendance", icon: UserCheck },
        { label: "My Salary", href: "/salary", icon: DollarSign },
        { label: "Leave Requests", href: "/leave-requests", icon: Calendar },
        { label: "Calendar", href: "/calendar", icon: Calendar },
        { label: "My Devices", href: "/my-devices", icon: Laptop },
        { label: "Goals", href: "/goals", icon: Briefcase },
        { label: "Settings ", href: "/settings", icon: Settings },
      ]

  const isActiveLink = (href) => location.pathname === href

  return (
    <aside
      className={`hidden lg:flex lg:sticky top-0 lg:h-screen flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      } flex-shrink-0`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 ml-5">
        <Link
          to="/dashboard"
          className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <img src={logo} alt="GammoDA Logo" className="w-8 h-8 object-cover rounded" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="font-bold text-xl text-foreground">GammoDA</h1>
              <p className="text-xs text-muted-foreground -mt-1">HRM System</p>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActiveLink(item.href);
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-all duration-200 ${
                    active
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Controls */}
      <div className="border-t border-sidebar-border p-4 space-y-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
          title={`Current theme: ${theme}`}
        >
          <ThemeIcon className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="text-sm ml-2">Theme</span>}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={`w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent ${
                isCollapsed ? "p-0" : ""
              }`}
            >
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarImage src={user?.profileImage || user?.avatar || "/placeholder.svg"} alt={user?.name} />
                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
                  {user?.name?.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="flex-1 text-left ml-2 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.name}</p>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {isHR ? "HR" : "Employee"}
                  </Badge>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
              <Badge variant={isHR ? "default" : "secondary"} className="text-xs mt-1">
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
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={`w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent ${
                isCollapsed ? "p-0" : ""
              }`}
            >
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarImage src={user?.profileImage || user?.avatar || "/placeholder.svg"} alt={user?.name} />
                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
                  {user?.name?.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="flex-1 text-left ml-2 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.name}</p>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {isHR ? "HR" : "Employee"}
                  </Badge>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
              <Badge variant={isHR ? "default" : "secondary"} className="text-xs mt-1">
                {getDepartmentName(user?.department)}
              </Badge>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile" className="flex items-center">
                <User className="w-4 h-4 mr-2" /> Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings" className="flex items-center">
                <Settings className="w-4 h-4 mr-2" /> Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <ChevronDown
            className={`w-5 h-5 flex-shrink-0 transition-transform ${
              isCollapsed ? "rotate-90" : "-rotate-90"
            }`}
          />
          {!isCollapsed && <span className="text-sm ml-2">Collapse</span>}
        </Button>
      </div>
    </aside>
  )
}
