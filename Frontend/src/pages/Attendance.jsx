import { useState } from 'react';
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

const Attendance = () => {
  const { user, isHR } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('today'); // 'today', 'week', 'month'

  // Mock attendance data
  const [attendanceRecords] = useState([
    {
      id: 1,
      employeeId: 'EMP001',
      employeeName: 'Metasebiyaw Asfaw',
      avatar: 'https://ui-avatars.com/api/?name=Metasebiyaw+Asfaw&background=3b82f6&color=fff',
      department: 'Engineering',
      date: '2024-01-08',
      checkIn: '09:15',
      checkOut: '18:30',
      workingHours: '9h 15m',
      status: 'present',
      location: 'Office'
    },
    {
      id: 2,
      employeeId: 'EMP002',
      employeeName: 'Michael Hayelom',
      avatar: 'https://ui-avatars.com/api/?name=Michael+Hayelom&background=10b981&color=fff',
      department: 'Marketing',
      date: '2024-01-08',
      checkIn: '08:45',
      checkOut: '17:45',
      workingHours: '9h 00m',
      status: 'present',
      location: 'Remote'
    },
    {
      id: 3,
      employeeId: 'EMP003',
      employeeName: 'Leul Gedion',
      avatar: 'https://ui-avatars.com/api/?name=Leul+Gedion&background=f59e0b&color=fff',
      department: 'Sales',
      date: '2024-01-08',
      checkIn: null,
      checkOut: null,
      workingHours: '0h 00m',
      status: 'absent',
      location: null
    },
    {
      id: 4,
      employeeId: 'EMP004',
      employeeName: 'Dawit Asfaw',
      avatar: 'https://ui-avatars.com/api/?name=Dawit+Asfaw&background=8b5cf6&color=fff',
      department: 'Engineering',
      date: '2024-01-08',
      checkIn: '10:30',
      checkOut: null,
      workingHours: '7h 30m',
      status: 'late',
      location: 'Office'
    },
    {
      id: 5,
      employeeId: 'EMP005',
      employeeName: 'Sara Kebede',
      avatar: 'https://ui-avatars.com/api/?name=Sara+Kebede&background=ef4444&color=fff',
      department: 'HR',
      date: '2024-01-08',
      checkIn: null,
      checkOut: null,
      workingHours: '0h 00m',
      status: 'leave',
      location: null
    }
  ]);

  const [userAttendance] = useState([
    { date: '2024-01-01', status: 'present', checkIn: '09:00', checkOut: '18:00', hours: '9h 00m' },
    { date: '2024-01-02', status: 'present', checkIn: '09:15', checkOut: '18:30', hours: '9h 15m' },
    { date: '2024-01-03', status: 'present', checkIn: '08:45', checkOut: '17:45', hours: '9h 00m' },
    { date: '2024-01-04', status: 'late', checkIn: '10:30', checkOut: '18:30', hours: '8h 00m' },
    { date: '2024-01-05', status: 'present', checkIn: '09:00', checkOut: '18:00', hours: '9h 00m' },
    { date: '2024-01-08', status: 'present', checkIn: '09:15', checkOut: null, hours: '8h 45m (ongoing)' }
  ]);

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

  const handleMarkAttendance = () => {
    toast.success('Attendance marked successfully!');
  };

  const todayStats = {
    present: attendanceRecords.filter(r => r.status === 'present').length,
    absent: attendanceRecords.filter(r => r.status === 'absent').length,
    late: attendanceRecords.filter(r => r.status === 'late').length,
    leave: attendanceRecords.filter(r => r.status === 'leave').length,
    total: attendanceRecords.length
  };

  const attendanceRate = ((todayStats.present + todayStats.late) / todayStats.total * 100).toFixed(1);

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
        {!isHR && (
          <Button onClick={handleMarkAttendance} className="btn-gradient">
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
                  {filteredRecords.map((record) => (
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
                    <p className="text-2xl font-bold text-success">09:15</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Working Hours</p>
                    <p className="text-2xl font-bold text-primary">8h 45m</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-success/10 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <span className="font-medium">Present</span>
                  </div>
                  <Badge variant="outline">Office</Badge>
                </div>
                <Button variant="outline" className="w-full">
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
                    <p className="text-2xl font-bold">4/5</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Total Hours</p>
                    <p className="text-2xl font-bold">35h 45m</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Avg. Check-in</p>
                    <p className="text-lg font-semibold">9:11 AM</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Attendance Rate</p>
                    <p className="text-lg font-semibold text-success">96%</p>
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
                          {record.hours}
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