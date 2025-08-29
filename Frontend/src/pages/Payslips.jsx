import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { 
  DollarSign, Download, Eye, FileText, Calendar, 
  TrendingUp, Building2, Clock, CreditCard 
} from 'lucide-react';
import { toast } from 'react-toastify';

const Payslips = () => {
  const { user } = useAuth();
  const [payslips] = useState([
    {
      id: 1,
      month: 'August 2024',
      period: 'Aug 1 - Aug 31, 2024',
      grossSalary: 5200,
      netSalary: 4368,
      deductions: 832,
      status: 'paid',
      payDate: '2024-08-31',
      downloadUrl: '#'
    },
    {
      id: 2,
      month: 'July 2024',
      period: 'Jul 1 - Jul 31, 2024',
      grossSalary: 5200,
      netSalary: 4368,
      deductions: 832,
      status: 'paid',
      payDate: '2024-07-31',
      downloadUrl: '#'
    },
    {
      id: 3,
      month: 'June 2024',
      period: 'Jun 1 - Jun 30, 2024',
      grossSalary: 5000,
      netSalary: 4200,
      deductions: 800,
      status: 'paid',
      payDate: '2024-06-30',
      downloadUrl: '#'
    },
    {
      id: 4,
      month: 'May 2024',
      period: 'May 1 - May 31, 2024',
      grossSalary: 5000,
      netSalary: 4200,
      deductions: 800,
      status: 'paid',
      payDate: '2024-05-31',
      downloadUrl: '#'
    },
    {
      id: 5,
      month: 'April 2024',
      period: 'Apr 1 - Apr 30, 2024',
      grossSalary: 4800,
      netSalary: 4032,
      deductions: 768,
      status: 'paid',
      payDate: '2024-04-30',
      downloadUrl: '#'
    }
  ]);

  const currentPayslip = payslips[0];

  const handleDownload = (payslip) => {
    toast.success(`Downloading payslip for ${payslip.month}`);
    // Simulate download
  };

  const handleView = (payslip) => {
    toast.info(`Opening payslip for ${payslip.month}`);
    // Simulate view
  };

  const salaryBreakdown = [
    { label: 'Basic Salary', amount: 3000, type: 'earning' },
    { label: 'HRA', amount: 1200, type: 'earning' },
    { label: 'Performance Bonus', amount: 800, type: 'earning' },
    { label: 'Travel Allowance', amount: 200, type: 'earning' },
    { label: 'Income Tax', amount: 520, type: 'deduction' },
    { label: 'EPF', amount: 180, type: 'deduction' },
    { label: 'ESI', amount: 52, type: 'deduction' },
    { label: 'Professional Tax', amount: 80, type: 'deduction' }
  ];

  const earnings = salaryBreakdown.filter(item => item.type === 'earning');
  const deductions = salaryBreakdown.filter(item => item.type === 'deduction');

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Payslips</h1>
            <p className="text-muted-foreground">View and download your salary statements</p>
          </div>
          <Button className="btn-gradient">
            <Download className="w-4 h-4 mr-2" />
            Download Latest
          </Button>
        </div>

        {/* Current Month Summary */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-primary" />
              <span>Current Month - {currentPayslip.month}</span>
            </CardTitle>
            <CardDescription>
              Pay Period: {currentPayslip.period}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Gross Salary</p>
                <p className="text-2xl font-bold text-green-600">
                  ${currentPayslip.grossSalary.toLocaleString()}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Deductions</p>
                <p className="text-2xl font-bold text-red-600">
                  ${currentPayslip.deductions.toLocaleString()}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Net Salary</p>
                <p className="text-2xl font-bold text-primary">
                  ${currentPayslip.netSalary.toLocaleString()}
                </p>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Earnings */}
              <div>
                <h3 className="font-semibold text-lg mb-4 text-green-600">Earnings</h3>
                <div className="space-y-3">
                  {earnings.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-green-50 dark:bg-green-950">
                      <span className="text-sm">{item.label}</span>
                      <span className="font-medium">${item.amount.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center p-3 rounded-lg bg-green-100 dark:bg-green-900 font-semibold">
                    <span>Total Earnings</span>
                    <span>${earnings.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div>
                <h3 className="font-semibold text-lg mb-4 text-red-600">Deductions</h3>
                <div className="space-y-3">
                  {deductions.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-red-50 dark:bg-red-950">
                      <span className="text-sm">{item.label}</span>
                      <span className="font-medium">-${item.amount.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center p-3 rounded-lg bg-red-100 dark:bg-red-900 font-semibold">
                    <span>Total Deductions</span>
                    <span>-${deductions.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payslip History */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-primary" />
              <span>Payslip History</span>
            </CardTitle>
            <CardDescription>View and download previous payslips</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payslips.map((payslip) => (
                <div key={payslip.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{payslip.month}</h4>
                      <p className="text-sm text-muted-foreground">{payslip.period}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-medium">${payslip.netSalary.toLocaleString()}</p>
                      <div className="flex items-center space-x-2">
                        <Badge variant="default" className="text-xs">
                          {payslip.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(payslip.payDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleView(payslip)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDownload(payslip)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tax Information */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-primary" />
              <span>Tax Information</span>
            </CardTitle>
            <CardDescription>Year-to-date tax summary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">YTD Gross Income</p>
                <p className="text-xl font-bold">${(currentPayslip.grossSalary * 8).toLocaleString()}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">YTD Tax Paid</p>
                <p className="text-xl font-bold text-red-600">${(520 * 8).toLocaleString()}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Tax Savings</p>
                <p className="text-xl font-bold text-green-600">${(180 * 8).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Payslips;