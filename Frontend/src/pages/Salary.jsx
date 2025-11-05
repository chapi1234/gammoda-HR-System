import { useState, useEffect } from 'react';
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
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
const API_URL = import.meta.env.VITE_API_URL;

const Salary = () => {
  const wrapperStyle = {
    paddingBottom: "20px",
    marginTop: "20px"
  };

  const statCardsContainerStyle = {    
    alignItems: "stretch",
  };

  const marginStyle = {
    marginBottom: "10px"
  };

  const button = {
    width: "200px"
  }
  const { isHR, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);

  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchPayrolls = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const apiBase = API_URL;
        const res = await axios.get(`${apiBase}/api/payroll/`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.data && res.data.data) {
          const mapped = res.data.data.map(p => ({
            id: p._id,
            employeeId: p.employeeId,
            employeeName: p.employeeName || p.employee?.name || 'Unknown',
            department: p.department || p.employee?.department || '',
            position: p.position || p.employee?.position || '',
            baseSalary: p.baseSalary,
            bonus: p.bonus,
            deductions: p.deductions,
            netSalary: p.netSalary,
            payDate: p.payDate ? new Date(p.payDate).toISOString().split('T')[0] : '',
            status: p.status || 'pending'
          }));
          setSalaries(mapped);
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load payrolls');
      }
    };
    fetchPayrolls();
    // also fetch employees for HR select
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const apiBase = API_URL;
        const res = await axios.get(`${apiBase}/api/employees`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.data && res.data.data) setEmployees(res.data.data);
      } catch (err) {
        console.error('Failed to fetch employees', err);
      }
    };
    fetchEmployees();
    // fetch public department list (no auth required)
    const fetchDepartments = async () => {
      try {
        const apiBase = API_URL;
        const res = await axios.get(`${apiBase}/api/departments/public-list`);
        if (res.data && res.data.data) {
          const names = res.data.data.map(d => d.name);
          setDepartments(['all', ...names]);
        }
      } catch (err) {
        console.error('Failed to fetch departments', err);
        // fallback to existing 'all' only
        setDepartments(prev => prev.length ? prev : ['all']);
      }
    };
    fetchDepartments();
  }, [isHR]);

  const [newSalary, setNewSalary] = useState({
    employeeId: '',
    baseSalary: '',
    bonus: '',
    deductions: '',
    payDate: new Date().toISOString().split('T')[0]
  });

  const [editingSalary, setEditingSalary] = useState(null);

  const [departments, setDepartments] = useState(['all']);

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
    const q = (searchTerm || '').toString().toLowerCase();
    const name = (salary?.employeeName || '').toString().toLowerCase();
    const empId = (salary?.employeeId || '').toString().toLowerCase();
    const matchesSearch = q === '' || name.includes(q) || empId.includes(q);
    const matchesDepartment = filterDepartment === 'all' || (salary?.department || '') === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const handleAddSalary = async () => {
    if (!newSalary.employeeId || !newSalary.baseSalary) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      // send employee as MongoDB _id in body
      const payload = {
        employee: newSalary.employeeId,
        baseSalary: Number(newSalary.baseSalary),
        bonus: Number(newSalary.bonus || 0),
        deductions: Number(newSalary.deductions || 0),
        payDate: newSalary.payDate
      };
      const apiBase = API_URL;
      const res = await axios.post(`${apiBase}/api/payroll`, payload, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data && res.data.data) {
        const p = res.data.data;
        const mapped = {
          id: p._id,
          employeeId: p.employeeId,
          employeeName: p.employeeName || p.employee?.name || 'Unknown',
          department: p.department || p.employee?.department || '',
          position: p.position || p.employee?.position || '',
          baseSalary: p.baseSalary,
          bonus: p.bonus,
          deductions: p.deductions,
          netSalary: p.netSalary,
          payDate: p.payDate ? new Date(p.payDate).toISOString().split('T')[0] : '',
          status: p.status || 'pending'
        };
        setSalaries([mapped, ...salaries]);
        setNewSalary({ employeeId: '', baseSalary: '', bonus: '', deductions: '', payDate: new Date().toISOString().split('T')[0] });
        setShowAddDialog(false);
        toast.success('Salary record added successfully!');
      } else {
        toast.error('Failed to create payroll');
      }
    } catch (err) {
      console.error('Error creating payroll', err);
      toast.error(err.response?.data?.message || 'Error creating payroll');
    }
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
    // Call backend to update payroll
    (async () => {
      if (!editingSalary.baseSalary) {
        toast.error('Please fill in all required fields');
        return;
      }
      try {
        const apiBase = API_URL;
        const token = localStorage.getItem('authToken');
        const payload = {
          baseSalary: Number(editingSalary.baseSalary),
          bonus: Number(editingSalary.bonus || 0),
          deductions: Number(editingSalary.deductions || 0),
          payDate: editingSalary.payDate
        };
        const res = await axios.patch(`${apiBase}/api/payroll/${editingSalary.id}`, payload, { headers: { Authorization: `Bearer ${token}` } });
        if (res.data && res.data.data) {
          const p = res.data.data;
          const updated = {
            id: p._id,
            employeeId: p.employeeId,
            employeeName: p.employeeName || p.employee?.name || 'Unknown',
            department: p.department || p.employee?.department || '',
            position: p.position || p.employee?.position || '',
            baseSalary: p.baseSalary,
            bonus: p.bonus,
            deductions: p.deductions,
            netSalary: p.netSalary,
            payDate: p.payDate ? new Date(p.payDate).toISOString().split('T')[0] : '',
            status: p.status || 'pending'
          };
          setSalaries(salaries.map(s => s.id === updated.id ? updated : s));
          setEditingSalary(null);
          toast.success('Salary record updated successfully!');
        } else {
          toast.error('Failed to update payroll');
        }
      } catch (err) {
        console.error('Error updating payroll', err);
        toast.error(err.response?.data?.message || 'Error updating payroll');
      }
    })();
  };

  const handleDeleteSalary = (id) => {
    // Call backend to delete payroll and update UI
    (async () => {
      try {
        const apiBase = API_URL;
        const token = localStorage.getItem('authToken');
        const res = await axios.delete(`${apiBase}/api/payroll/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.data && res.data.status) {
          setSalaries(salaries.filter(salary => salary.id !== id));
          toast.success('Salary record deleted successfully!');
        } else {
          toast.error('Failed to delete payroll');
        }
      } catch (err) {
        console.error('Error deleting payroll', err);
        toast.error(err.response?.data?.message || 'Error deleting payroll');
      }
    })();
  };

  const handleMarkAsPaid = async (id) => {
    try {
      const apiBase = API_URL;
      const token = localStorage.getItem('authToken');
      const res = await axios.patch(`${apiBase}/api/payroll/${id}`, { status: 'paid' }, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data && res.data.data) {
        const p = res.data.data;
        const updated = {
          id: p._id,
          employeeId: p.employeeId,
          employeeName: p.employeeName || p.employee?.name || 'Unknown',
          department: p.department || p.employee?.department || '',
          position: p.position || p.employee?.position || '',
          baseSalary: p.baseSalary,
          bonus: p.bonus,
          deductions: p.deductions,
          netSalary: p.netSalary,
          payDate: p.payDate ? new Date(p.payDate).toISOString().split('T')[0] : '',
          status: p.status || 'pending'
        };
        setSalaries(salaries.map(s => s.id === updated.id ? updated : s));
        toast.success('Payroll marked as paid');
      } else {
        toast.error('Failed to update payroll status');
      }
    } catch (err) {
      console.error('Error marking payroll as paid', err);
      toast.error(err.response?.data?.message || 'Error updating payroll status');
    }
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
              <Button className="btn-gradient" style={{ ...marginStyle, ...button }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Salary Record
              </Button>
            </DialogTrigger>
            <DialogContent style={{ maxHeight: '90vh', overflowY: 'auto' }}>
              <DialogHeader>
                <DialogTitle>Add Salary Record</DialogTitle>
                <DialogDescription>Create a new salary record for an employee</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="employeeId">Employee</Label>
                  <Select value={newSalary.employeeId} onValueChange={(val) => setNewSalary({ ...newSalary, employeeId: val })}>
                    <SelectTrigger id="employeeId" className="w-full">
                      <SelectValue placeholder="Select employee..." />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map(emp => (
                        <SelectItem key={emp.id} value={String(emp.id)}>
                          {emp.name} — {emp.employeeId || ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
      <div style={marginStyle} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card style={marginStyle} className="dashboard-card">
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

        <Card style={marginStyle} className="dashboard-card">
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

        <Card style={marginStyle} className="dashboard-card">
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
                        <AvatarFallback>{
                          (salary?.employeeName || '')
                            .toString()
                            .split(' ')
                            .filter(Boolean)
                            .map(n => n[0])
                            .join('') || '?'
                        }</AvatarFallback>
                      </Avatar>
                    <div>
                      <p className="font-medium">{salary.employeeName}</p>
                      <p className="text-sm text-muted-foreground">{salary.employeeId}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{salary.department}</TableCell>
                <TableCell>${Number(salary?.baseSalary || 0).toLocaleString()}</TableCell>
                <TableCell>${Number(salary?.bonus || 0).toLocaleString()}</TableCell>
                <TableCell>${Number(salary?.deductions || 0).toLocaleString()}</TableCell>
                <TableCell className="font-semibold">${Number(salary?.netSalary || 0).toLocaleString()}</TableCell>
                <TableCell>{getStatusBadge(salary.status)}</TableCell>
                 {isHR && (
                   <TableCell>
                     <div className="flex space-x-2">
                       <Button variant="ghost" size="sm" onClick={() => handleEditSalary(salary)}>
                         <Edit className="w-4 h-4" />
                       </Button>
                         {salary.status !== 'paid' && (
                           <Button
                             variant="ghost"
                             size="sm"
                             onClick={() => handleMarkAsPaid(salary.id)}
                             title="Mark as paid"
                           >
                             <DollarSign className="w-4 h-4" />
                           </Button>
                         )}
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
        <DialogContent style={{ maxHeight: '90vh', overflowY: 'auto' }}>
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