import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '../components/dashboard/StatCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import {
  Users, UserCheck, DollarSign, Calendar, TrendingUp, TrendingDown,
  Clock, Building2, Bell, Target, Award, Activity
} from 'lucide-react';

const Dashboard = () => {
  const { user, isHR } = useAuth();
  const navigate = useNavigate();

  // Mock data for charts
  const attendanceData = [
    { name: 'Mon', present: 85, absent: 15 },
    { name: 'Tue', present: 89, absent: 11 },
    { name: 'Wed', present: 92, absent: 8 },
    { name: 'Thu', present: 88, absent: 12 },
    { name: 'Fri', present: 90, absent: 10 },
  ];

  const salaryData = [
    { month: 'Jan', amount: 45000 },
    { month: 'Feb', amount: 47000 },
    { month: 'Mar', amount: 48000 },
    { month: 'Apr', amount: 49000 },
    { month: 'May', amount: 51000 },
    { month: 'Jun', amount: 52000 },
  ];

  const departmentData = [
    { name: 'Engineering', value: 35, color: '#3b82f6' },
    { name: 'Sales', value: 25, color: '#10b981' },
    { name: 'Marketing', value: 20, color: '#f59e0b' },
    { name: 'HR', value: 10, color: '#ef4444' },
    { name: 'Others', value: 10, color: '#8b5cf6' },
  ];

  const recentActivities = [
    {
      id: 1,
      user: 'Sarah Johnson',
      action: 'submitted leave request',
      time: '2 hours ago',
      type: 'leave'
    },
    {
      id: 2,
      user: 'Mike Chen',
      action: 'marked attendance',
      time: '3 hours ago',
      type: 'attendance'
    },
    {
      id: 3,
      user: 'Emily Davis',
      action: 'updated profile',
      time: '5 hours ago',
      type: 'profile'
    },
    {
      id: 4,
      user: 'David Wilson',
      action: 'applied for Engineering role',
      time: '1 day ago',
      type: 'recruitment'
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Team Meeting',
      date: 'Today, 2:00 PM',
      type: 'meeting'
    },
    {
      id: 2,
      title: 'Project Deadline',
      date: 'Tomorrow, 5:00 PM',
      type: 'deadline'
    },
    {
      id: 3,
      title: 'Company Holiday',
      date: 'Friday, All Day',
      type: 'holiday'
    },
  ];

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
            value="247"
            change="+12"
            icon={Users}
            trend="up"
          />
          <StatCard
            title="Present Today"
            value="228"
            change="+5"
            icon={UserCheck}
            trend="up"
          />
          <StatCard
            title="Payroll This Month"
            value="$1.2M"
            change="+8%"
            icon={DollarSign}
            trend="up"
          />
          <StatCard
            title="Pending Requests"
            value="15"
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
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={`https://ui-avatars.com/api/?name=${activity.user}&background=3b82f6&color=fff`} />
                      <AvatarFallback>{activity.user.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
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
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-muted-foreground">{event.date}</p>
                    </div>
                    <Badge variant={
                      event.type === 'meeting' ? 'default' :
                      event.type === 'deadline' ? 'destructive' :
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
          value="38.5"
          change="+2.5"
          icon={Clock}
          trend="up"
        />
        <StatCard
          title="Attendance Rate"
          value="96%"
          change="+2%"
          icon={UserCheck}
          trend="up"
        />
        <StatCard
          title="Current Salary"
          value="$5,200"
          icon={DollarSign}
        />
        <StatCard
          title="Leave Balance"
          value="12 days"
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
              {upcomingEvents.slice(0, 3).map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-muted-foreground">{event.date}</p>
                  </div>
                  <Badge variant={
                    event.type === 'meeting' ? 'default' :
                    event.type === 'deadline' ? 'destructive' :
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