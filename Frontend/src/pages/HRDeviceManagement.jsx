import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import {
  Laptop, Tablet, Smartphone, Monitor, Plus, Search,
  Edit, Trash2, UserPlus, Calendar, MapPin, AlertCircle
} from 'lucide-react';

const HRDeviceManagement = () => {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false);

  // Dummy employees data
  const employees = [
    { id: 1, name: 'John Smith', email: 'john.smith@company.com', department: 'Engineering' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah.johnson@company.com', department: 'Marketing' },
    { id: 3, name: 'Mike Chen', email: 'mike.chen@company.com', department: 'Sales' },
    { id: 4, name: 'Emily Davis', email: 'emily.davis@company.com', department: 'HR' },
    { id: 5, name: 'David Wilson', email: 'david.wilson@company.com', department: 'Engineering' },
  ];

  // Dummy device assignments data
  const deviceAssignments = [
    {
      id: 1,
      deviceName: 'MacBook Pro 16"',
      deviceType: 'laptop',
      model: 'MacBook Pro M2',
      serialNumber: 'MBP2023001',
      employeeId: 1,
      employeeName: 'John Smith',
      assignedDate: '2023-01-15',
      status: 'active',
      location: 'Office Desk 15A',
      condition: 'excellent'
    },
    {
      id: 2,
      deviceName: 'Dell Monitor',
      deviceType: 'monitor',
      model: 'Dell U2720Q 27"',
      serialNumber: 'DL27001234',
      employeeId: 1,
      employeeName: 'John Smith',
      assignedDate: '2023-01-15',
      status: 'active',
      location: 'Office Desk 15A',
      condition: 'good'
    },
    {
      id: 3,
      deviceName: 'iPad Pro',
      deviceType: 'tablet',
      model: 'iPad Pro 12.9"',
      serialNumber: 'IPD2023002',
      employeeId: 2,
      employeeName: 'Sarah Johnson',
      assignedDate: '2023-02-10',
      status: 'active',
      location: 'Marketing Dept',
      condition: 'excellent'
    },
    {
      id: 4,
      deviceName: 'iPhone 14',
      deviceType: 'phone',
      model: 'iPhone 14 128GB',
      serialNumber: 'IP14001',
      employeeId: 2,
      employeeName: 'Sarah Johnson',
      assignedDate: '2023-02-10',
      status: 'active',
      location: 'Mobile Use',
      condition: 'good'
    },
    {
      id: 5,
      deviceName: 'ThinkPad X1',
      deviceType: 'laptop',
      model: 'ThinkPad X1 Carbon',
      serialNumber: 'TP2023003',
      employeeId: 3,
      employeeName: 'Mike Chen',
      assignedDate: '2023-03-05',
      status: 'maintenance',
      location: 'IT Department',
      condition: 'fair'
    },
  ];

  // Available devices (unassigned)
  const availableDevices = [
    {
      id: 101,
      name: 'MacBook Air M2',
      type: 'laptop',
      model: 'MacBook Air 13"',
      serialNumber: 'MBA2023010',
      status: 'available',
      condition: 'excellent',
      purchaseDate: '2023-06-01'
    },
    {
      id: 102,
      name: 'iPad Air',
      type: 'tablet',
      model: 'iPad Air 5th Gen',
      serialNumber: 'IPA2023015',
      status: 'available',
      condition: 'excellent',
      purchaseDate: '2023-05-15'
    },
    {
      id: 103,
      name: 'Dell Monitor',
      type: 'monitor',
      model: 'Dell S2722DC',
      serialNumber: 'DL27002',
      status: 'available',
      condition: 'good',
      purchaseDate: '2023-04-20'
    },
  ];

  const getDeviceIcon = (type) => {
    switch (type) {
      case 'laptop':
        return Laptop;
      case 'tablet':
        return Tablet;
      case 'phone':
        return Smartphone;
      case 'monitor':
        return Monitor;
      default:
        return Laptop;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'maintenance':
        return 'warning';
      case 'available':
        return 'secondary';
      case 'returned':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'excellent':
        return 'bg-success text-success-foreground';
      case 'good':
        return 'bg-primary text-primary-foreground';
      case 'fair':
        return 'bg-warning text-warning-foreground';
      case 'poor':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const filteredAssignments = deviceAssignments.filter(device =>
    device.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEmployeeDevices = (employeeId) => {
    return deviceAssignments.filter(device => device.employeeId === employeeId);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="bg-gradient-hero rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Device Management</h1>
            <p className="text-blue-100">Manage and track company device assignments</p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">{deviceAssignments.length}</div>
              <div className="text-sm text-blue-100">Assigned</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">{availableDevices.length}</div>
              <div className="text-sm text-blue-100">Available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search devices, employees, or serial numbers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Dialog open={isAddDeviceOpen} onOpenChange={setIsAddDeviceOpen}>
          <DialogTrigger asChild>
            <Button className="btn-gradient">
              <Plus className="w-4 h-4 mr-2" />
              Assign Device
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Assign Device to Employee</DialogTitle>
              <DialogDescription>
                Select an employee and device to create a new assignment.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="employee">Employee</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id.toString()}>
                        {employee.name} - {employee.department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="device">Available Device</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select device" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDevices.map((device) => (
                      <SelectItem key={device.id} value={device.id.toString()}>
                        {device.name} - {device.serialNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input placeholder="Office location or desk number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea placeholder="Any additional notes about this assignment..." />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDeviceOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsAddDeviceOpen(false)}>
                Assign Device
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="all-devices" className="space-y-6">
        <TabsList className="flex flex-wrap w-full gap-2 mb-6">
          <TabsTrigger value="all-devices">All Devices</TabsTrigger>
          <TabsTrigger value="by-employee">By Employee</TabsTrigger>
          <TabsTrigger value="available">Available Devices</TabsTrigger>
        </TabsList>

        {/* All Devices Tab */}
        <TabsContent value="all-devices" className="space-y-6">
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Laptop className="w-5 h-5 text-primary" />
                <span>All Device Assignments</span>
              </CardTitle>
              <CardDescription>
                Overview of all company devices and their current assignments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredAssignments.map((device) => {
                  const DeviceIcon = getDeviceIcon(device.deviceType);
                  return (
                    <div 
                      key={device.id} 
                      className="flex items-center justify-between p-4 rounded-lg border hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-accent rounded-lg">
                          <DeviceIcon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">{device.deviceName}</h4>
                          <p className="text-muted-foreground">{device.model} • {device.serialNumber}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <UserPlus className="w-4 h-4" />
                              <span>{device.employeeName}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>Assigned: {new Date(device.assignedDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{device.location}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge 
                          className={getConditionColor(device.condition)}
                        >
                          {device.condition}
                        </Badge>
                        <Badge variant={getStatusColor(device.status)}>
                          {device.status}
                        </Badge>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* By Employee Tab */}
        <TabsContent value="by-employee" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {employees.map((employee) => {
              const employeeDevices = getEmployeeDevices(employee.id);
              return (
                <Card key={employee.id} className="dashboard-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={`https://ui-avatars.com/api/?name=${employee.name}&background=3b82f6&color=fff`} />
                        <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{employee.name}</h3>
                        <p className="text-sm text-muted-foreground">{employee.department}</p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {employeeDevices.length > 0 ? (
                      <div className="space-y-3">
                        {employeeDevices.map((device) => {
                          const DeviceIcon = getDeviceIcon(device.deviceType);
                          return (
                            <div key={device.id} className="flex items-center space-x-3 p-3 rounded-lg bg-accent/50">
                              <DeviceIcon className="w-5 h-5 text-primary" />
                              <div className="flex-1">
                                <p className="font-medium">{device.deviceName}</p>
                                <p className="text-sm text-muted-foreground">{device.serialNumber}</p>
                              </div>
                              <Badge variant={getStatusColor(device.status)} className="text-xs">
                                {device.status}
                              </Badge>
                            </div>
                          );
                        })}
                        <div className="pt-2">
                          <p className="text-sm text-muted-foreground">
                            Total devices: {employeeDevices.length}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                        <p>No devices assigned</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          Assign Device
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Available Devices Tab */}
        <TabsContent value="available" className="space-y-6">
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Monitor className="w-5 h-5 text-primary" />
                <span>Available Devices</span>
              </CardTitle>
              <CardDescription>
                Devices ready to be assigned to employees
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {availableDevices.map((device) => {
                  const DeviceIcon = getDeviceIcon(device.type);
                  return (
                    <div 
                      key={device.id} 
                      className="flex items-center justify-between p-4 rounded-lg border hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-secondary/50 rounded-lg">
                          <DeviceIcon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">{device.name}</h4>
                          <p className="text-muted-foreground">{device.model} • {device.serialNumber}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>Purchased: {new Date(device.purchaseDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge 
                          className={getConditionColor(device.condition)}
                        >
                          {device.condition}
                        </Badge>
                        <Badge variant="secondary">
                          {device.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <UserPlus className="w-4 h-4 mr-2" />
                          Assign
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HRDeviceManagement;