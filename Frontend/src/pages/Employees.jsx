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
  Search, Plus, Filter, Edit, Trash2, Mail, Phone, MapPin,
  Building2, Calendar, DollarSign, MoreHorizontal, UserPlus
} from 'lucide-react';
import { toast } from 'react-toastify';

const Employees = () => {
  const { isHR } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Mock employee data
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: 'Tamirat Kibrom',
      email: 'tamirat.kibrom@company.com',
      phone: '+1 (555) 123-4567',
      department: 'Engineering',
      position: 'Senior Developer',
      salary: 95000,
      joinDate: '2022-03-15',
      status: 'active',
      avatar: 'https://ui-avatars.com/api/?name=Tamirat+Kibrom&background=3b82f6&color=fff',
      address: '123 Main St, San Francisco, CA',
      employeeId: 'EMP001'
    },
    {
      id: 2,
      name: 'Surafel Takele',
      email: 'surafel.takele@gmail.com@company.com',
      phone: '+1 (555) 234-5678',
      department: 'Marketing',
      position: 'Marketing Manager',
      salary: 75000,
      joinDate: '2021-08-20',
      status: 'active',
      avatar: 'https://ui-avatars.com/api/?name=Surafel+Takele&background=10b981&color=fff',
      address: '456 Oak Ave, San Francisco, CA',
      employeeId: 'EMP002'
    },
    {
      id: 3,
      name: 'Nibru Kefyalew',
      email: 'nibru.kefyalew@company.com',
      phone: '+1 (555) 345-6789',
      department: 'Sales',
      position: 'Sales Representative',
      salary: 65000,
      joinDate: '2023-01-10',
      status: 'active',
      avatar: 'https://ui-avatars.com/api/?name=Nibru+Kefyalew&background=f59e0b&color=fff',
      address: '789 Pine St, San Francisco, CA',
      employeeId: 'EMP003'
    },
    {
      id: 4,
      name: 'Dawit Yitbarek',
      email: 'dawit.yitbarek@company.com',
      phone: '+1 (555) 456-7890',
      department: 'Engineering',
      position: 'Frontend Developer',
      salary: 80000,
      joinDate: '2022-11-05',
      status: 'active',
      avatar: 'https://ui-avatars.com/api/?name=David+Yitbarek&background=8b5cf6&color=fff',
      address: '321 Elm Dr, San Francisco, CA',
      employeeId: 'EMP004'
    },
    {
      id: 5,
      name: 'Liya Abeselom',
      email: 'liya.abeselom@company.com',
      phone: '+1 (555) 567-8901',
      department: 'Human Resources',
      position: 'HR Specialist',
      salary: 70000,
      joinDate: '2021-06-15',
      status: 'on_leave',
      avatar: 'https://ui-avatars.com/api/?name=Liya+Abeselom&background=ef4444&color=fff',
      address: '654 Birch Ln, San Francisco, CA',
      employeeId: 'EMP005'
    }
  ]);

  const departments = ['all', 'Engineering', 'Marketing', 'Sales', 'Human Resources', 'Finance', 'Operations'];

  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    salary: '',
    address: '',
    joinDate: new Date().toISOString().split('T')[0]
  });

  const [editingEmployee, setEditingEmployee] = useState(null);

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || employee.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.email || !newEmployee.department) {
      toast.error('Please fill in all required fields');
      return;
    }

    const employee = {
      ...newEmployee,
      id: employees.length + 1,
      employeeId: `EMP${String(employees.length + 1).padStart(3, '0')}`,
      status: 'active',
      avatar: `https://ui-avatars.com/api/?name=${newEmployee.name.replace(' ', '+')}&background=3b82f6&color=fff`,
      salary: parseInt(newEmployee.salary)
    };

    setEmployees([...employees, employee]);
    setNewEmployee({
      name: '', email: '', password: '', phone: '', department: '', position: '',
      salary: '', address: '', joinDate: new Date().toISOString().split('T')[0]
    });
    setShowAddDialog(false);
    toast.success('Employee added successfully!');
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee({
      ...employee,
      salary: employee.salary.toString()
    });
  };

  const handleUpdateEmployee = () => {
    if (!editingEmployee.name || !editingEmployee.email || !editingEmployee.department) {
      toast.error('Please fill in all required fields');
      return;
    }

    const updatedEmployee = {
      ...editingEmployee,
      salary: parseInt(editingEmployee.salary) || 0
    };

    setEmployees(employees.map(emp => 
      emp.id === editingEmployee.id ? updatedEmployee : emp
    ));
    setEditingEmployee(null);
    toast.success('Employee updated successfully!');
  };

  const handleDeleteEmployee = (id) => {
    setEmployees(employees.filter(emp => emp.id !== id));
    toast.success('Employee removed successfully!');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge variant="default">Active</Badge>;
      case 'on_leave':
        return <Badge variant="secondary">On Leave</Badge>;
      case 'inactive':
        return <Badge variant="outline">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!isHR) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Access Restricted</h2>
          <p className="text-muted-foreground">Only HR managers can access employee management.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Employee Management</h1>
          <p className="text-muted-foreground">Manage your organization's workforce</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="btn-gradient">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>Enter employee details to add them to the system.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  value={newEmployee.password}
                  onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                  placeholder="Enter password"
                />
              </div>              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newEmployee.phone}
                  onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Select 
                    value={newEmployee.department} 
                    onValueChange={(value) => setNewEmployee({ ...newEmployee, department: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.filter(d => d !== 'all').map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salary">Salary</Label>
                  <Input
                    id="salary"
                    type="number"
                    value={newEmployee.salary}
                    onChange={(e) => setNewEmployee({ ...newEmployee, salary: e.target.value })}
                    placeholder="Annual salary"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={newEmployee.position}
                  onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                  placeholder="Job title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="joinDate">Join Date</Label>
                <Input
                  id="joinDate"
                  type="date"
                  value={newEmployee.joinDate}
                  onChange={(e) => setNewEmployee({ ...newEmployee, joinDate: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddEmployee} className="btn-gradient">
                Add Employee
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="dashboard-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Building2 className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Employees</p>
                <p className="text-xl font-bold">{employees.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="dashboard-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                <UserPlus className="w-4 h-4 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-xl font-bold">{employees.filter(e => e.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="dashboard-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">On Leave</p>
                <p className="text-xl font-bold">{employees.filter(e => e.status === 'on_leave').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="dashboard-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Building2 className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Departments</p>
                <p className="text-xl font-bold">{departments.length - 1}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
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
            <div className="flex space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
              >
                Table
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employee List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <Card key={employee.id} className="dashboard-card hover:shadow-card-hover transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={employee.avatar} alt={employee.name} />
                      <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-foreground">{employee.name}</h3>
                      <p className="text-sm text-muted-foreground">{employee.position}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(employee.status)}
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>{employee.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{employee.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Building2 className="w-4 h-4" />
                    <span>{employee.department}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <DollarSign className="w-4 h-4" />
                    <span>${employee.salary.toLocaleString()}/year</span>
                  </div>
                </div>

                 <div className="flex space-x-2 mt-4">
                   <Button 
                     variant="outline" 
                     size="sm" 
                     className="flex-1"
                     onClick={() => handleEditEmployee(employee)}
                   >
                     <Edit className="w-4 h-4 mr-2" />
                     Edit
                   </Button>
                   <Button 
                     variant="outline" 
                     size="sm" 
                     className="text-destructive hover:text-destructive"
                     onClick={() => handleDeleteEmployee(employee.id)}
                   >
                     <Trash2 className="w-4 h-4" />
                   </Button>
                 </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="data-table">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={employee.avatar} alt={employee.name} />
                        <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{employee.name}</p>
                        <p className="text-sm text-muted-foreground">{employee.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>${employee.salary.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(employee.status)}</TableCell>
                   <TableCell>
                     <div className="flex space-x-2">
                       <Button variant="ghost" size="sm" onClick={() => handleEditEmployee(employee)}>
                         <Edit className="w-4 h-4" />
                       </Button>
                       <Button 
                         variant="ghost" 
                         size="sm" 
                         className="text-destructive hover:text-destructive"
                         onClick={() => handleDeleteEmployee(employee.id)}
                       >
                         <Trash2 className="w-4 h-4" />
                       </Button>
                     </div>
                   </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No employees found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Edit Employee Dialog */}
      <Dialog open={!!editingEmployee} onOpenChange={(open) => !open && setEditingEmployee(null)}>
        <DialogContent className="max-w-md" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogDescription>Update employee information.</DialogDescription>
          </DialogHeader>
          {editingEmployee && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name *</Label>
                <Input
                  id="edit-name"
                  value={editingEmployee.name}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email *</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingEmployee.email}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={editingEmployee.phone}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, phone: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-department">Department *</Label>
                  <Select 
                    value={editingEmployee.department} 
                    onValueChange={(value) => setEditingEmployee({ ...editingEmployee, department: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.filter(d => d !== 'all').map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-salary">Salary</Label>
                  <Input
                    id="edit-salary"
                    type="number"
                    value={editingEmployee.salary}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, salary: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-position">Position</Label>
                <Input
                  id="edit-position"
                  value={editingEmployee.position}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, position: e.target.value })}
                />
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setEditingEmployee(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateEmployee} className="btn-gradient">
              Update Employee
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Employees;