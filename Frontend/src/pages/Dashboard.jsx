import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '../components/dashboard/StatCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import {
  Users, UserCheck, DollarSign, Calendar, TrendingUp, TrendingDown,
  Clock, Building2, Bell, Target, Award, Activity
} from 'lucide-react';
const API_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const { user, isHR } = useAuth();
  const navigate = useNavigate();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [attendanceStats, setAttendanceStats] = useState({ present: 0, absent: 0, total: 0, late: 0, leave: 0 });
  const [totalEmployees, setTotalEmployees] = useState(null);

  const API_BASE = API_URL;
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  const formatEvent = (e) => {
    try {
      // Format date as local date, and append time if available
      const d = new Date(e.date);
      const dateText = isNaN(d.getTime())
        ? String(e.date)
        : `${d.toLocaleDateString()}${e.time ? `, ${e.time}` : ''}`;
      return {
        id: e._id || e.id,
        title: e.title,
        type: e.type || 'meeting',
        date: dateText,
      };
    } catch {
      return { id: e._id || e.id, title: e.title, type: e.type || 'meeting', date: String(e.date) };
    }
  };

  const fetchUpcoming = async () => {
    if (!token) return;
    setLoadingEvents(true);
    try {
      const res = await axios.get(`${API_BASE}/api/events/upcoming`, {
        params: { limit: 5 },
        headers: { Authorization: `Bearer ${token}` },
      });
      const items = Array.isArray(res.data?.data) ? res.data.data : [];
      setUpcomingEvents(items.map(formatEvent));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to load upcoming events');
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    fetchUpcoming();
    fetchActivities();
    // fetch today's attendance stats
    const fetchStats = async () => {
      if (!token) return;
      try {
        const res = await axios.get(`${API_BASE}/api/attendance/stats`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.data && res.data.stats) {
          // Treat 'late' as present for dashboard reporting
          const s = res.data.stats;
          const presentWithLate = (Number(s.present) || 0) + (Number(s.late) || 0);
          setAttendanceStats({ ...s, present: presentWithLate });
        }
      } catch (err) {
        console.error('Failed to load attendance stats', err);
      }
    };
    fetchStats();
    // fetch total employees count
    const fetchTotalEmployees = async () => {
      if (!token) return;
      try {
        const res = await axios.get(`${API_BASE}/api/employees`, { headers: { Authorization: `Bearer ${token}` } });
        const list = Array.isArray(res.data?.data) ? res.data.data : [];
        setTotalEmployees(list.length);
      } catch (err) {
        console.error('Failed to load total employees', err);
      }
    };
    fetchTotalEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Weekly attendance (will be loaded from API)
  const [attendanceData, setAttendanceData] = useState([
    { name: 'Mon', present: 0, absent: 0 },
    { name: 'Tue', present: 0, absent: 0 },
    { name: 'Wed', present: 0, absent: 0 },
    { name: 'Thu', present: 0, absent: 0 },
    { name: 'Fri', present: 0, absent: 0 },
  ]);

  const salaryData = [
    { month: 'Jan', amount: 45000 },
    { month: 'Feb', amount: 47000 },
    { month: 'Mar', amount: 48000 },
    { month: 'Apr', amount: 49000 },
    { month: 'May', amount: 51000 },
    { month: 'Jun', amount: 52000 },
  ];

  const [departmentData, setDepartmentData] = useState([]);
  const [payrollThisMonth, setPayrollThisMonth] = useState(null);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(null);
  // Employee personal stats
  const [hoursThisWeek, setHoursThisWeek] = useState(null);
  const [attendanceRateUser, setAttendanceRateUser] = useState(null);
  const [currentSalary, setCurrentSalary] = useState(null);
  const [leaveBalanceDays, setLeaveBalanceDays] = useState(null);
  const [salaryDebug, setSalaryDebug] = useState(null);
  const [showSalaryDebug, setShowSalaryDebug] = useState(false);

  useEffect(() => {
    // Fetch weekly attendance for last 5 weekdays and replace mock
    const fetchWeeklyAttendance = async () => {
      if (!token) return;
      try {
        // build last 5 weekdays (Mon-Fri). Start from today and walk backwards.
        const days = [];
        const today = new Date();
        let d = new Date(today);
        // collect 5 weekdays
        while (days.length < 5) {
          const dayOfWeek = d.getDay(); // 0 Sun .. 6 Sat
          if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            // clone date
            days.push(new Date(d));
          }
          d.setDate(d.getDate() - 1);
        }

        // days[] currently is [today-or-most-recent-weekday, ..., older]
        // we want oldest -> newest for chart (Mon..Fri)
        days.reverse();

        const results = await Promise.all(days.map(async (dt) => {
          const iso = dt.toISOString().slice(0, 10);
          try {
            const res = await axios.get(`${API_BASE}/api/attendance/stats`, {
              params: { date: iso },
              headers: { Authorization: `Bearer ${token}` },
            });
            const stats = res.data?.stats || { present: 0, absent: 0 };
            return { date: dt, stats };
          } catch (e) {
            console.error('weekly attendance fetch failed for', iso, e);
            return { date: dt, stats: { present: 0, absent: 0 } };
          }
        }));

        // Map to names (Mon..Fri) and values
        const mapped = results.map(({ date: dt, stats }) => {
          const name = dt.toLocaleDateString(undefined, { weekday: 'short' });
          const presentWithLate = (Number(stats.present) || 0) + (Number(stats.late) || 0);
          return { name, present: presentWithLate, absent: Number(stats.absent) || 0 };
        });

        setAttendanceData(mapped);
      } catch (err) {
        console.error('Failed to load weekly attendance', err);
      }
    };

    fetchWeeklyAttendance();

    const fetchDepartments = async () => {
      try {
        // Try to use a departments public endpoint first
        const deptRes = await axios.get(`${API_BASE}/api/departments/public-list`);
        // Fetch employees to count per department (fallback if departments endpoint doesn't include counts)
        const empRes = await axios.get(`${API_BASE}/api/employees`, { headers: { Authorization: `Bearer ${token}` } });

        const employees = Array.isArray(empRes.data?.data) ? empRes.data.data : [];
        const deptNames = Array.isArray(deptRes.data?.data) ? deptRes.data.data.map(d => d.name) : [];

        // Count employees per department name (use employee.department if it's a name, or employee.department.name)
        const counts = {};
        employees.forEach(emp => {
          const name = (emp?.department && (typeof emp.department === 'string' ? emp.department : emp.department?.name)) || 'Others';
          counts[name] = (counts[name] || 0) + 1;
        });

        // Ensure departments from public list are included even if count is zero
        deptNames.forEach(n => { counts[n] = counts[n] || 0; });

        const names = Object.keys(counts);

        // assign a random, visually distinct color per department
        const usedHues = [];
        const minHueDistance = 30; // degrees

        const pickUniqueHue = () => {
          let attempts = 0;
          while (attempts < 50) {
            const hue = Math.floor(Math.random() * 360);
            const ok = usedHues.every(h => {
              const d = Math.abs(h - hue);
              const dist = Math.min(d, 360 - d);
              return dist >= minHueDistance;
            });
            if (ok) {
              usedHues.push(hue);
              return hue;
            }
            attempts += 1;
          }
          // fallback
          const fallback = Math.floor(Math.random() * 360);
          usedHues.push(fallback);
          return fallback;
        };

        const data = names.map(name => {
          const hue = pickUniqueHue();
          return { name, value: counts[name], color: `hsl(${hue} 70% 50%)` };
        });
        setDepartmentData(data);
      } catch (err) {
        console.error('Failed to load department data', err);
        // fallback to previous mock
        setDepartmentData([
          { name: 'Engineering', value: 35, color: '#3b82f6' },
          { name: 'Sales', value: 25, color: '#10b981' },
          { name: 'Marketing', value: 20, color: '#f59e0b' },
          { name: 'HR', value: 10, color: '#ef4444' },
          { name: 'Others', value: 10, color: '#8b5cf6' },
        ]);
      }
    };

    fetchDepartments();
    const fetchPayrollThisMonth = async () => {
      if (!token) return;
      try {
        const payRes = await axios.get(`${API_BASE}/api/payroll`, { headers: { Authorization: `Bearer ${token}` } });
        const payrolls = Array.isArray(payRes.data?.data) ? payRes.data.data : [];
        const now = new Date();
        const month = now.getMonth();
        const year = now.getFullYear();
        const monthTotal = payrolls.reduce((sum, p) => {
          const pd = p.payDate ? new Date(p.payDate) : null;
          if (!pd) return sum;
          if (pd.getMonth() === month && pd.getFullYear() === year) return sum + (Number(p.netSalary) || 0);
          return sum;
        }, 0);
        setPayrollThisMonth(monthTotal);
      } catch (err) {
        console.error('Failed to load payrolls', err);
      }
    };

    const fetchPendingLeaveRequests = async () => {
      if (!token) return;
      try {
        // backend route is /api/leaves
        const leaveRes = await axios.get(`${API_BASE}/api/leave`, { headers: { Authorization: `Bearer ${token}` } });
        const leaves = Array.isArray(leaveRes.data?.data) ? leaveRes.data.data : [];
        const pending = leaves.filter(l => l.status === 'pending').length;
        setPendingRequestsCount(pending);
      } catch (err) {
        console.error('Failed to load leave requests', err);
      }
    };

    fetchPayrollThisMonth();
    fetchPendingLeaveRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Employee-specific data (hours this week, attendance rate, salary, leave balance)
  useEffect(() => {
    if (!token || !user || isHR) return;

    const isoDate = (d) => {
      const dd = new Date(d);
      return new Date(dd.getTime() - dd.getTimezoneOffset()*60000).toISOString().slice(0,10);
    };

    const parseWorkingMinutes = (s) => {
      if (!s || typeof s !== 'string') return 0;
      const m = s.match(/(\d+)h\s+(\d{1,2})m/);
      if (!m) return 0;
      const h = parseInt(m[1], 10);
      const mm = parseInt(m[2], 10);
      return (isNaN(h) || isNaN(mm)) ? 0 : (h * 60 + mm);
    };

    const getWeekBounds = (d) => {
      const date = new Date(d);
      const day = date.getDay(); // 0=Sun,1=Mon,...
      const diffToMonday = (day + 6) % 7; // days since Monday
      const start = new Date(date);
      start.setDate(date.getDate() - diffToMonday);
      start.setHours(0,0,0,0);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23,59,59,999);
      return { start, end };
    };

    const fetchEmployeeStats = async () => {
      try {
        // attendance history for user
        const attRes = await axios.get(`${API_BASE}/api/attendance/me`, {
          params: { limit: 30 },
          headers: { Authorization: `Bearer ${token}` },
        });
        const records = Array.isArray(attRes.data?.data) ? attRes.data.data : [];

        const today = new Date();
        const { start, end } = getWeekBounds(today);
        const capEnd = new Date(Math.min(end.getTime(), today.getTime()));

        // Count working weekdays between start..capEnd
        let totalDays = 0;
        const iter = new Date(start);
        while (iter <= capEnd) {
          const wd = iter.getDay();
          if (wd >= 1 && wd <= 5) totalDays += 1;
          iter.setDate(iter.getDate() + 1);
        }

        // Filter records within week bounds
        const weekRecords = records.filter(r => {
          const d = new Date(r.date);
          return d >= start && d <= capEnd;
        });

        const daysPresent = weekRecords.filter(r => (r.status === 'present' || r.status === 'late')).length;
        const totalMinutes = weekRecords.reduce((acc, r) => acc + parseWorkingMinutes(r.workingHours || r.hours), 0);

        setHoursThisWeek((totalMinutes / 60).toFixed(1));
        const rate = totalDays > 0 ? Math.round((daysPresent / totalDays) * 100) : 0;
        setAttendanceRateUser(`${rate}%`);

        // employee details for salary (defensive: API may return different shapes)
        try {
          const empId = user?.id || user?._id;
          if (empId) {
            const empRes = await axios.get(`${API_BASE}/api/employees/${empId}`, { headers: { Authorization: `Bearer ${token}` } });
            // store raw responses for easier debugging in the browser UI
            setSalaryDebug(prev => ({ ...prev, empRes: empRes.data }));
            console.debug('employee API response for', empId, empRes.data);
            // Common shapes: { data: { ...mappedEmployee } } or returned populated user object
            const possible = empRes.data?.data ?? empRes.data ?? {};
            // Salary might be number or string; prefer explicit number
            let salaryVal = (possible && (possible.salary ?? possible.data?.salary)) ?? user?.salary ?? null;
            // fallback: if still null, try listing employees and match by email or id
            if (salaryVal == null) {
              try {
                const allRes = await axios.get(`${API_BASE}/api/employees`, { headers: { Authorization: `Bearer ${token}` } });
                // store fallback list for debugging
                setSalaryDebug(prev => ({ ...prev, allRes: allRes.data }));
                const list = Array.isArray(allRes.data?.data) ? allRes.data.data : (Array.isArray(allRes.data) ? allRes.data : []);
                const found = list.find(e => String(e.id || e._id) === String(empId) || String(e.employeeId) === String(user?.employeeId) || (e.email && user?.email && e.email.toLowerCase() === user.email.toLowerCase()));
                if (found) {
                  console.debug('found employee in list fallback', found);
                  salaryVal = found.salary ?? found.data?.salary ?? null;
                }
              } catch (fe) {
                console.debug('fallback employees list fetch failed', fe);
              }
            }
            if (salaryVal == null) {
              console.debug('salary not found for user; empRes / user:', empRes.data, user);
              // optionally notify user in UI for easier debugging
              // toast.info('Employee salary not found (check server data)');
            }
            setCurrentSalary(salaryVal != null ? Number(salaryVal) : null);
          } else {
            setCurrentSalary(user?.salary ?? null);
          }
        } catch (e) {
          console.error('Failed to fetch employee details', e);
          setCurrentSalary(user?.salary ?? null);
        }

        // leave balance: sum approved leave days for this user
        try {
          const leaveRes = await axios.get(`${API_BASE}/api/leave`, { headers: { Authorization: `Bearer ${token}` } });
          const leaves = Array.isArray(leaveRes.data?.data) ? leaveRes.data.data : [];
          const approvedDays = leaves.filter(l => l.status === 'approved').reduce((s, l) => s + (Number(l.days) || 0), 0);
          setLeaveBalanceDays(approvedDays);
        } catch (e) {
          console.error('Failed to fetch leaves for employee', e);
          setLeaveBalanceDays(0);
        }
      } catch (err) {
        console.error('Failed to load employee attendance', err);
      }
    };

    fetchEmployeeStats();
  }, [token, user, isHR]);

  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(false);

  const fallbackRecentActivities = [
    { id: 1, user: 'leul Gedion', action: 'submitted leave request', time: '2 hours ago', type: 'leave' },
    { id: 2, user: 'Abebe Kebede', action: 'marked attendance', time: '3 hours ago', type: 'attendance' },
    { id: 3, user: 'Habtumu Teshome', action: 'updated profile', time: '5 hours ago', type: 'profile' },
    { id: 4, user: 'Jossy Chencha', action: 'applied for Engineering role', time: '1 day ago', type: 'recruitment' },
  ];

  const fetchActivities = async (limit = isHR ? 6 : 8) => {
    if (!token) return;
    setLoadingActivities(true);
    try {
      const params = { limit };
      // If not HR, only fetch my activities
      if (!isHR) params.mine = true;
      const res = await axios.get(`${API_BASE}/api/activities`, { params, headers: { Authorization: `Bearer ${token}` } });
      const list = Array.isArray(res.data?.data) ? res.data.data : [];
      setActivities(list);
    } catch (err) {
      console.error('Failed to load activities', err);
    } finally {
      setLoadingActivities(false);
    }
  };

  // upcomingEvents now comes from API

  if (isHR) {
    return (
      <div className="container mx-auto p-6 space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-hero rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
              <p className="text-blue-100">Here's what's happening in your organization today.</p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold">{new Date().toLocaleDateString()}</div>
                <div className="text-sm text-blue-100">Today</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Employees"
            value={totalEmployees !== null ? String(totalEmployees) : '247'}
            change="+12"
            icon={Users}
            trend="up"
          />
          <StatCard
            title="Present Today"
            value={String(attendanceStats.present)}
            change="+5"
            icon={UserCheck}
            trend="up"
          />
          <StatCard
            title="Absent Today"
            value={String(attendanceStats.absent)}
            change="-2"
            icon={Users}
            trend="down"
          />
          <StatCard
            title="Payroll This Month"
            value={payrollThisMonth !== null ? `$${Number(payrollThisMonth).toLocaleString()}` : '$1.2M'}
            change="+8%"
            icon={DollarSign}
            trend="up"
          />
          <StatCard
            title="Pending Requests"
            value={pendingRequestsCount !== null ? String(pendingRequestsCount) : '15'}
            change="-3"
            icon={Calendar}
            trend="down"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance Chart */}
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-primary" />
                <span>Weekly Attendance</span>
              </CardTitle>
              <CardDescription>Employee attendance trends this week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="present" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Department Distribution */}
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-primary" />
                <span>Department Distribution</span>
              </CardTitle>
              <CardDescription>Employee distribution across departments</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 mt-4">
                {departmentData.map((dept) => (
                  <div key={dept.name} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: dept.color }}
                    />
                    <span className="text-sm text-muted-foreground">
                      {dept.name} ({dept.value}%)
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity and Events */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-primary" />
                <span>Recent Activities</span>
              </CardTitle>
              <CardDescription>Latest employee activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(loadingActivities ? fallbackRecentActivities : (activities.length ? activities : fallbackRecentActivities)).map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={activity.actorAvatar || `https://ui-avatars.com/api/?name=${activity.actorName || activity.user}&background=3b82f6&color=fff`} />
                      <AvatarFallback>{(activity.actorName || activity.user || '').split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.actorName || activity.user}</span> {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground">{new Date(activity.createdAt || activity.time || Date.now()).toLocaleString()}</p>
                    </div>
                    <Badge variant={
                      activity.type === 'leave' ? 'secondary' :
                      activity.type === 'attendance' ? 'default' :
                      'outline'
                    }>
                      {activity.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span>Upcoming Events</span>
              </CardTitle>
              <CardDescription>Important dates and deadlines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loadingEvents && (
                  <p className="text-sm text-muted-foreground">Loading events…</p>
                )}
                {!loadingEvents && upcomingEvents.length === 0 && (
                  <p className="text-sm text-muted-foreground">No upcoming events</p>
                )}
                {!loadingEvents && upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-muted-foreground">{event.date}</p>
                    </div>
                    <Badge variant={
                      event.type === 'meeting' ? 'default' :
                      event.type === 'holiday' ? 'secondary' :
                      event.type === 'training' ? 'outline' :
                      event.type === 'personal' ? 'outline' :
                      'secondary'
                    }>
                      {event.type}
                    </Badge>
                  </div>
                ))}
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => navigate('/calendar')}
              >
                View Calendar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Employee Dashboard
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-hero rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
            <p className="text-blue-100">Have a productive day ahead.</p>
          </div>
          <div className="hidden md:block">
            <Button 
              variant="secondary" 
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              onClick={() => navigate('/attendance')}
            >
              <Clock className="w-4 h-4 mr-2" />
              Mark Attendance
            </Button>
          </div>
        </div>
      </div>

      {/* Personal Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Hours This Week"
          value={hoursThisWeek !== null ? String(hoursThisWeek) : '--'}
          change="+2.5"
          icon={Clock}
          trend="up"
        />
        <StatCard
          title="Attendance Rate"
          value={attendanceRateUser || '--'}
          change="+2%"
          icon={UserCheck}
          trend="up"
        />
        <StatCard
          title="Current Salary"
          value={currentSalary !== null ? `$${Number(currentSalary).toLocaleString()}` : '--'}
          icon={DollarSign}
        />
        <StatCard
          title="Leave Balance"
          value={leaveBalanceDays !== null ? `${leaveBalanceDays} days` : '--'}
          icon={Calendar}
        />
      </div>

      

      {/* Personal Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Salary Progression */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span>Salary Progression</span>
            </CardTitle>
            <CardDescription>Your salary growth over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salaryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-primary" />
              <span>Quick Actions</span>
            </CardTitle>
            <CardDescription>Frequently used actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2"
                onClick={() => navigate('/attendance')}
              >
                <UserCheck className="w-6 h-6" />
                <span>Mark Attendance</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2"
                onClick={() => navigate('/leave-requests')}
              >
                <Calendar className="w-6 h-6" />
                <span>Request Leave</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2"
                onClick={() => navigate('/payslips')}
              >
                <DollarSign className="w-6 h-6" />
                <span>View Payslip</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2"
                onClick={() => navigate('/goals')}
              >
                <Award className="w-6 h-6" />
                <span>My Goals</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Personal Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Recent Activity */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-primary" />
              <span>My Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-accent">
                <UserCheck className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Marked attendance</p>
                  <p className="text-xs text-muted-foreground">Today, 9:15 AM</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors">
                <Calendar className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-sm font-medium">Leave request approved</p>
                  <p className="text-xs text-muted-foreground">Yesterday, 3:30 PM</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors">
                <DollarSign className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Salary credited</p>
                  <p className="text-xs text-muted-foreground">3 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span>My Calendar</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loadingEvents && (
                <p className="text-sm text-muted-foreground">Loading events…</p>
              )}
              {!loadingEvents && upcomingEvents.slice(0, 3).map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-muted-foreground">{event.date}</p>
                  </div>
                  <Badge variant={
                    event.type === 'meeting' ? 'default' :
                    event.type === 'holiday' ? 'secondary' :
                    event.type === 'training' ? 'outline' :
                    event.type === 'personal' ? 'outline' :
                    'secondary'
                  }>
                    {event.type}
                  </Badge>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => navigate('/calendar')}
            >
              View Full Calendar
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;