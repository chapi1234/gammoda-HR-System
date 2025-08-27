import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '../components/ui/table';
import {
  Search, Plus, Filter, Edit, Trash2, DollarSign, Calendar,
  TrendingUp, TrendingDown, Building2, Users
} from 'lucide-react';
import { toast } from 'react-toastify';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const Salary = () => {
  const { isHR, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Mock salary data - HR sees all, employees see only their own
  const allSalaries = [
    {
      id: 1,
      employeeId: 'EMP001',
      employeeName: 'Sarah Johnson',
      department: 'Engineering',
      position: 'Senior Developer',
      baseSalary: 85000,
      bonus: 5000,
      deductions: 8500,
      netSalary: 81500,
      payDate: '2024-01-31',
      status: 'paid'
    },
    {
      id: 2,
      employeeId: 'EMP002',
      employeeName: 'Michael Chen',
      department: 'Marketing',
      position: 'Marketing Manager',
      baseSalary: 75000,
      bonus: 3000,
      deductions: 7200,
      netSalary: 70800,
      payDate: '2024-01-31',
      status: 'paid'
    },
    {
      id: 3,
      employeeId: 'EMP003',
      employeeName: 'Emily Rodriguez',
      department: 'Sales',
      position: 'Sales Executive',
      baseSalary: 65000,
      bonus: 8000,
      deductions: 6500,
      netSalary: 66500,
      payDate: '2024-01-31',
      status: 'pending'
    },
    {
      id: 4,
      employeeId: user?.employeeId || 'EMP004',
      employeeName: user?.name || 'Current User',
      department: user?.department || 'Engineering',
      position: user?.position || 'Developer',
      baseSalary: 70000,
      bonus: 4000,
      deductions: 7000,
      netSalary: 67000,
      payDate: '2024-01-31',
      status: 'paid'
    }
  ];

  // Filter salaries based on user role
  const [salaries, setSalaries] = useState(
    isHR ? allSalaries : allSalaries.filter(salary => salary.employeeId === (user?.employeeId || 'EMP004'))
  );

  const [newSalary, setNewSalary] = useState({
    employeeId: '',
    baseSalary: '',
    bonus: '',
    deductions: '',
    payDate: new Date().toISOString().split('T')[0]
  });

  const [editingSalary, setEditingSalary] = useState(null);

  const departments = ['all', 'Engineering', 'Marketing', 'Sales', 'Human Resources', 'Finance', 'Operations'];

  const salaryTrends = [
    { month: 'Jan', total: 180000, avg: 60000 },
    { month: 'Feb', total: 185000, avg: 61667 },
    { month: 'Mar', total: 192000, avg: 64000 },
    { month: 'Apr', total: 198000, avg: 66000 },
    { month: 'May', total: 205000, avg: 68333 },
    { month: 'Jun', total: 210000, avg: 70000 }
  ];

  const filteredSalaries = salaries.filter(salary => {
    if (!isHR) return true; // Employees see all their own records
    const matchesSearch = salary.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         salary.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || salary.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const handleAddSalary = () => {
    if (!newSalary.employeeId || !newSalary.baseSalary) {
      toast.error('Please fill in all required fields');
      return;
    }

    const netSalary = parseInt(newSalary.baseSalary) + parseInt(newSalary.bonus || 0) - parseInt(newSalary.deductions || 0);
    
    const salary = {
      ...newSalary,
      id: salaries.length + 1,
      employeeName: `Employee ${salaries.length + 1}`,
      department: 'Engineering',
      position: 'Developer',
      baseSalary: parseInt(newSalary.baseSalary),
      bonus: parseInt(newSalary.bonus || 0),
      deductions: parseInt(newSalary.deductions || 0),
      netSalary,
      status: 'pending'
    };

    setSalaries([...salaries, salary]);
    setNewSalary({
      employeeId: '', baseSalary: '', bonus: '', deductions: '',
      payDate: new Date().toISOString().split('T')[0]
    });
    setShowAddDialog(false);
    toast.success('Salary record added successfully!');
  };

  const handleEditSalary = (salary) => {
    setEditingSalary({
      ...salary,
      baseSalary: salary.baseSalary.toString(),
      bonus: salary.bonus.toString(),
      deductions: salary.deductions.toString()
    });
  };

  const handleUpdateSalary = () => {
    if (!editingSalary.baseSalary) {
      toast.error('Please fill in all required fields');
      return;
    }

    const netSalary = parseInt(editingSalary.baseSalary) + parseInt(editingSalary.bonus || 0) - parseInt(editingSalary.deductions || 0);
    
    const updatedSalary = {
      ...editingSalary,
      baseSalary: parseInt(editingSalary.baseSalary),
      bonus: parseInt(editingSalary.bonus || 0),
      deductions: parseInt(editingSalary.deductions || 0),
      netSalary
    };

    setSalaries(salaries.map(salary => 
      salary.id === editingSalary.id ? updatedSalary : salary
    ));
    setEditingSalary(null);
    toast.success('Salary record updated successfully!');
  };

  const handleDeleteSalary = (id) => {
    setSalaries(salaries.filter(salary => salary.id !== id));
    toast.success('Salary record deleted successfully!');
  };

  const getStatusBadge = (status) => {
    const variants = {
      paid: { variant: 'default', label: 'Paid' },
      pending: { variant: 'secondary', label: 'Pending' },
      overdue: { variant: 'destructive', label: 'Overdue' }
    };
    const config = variants[status] || variants.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const totalPayroll = salaries.reduce((sum, salary) => sum + salary.netSalary, 0);
  const avgSalary = totalPayroll / salaries.length || 0;
  const pendingPayments = salaries.filter(s => s.status === 'pending').length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Salary Management</h1>
          <p className="text-muted-foreground">
            {isHR ? 'Manage employee salaries and payroll' : 'View your salary history'}
          </p>
        </div>
        {isHR && (
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="btn-gradient">
                <Plus className="w-4 h-4 mr-2" />
                Add Salary Record
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Salary Record</DialogTitle>
                <DialogDescription>Create a new salary record for an employee</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="employeeId">Employee ID</Label>
                  <Input
                    id="employeeId"
                    placeholder="EMP001"
                    value={newSalary.employeeId}
                    onChange={(e) => setNewSalary({ ...newSalary, employeeId: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="baseSalary">Base Salary</Label>
                  <Input
                    id="baseSalary"
                    type="number"
                    placeholder="50000"
                    value={newSalary.baseSalary}
                    onChange={(e) => setNewSalary({ ...newSalary, baseSalary: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="bonus">Bonus</Label>
                  <Input
                    id="bonus"
                    type="number"
                    placeholder="0"
                    value={newSalary.bonus}
                    onChange={(e) => setNewSalary({ ...newSalary, bonus: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="deductions">Deductions</Label>
                  <Input
                    id="deductions"
                    type="number"
                    placeholder="0"
                    value={newSalary.deductions}
                    onChange={(e) => setNewSalary({ ...newSalary, deductions: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="payDate">Pay Date</Label>
                  <Input
                    id="payDate"
                    type="date"
                    value={newSalary.payDate}
                    onChange={(e) => setNewSalary({ ...newSalary, payDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddSalary} className="btn-gradient">
                  Add Record
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPayroll.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Salary</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${Math.round(avgSalary).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +5% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPayments}</div>
            <p className="text-xs text-muted-foreground">
              Require processing
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Salary Trends Chart */}
      {isHR && (
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Salary Trends</CardTitle>
            <CardDescription>Monthly payroll overview</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salaryTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="hsl(var(--primary))" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Filters - Only show for HR */}
      {isHR && (
        <Card className="dashboard-card">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by employee name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>
                      {dept === 'all' ? 'All Departments' : dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Salary Table */}
      <Card className="data-table">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Base Salary</TableHead>
              <TableHead>Bonus</TableHead>
              <TableHead>Deductions</TableHead>
              <TableHead>Net Salary</TableHead>
              <TableHead>Status</TableHead>
              {isHR && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSalaries.map((salary) => (
              <TableRow key={salary.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>{salary.employeeName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{salary.employeeName}</p>
                      <p className="text-sm text-muted-foreground">{salary.employeeId}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{salary.department}</TableCell>
                <TableCell>${salary.baseSalary.toLocaleString()}</TableCell>
                <TableCell>${salary.bonus.toLocaleString()}</TableCell>
                <TableCell>${salary.deductions.toLocaleString()}</TableCell>
                <TableCell className="font-semibold">${salary.netSalary.toLocaleString()}</TableCell>
                <TableCell>{getStatusBadge(salary.status)}</TableCell>
                 {isHR && (
                   <TableCell>
                     <div className="flex space-x-2">
                       <Button variant="ghost" size="sm" onClick={() => handleEditSalary(salary)}>
                         <Edit className="w-4 h-4" />
                       </Button>
                       <Button 
                         variant="ghost" 
                         size="sm" 
                         className="text-destructive hover:text-destructive"
                         onClick={() => handleDeleteSalary(salary.id)}
                       >
                         <Trash2 className="w-4 h-4" />
                       </Button>
                     </div>
                   </TableCell>
                 )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {filteredSalaries.length === 0 && (
        <div className="text-center py-12">
          <DollarSign className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No salary records found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Edit Salary Dialog */}
      <Dialog open={!!editingSalary} onOpenChange={(open) => !open && setEditingSalary(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Salary Record</DialogTitle>
            <DialogDescription>Update salary information for this employee</DialogDescription>
          </DialogHeader>
          {editingSalary && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-baseSalary">Base Salary</Label>
                <Input
                  id="edit-baseSalary"
                  type="number"
                  value={editingSalary.baseSalary}
                  onChange={(e) => setEditingSalary({ ...editingSalary, baseSalary: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-bonus">Bonus</Label>
                <Input
                  id="edit-bonus"
                  type="number"
                  value={editingSalary.bonus}
                  onChange={(e) => setEditingSalary({ ...editingSalary, bonus: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-deductions">Deductions</Label>
                <Input
                  id="edit-deductions"
                  type="number"
                  value={editingSalary.deductions}
                  onChange={(e) => setEditingSalary({ ...editingSalary, deductions: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-payDate">Pay Date</Label>
                <Input
                  id="edit-payDate"
                  type="date"
                  value={editingSalary.payDate}
                  onChange={(e) => setEditingSalary({ ...editingSalary, payDate: e.target.value })}
                />
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setEditingSalary(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateSalary} className="btn-gradient">
              Update Record
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Salary;