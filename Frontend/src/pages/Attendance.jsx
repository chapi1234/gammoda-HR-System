import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '../components/ui/table';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import {
  Clock, Calendar as CalendarIcon, UserCheck, UserX, Search, 
  Filter, Download, TrendingUp, CheckCircle, XCircle, AlertCircle
} from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Attendance = () => {
  const { user, isHR } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('today'); // 'today', 'week', 'month'
  const API_BASE = API_URL;
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;


  const [attendanceRecords, setAttendanceRecords] = useState([]); // HR date-based list
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [userAttendance, setUserAttendance] = useState([]); // Employee history
  const [loading, setLoading] = useState(false);

  const isoDate = (d) => {
    // local YYYY-MM-DD (avoid timezone-induced off-by-one)
    try {
      const dd = new Date(d);
      const y = dd.getFullYear();
      const m = String(dd.getMonth() + 1).padStart(2, '0');
      const day = String(dd.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    } catch (e) {
      return String(d).slice(0,10);
    }
  };
  
  // Normalize a record.date into YYYY-MM-DD without timezone ambiguity.
  const normalizeRecordDate = (recDate) => {
    if (!recDate && recDate !== 0) return null;
    // If it's already a YYYY-MM-DD string, return as-is
    if (typeof recDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(recDate)) return recDate;
    // Otherwise, fall back to isoDate which formats local date
    return isoDate(recDate);
  };

  // Loading flags for requests to avoid double clicks
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [checkOutLoading, setCheckOutLoading] = useState(false);

  const fetchByDate = async (dateObj) => {
    if (!token || !isHR) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/attendance`, {
        params: { date: isoDate(dateObj) },
        headers: { Authorization: `Bearer ${token}` },
      });
  setAttendanceRecords(Array.isArray(res.data?.data) ? res.data.data : []);
  setAttendanceStats(res.data?.stats || null);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyHistory = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${API_BASE}/api/attendance/me`, {
        params: { limit: 30 },
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserAttendance(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      console.error(err);
      // non-blocking
    }
  };

  const refreshStats = async (dateObj) => {
    // Only HR needs org-wide stats
    if (!token || !isHR) return;
    try {
      const res = await axios.get(`${API_BASE}/api/attendance/stats`, {
        params: { date: isoDate(dateObj || selectedDate) },
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.stats) setAttendanceStats(res.data.stats);
    } catch (err) {
      // non-blocking
    }
  };

  useEffect(() => {
    if (isHR) fetchByDate(selectedDate);
    fetchMyHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHR, token]);

  useEffect(() => {
    if (isHR) fetchByDate(selectedDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const filteredRecords = attendanceRecords.filter(record => {
    const matchesSearch = record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || record.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'present':
        return (
          <Badge variant="default" className="bg-success text-success-foreground">
            <CheckCircle className="w-3 h-3 mr-1" />
            Present
          </Badge>
        );
      case 'absent':
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Absent
          </Badge>
        );
      case 'late':
        return (
          <Badge variant="secondary" className="bg-warning text-warning-foreground">
            <AlertCircle className="w-3 h-3 mr-1" />
            Late
          </Badge>
        );
      case 'leave':
        return (
          <Badge variant="outline">
            <Calendar className="w-3 h-3 mr-1" />
            On Leave
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleMarkAttendance = async () => {
    if (checkInLoading) return;
    setCheckInLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/attendance/check-in`, { location: 'Office' }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Attendance marked successfully!');
      const newRec = res.data?.data;
      const today = isoDate(new Date());
      if (newRec) {
        setUserAttendance(prev => {
          try {
            const idx = prev.findIndex(r => normalizeRecordDate(r?.date) === today);
            if (idx !== -1) {
              const copy = [...prev];
              copy[idx] = { ...copy[idx], ...newRec };
              return copy;
            }
            return [newRec, ...prev];
          } catch (e) { return prev; }
        });
        setCheckedOutToday(!!(newRec.checkOut));
      } else {
        await fetchMyHistory();
      }
      // server-side activity will create the activity; no client post to avoid duplicates
      if (isHR) {
        fetchByDate(selectedDate);
        await refreshStats(selectedDate);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setCheckInLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (checkOutLoading) return;
    setCheckOutLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/attendance/check-out`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Checked out successfully!');
      const updated = res.data?.data;
      const today = isoDate(new Date());
      if (updated) {
        setUserAttendance(prev => {
          try {
            const idx = prev.findIndex(r => normalizeRecordDate(r?.date) === today);
            if (idx !== -1) {
              const copy = [...prev];
              copy[idx] = { ...copy[idx], ...updated };
              return copy;
            }
            return [updated, ...prev];
          } catch (e) { return prev; }
        });
        setCheckedOutToday(true);
      } else {
        await fetchMyHistory();
      }
      // server-side activity will create the activity; no client post to avoid duplicates
      if (isHR) {
        fetchByDate(selectedDate);
        await refreshStats(selectedDate);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to check out');
    } finally {
      setCheckOutLoading(false);
    }
  };

  // Personal today's status for non-HR user
  const myTodayStatus = useMemo(() => {
    const todayStrLocal = isoDate(selectedDate);
    const rec = userAttendance.find(r => normalizeRecordDate(r?.date) === todayStrLocal);
    return rec?.status || 'absent';
  }, [userAttendance, selectedDate]);

  const todayStats = useMemo(() => {
    if (isHR) {
      return (
        attendanceStats || {
          present: attendanceRecords.filter(r => r.status === 'present').length,
          absent: attendanceRecords.filter(r => r.status === 'absent').length,
          late: attendanceRecords.filter(r => r.status === 'late').length,
          leave: attendanceRecords.filter(r => r.status === 'leave').length,
          total: attendanceRecords.length
        }
      );
    }
    return {
      present: myTodayStatus === 'present' ? 1 : 0,
      late: myTodayStatus === 'late' ? 1 : 0,
      leave: myTodayStatus === 'leave' ? 1 : 0,
      absent: myTodayStatus === 'absent' ? 1 : 0,
      total: 1
    };
  }, [isHR, attendanceStats, attendanceRecords, myTodayStatus]);

  const attendanceRate = ((todayStats.present + todayStats.late) / todayStats.total * 100).toFixed(1);

  // --- Weekly summary for Employee view ---
  const getWeekBounds = (d) => {
    const date = new Date(d);
    const day = date.getDay(); // 0=Sun,1=Mon,...
    const diffToMonday = (day + 6) % 7; // days since Monday
    const start = new Date(date);
    start.setDate(date.getDate() - diffToMonday);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  };

  const parseWorkingMinutes = (s) => {
    if (!s || typeof s !== 'string') return 0;
    const m = s.match(/(\d+)h\s+(\d{1,2})m/);
    if (!m) return 0;
    const h = parseInt(m[1], 10);
    const mm = parseInt(m[2], 10);
    return (isNaN(h) || isNaN(mm)) ? 0 : (h * 60 + mm);
  };

  const minutesToHoursStr = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${String(m).padStart(2, '0')}m`;
  };

  const minutesTo12h = (mins) => {
    if (mins === null || mins === undefined) return '--';
    let h = Math.floor(mins / 60);
    const m = mins % 60;
    const ampm = h >= 12 ? 'PM' : 'AM';
    let hour12 = h % 12;
    if (hour12 === 0) hour12 = 12;
    return `${hour12}:${String(m).padStart(2, '0')} ${ampm}`;
  };

  const weekly = useMemo(() => {
    // Current week (Mon-Sun), capped at today
    const today = new Date();
    const { start, end } = getWeekBounds(today);
    const capEnd = new Date(Math.min(end.getTime(), today.getTime()));
    capEnd.setHours(23, 59, 59, 999);

    // Eligible working days: Mon-Fri up to capEnd
    let totalDays = 0;
    {
      const iter = new Date(start);
      while (iter <= capEnd) {
        const wd = iter.getDay();
        if (wd >= 1 && wd <= 5) totalDays += 1; // Mon-Fri
        iter.setDate(iter.getDate() + 1);
      }
    }

    // Filter my records within week bounds
    const weekRecords = userAttendance.filter(r => {
      const d = new Date(r.date);
      return d >= start && d <= capEnd;
    });

    const daysPresent = weekRecords.filter(r => r.status === 'present' || r.status === 'late').length;
    const totalMinutes = weekRecords.reduce((acc, r) => acc + parseWorkingMinutes(r.workingHours || r.hours), 0);

    // Average check-in (over records that have checkIn)
    const checkIns = weekRecords
      .map(r => r.checkIn)
      .filter(Boolean)
      .map(t => {
        const [hh, mm] = String(t).split(':').map(Number);
        if (isNaN(hh) || isNaN(mm)) return null;
        return hh * 60 + mm;
      })
      .filter(v => v !== null);
    const avgCheckInMins = checkIns.length ? Math.round(checkIns.reduce((a, b) => a + b, 0) / checkIns.length) : null;

    const attendanceRate = totalDays > 0 ? Math.round((daysPresent / totalDays) * 100) : 0;

    return {
      daysPresent,
      totalDays,
      totalHours: minutesToHoursStr(totalMinutes),
      avgCheckIn: minutesTo12h(avgCheckInMins),
      attendanceRate,
    };
  }, [userAttendance]);

  // Helpers for button states (today)
  const todayStr = isoDate(new Date());
  const todayRec = useMemo(() => userAttendance.find(r => normalizeRecordDate(r?.date) === todayStr), [userAttendance, todayStr]);

  // Track if checked out today for button color
  const [checkedOutToday, setCheckedOutToday] = useState(false);
  useEffect(() => {
    setCheckedOutToday(!!(todayRec && todayRec.checkOut));
  }, [todayRec]);

  const canCheckIn = !todayRec || !todayRec.checkIn;
  const canCheckOut = !!(todayRec && todayRec.checkIn && !todayRec.checkOut);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isHR ? 'Attendance Management' : 'My Attendance'}
          </h1>
          <p className="text-muted-foreground">
            {isHR ? 'Monitor and manage employee attendance' : 'Track your attendance and working hours'}
          </p>
        </div>
        {isHR ? (
          <div className="flex gap-2">
            <Button onClick={handleMarkAttendance} className="btn-gradient" disabled={!canCheckIn} title={canCheckIn ? 'Mark my check-in' : 'Already checked in today'}>
              <Clock className="w-4 h-4 mr-2" />
              My Check-in
            </Button>
            <Button
              onClick={handleCheckOut}
              className={checkedOutToday ? 'btn-gradient' : 'btn-outline'}
              disabled={!canCheckOut}
              title={canCheckOut ? 'Mark my check-out' : 'Check-in first or already checked out'}
            >
              <Clock className="w-4 h-4 mr-2" />
              My Check-out
            </Button>
          </div>
        ) : (
          <Button onClick={handleMarkAttendance} className="btn-gradient" disabled={!canCheckIn} title={canCheckIn ? 'Mark your check-in' : 'You already checked in today'}>
            <Clock className="w-4 h-4 mr-2" />
            Mark Attendance
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="dashboard-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Present</p>
                <p className="text-xl font-bold">{todayStats.present}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="dashboard-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-destructive/10 rounded-lg flex items-center justify-center">
                <XCircle className="w-4 h-4 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Absent</p>
                <p className="text-xl font-bold">{todayStats.absent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="dashboard-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Late</p>
                <p className="text-xl font-bold">{todayStats.late}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="dashboard-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <CalendarIcon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">On Leave</p>
                <p className="text-xl font-bold">{todayStats.leave}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="dashboard-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rate</p>
                <p className="text-xl font-bold">{attendanceRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {isHR ? (
        <>
          {/* Filters */}
          <Card className="dashboard-card">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="present">Present</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                    <SelectItem value="late">Late</SelectItem>
                    <SelectItem value="leave">On Leave</SelectItem>
                  </SelectContent>
                </Select>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full md:w-auto">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {format(selectedDate, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Table */}
          <Card className="data-table">
            <CardHeader>
              <CardTitle>Today's Attendance</CardTitle>
              <CardDescription>Employee attendance for {format(selectedDate, "PPP")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Working Hours</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading && (
                    <TableRow>
                      <TableCell colSpan={7}>
                        <p className="text-sm text-muted-foreground">Loading attendance…</p>
                      </TableCell>
                    </TableRow>
                  )}
                  {!loading && filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={record.avatar} alt={record.employeeName} />
                            <AvatarFallback>{record.employeeName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{record.employeeName}</p>
                            <p className="text-sm text-muted-foreground">{record.employeeId}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{record.department}</TableCell>
                      <TableCell>
                        {record.checkIn ? (
                          <span className="text-success">{record.checkIn}</span>
                        ) : (
                          <span className="text-muted-foreground">--</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {record.checkOut ? (
                          <span className="text-success">{record.checkOut}</span>
                        ) : record.checkIn ? (
                          <span className="text-warning">Working...</span>
                        ) : (
                          <span className="text-muted-foreground">--</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className={cn(
                          "font-medium",
                          record.status === 'present' ? "text-success" :
                          record.status === 'late' ? "text-warning" :
                          "text-muted-foreground"
                        )}>
                          {record.workingHours}
                        </span>
                      </TableCell>
                      <TableCell>
                        {record.location ? (
                          <Badge variant="outline">{record.location}</Badge>
                        ) : (
                          <span className="text-muted-foreground">--</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      ) : (
        // Employee View
        <>
          {/* Personal Attendance Card */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>Today's Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Check In</p>
                    <p className="text-2xl font-bold text-success">{
                      (todayRec?.checkIn) || '--'
                    }</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Working Hours</p>
                    <p className="text-2xl font-bold text-primary">{
                      (todayRec?.workingHours) || '0h 00m'
                    }</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-success/10 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <span className="font-medium">{
                      (todayRec?.status || 'Present')
                    }</span>
                  </div>
                  <Badge variant="outline">Office</Badge>
                </div>
                <Button
                  className={checkedOutToday ? 'btn-gradient w-full' : 'btn-outline w-full'}
                  onClick={handleCheckOut}
                  disabled={!canCheckOut}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Check Out
                </Button>
              </CardContent>
            </Card>

            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span>This Week Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Days Present</p>
                    <p className="text-2xl font-bold">{weekly.daysPresent}/{weekly.totalDays}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Total Hours</p>
                    <p className="text-2xl font-bold">{weekly.totalHours}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Avg. Check-in</p>
                    <p className="text-lg font-semibold">{weekly.avgCheckIn}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Attendance Rate</p>
                    <p className="text-lg font-semibold text-success">{weekly.attendanceRate}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Personal Attendance History */}
          <Card className="data-table">
            <CardHeader>
              <CardTitle>My Attendance History</CardTitle>
              <CardDescription>Your recent attendance records</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Working Hours</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userAttendance.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {format(new Date(record.date), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        {record.checkIn ? (
                          <span className="text-success">{record.checkIn}</span>
                        ) : (
                          <span className="text-muted-foreground">--</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {record.checkOut ? (
                          <span className="text-success">{record.checkOut}</span>
                        ) : record.checkIn ? (
                          <span className="text-warning">Working...</span>
                        ) : (
                          <span className="text-muted-foreground">--</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className={cn(
                          "font-medium",
                          record.status === 'present' ? "text-success" :
                          record.status === 'late' ? "text-warning" :
                          "text-muted-foreground"
                        )}>
                          {record.workingHours || record.hours}
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}

      {filteredRecords.length === 0 && isHR && (
        <div className="text-center py-12">
          <UserCheck className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No attendance records found</h3>
          <p className="text-muted-foreground">Try adjusting your search or date filters</p>
        </div>
      )}
    </div>
  );
};

export default Attendance;