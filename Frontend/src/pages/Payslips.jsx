import { useState, useEffect } from 'react';
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
import axios from 'axios';
import { postActivity } from '../lib/postActivity';
const API_URL = import.meta.env.VITE_API_URL;

const Payslips = () => {
  const { user } = useAuth();
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadPayslips = async () => {
      setLoading(true);
      try {
        const apiBase = API_URL;
        const token = localStorage.getItem('authToken');
        const res = await axios.get(`${apiBase}/api/payslips`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.data && res.data.data) {
          const mapped = res.data.data.map(p => ({
            id: p._id,
            month: p.month || (p.payDate ? new Date(p.payDate).toLocaleString('default', { month: 'long', year: 'numeric' }) : ''),
            period: p.period || `${p.periodStart || ''} - ${p.periodEnd || ''}`,
            grossSalary: p.grossSalary || 0,
            netSalary: p.netSalary || 0,
            deductions: p.deductions || 0,
            status: p.status || 'paid',
            payDate: p.payDate || null,
            downloadUrl: p.downloadUrl || null,
            raw: p
          }));
          setPayslips(mapped);
        }
      } catch (err) {
        console.error('Failed to load payslips', err);
        toast.error('Failed to load payslips');
      } finally {
        setLoading(false);
      }
    };
    loadPayslips();
  }, []);

  const currentPayslip = payslips[0] || { month: '', period: '', grossSalary: 0, deductions: 0, netSalary: 0, payDate: null };

  const handleDownload = (payslip) => {
    // If payslip has a downloadUrl (stored in DB), open it. Otherwise attempt to fetch the payslip record.
    if (payslip.downloadUrl) {
      window.open(payslip.downloadUrl, '_blank');
      try {
        postActivity({ token: localStorage.getItem('authToken'), actor: user?.id || user?._id, action: 'Downloaded payslip', type: 'payslip', meta: { id: payslip.id } });
      } catch (e) { /* ignore */ }
      return;
    }
    (async () => {
      try {
        const apiBase = API_URL;
        const token = localStorage.getItem('authToken');
        const res = await axios.get(`${apiBase}/api/payslips/${payslip.id}`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.data && res.data.data) {
          const record = res.data.data;
          if (record.downloadUrl) {
            window.open(record.downloadUrl, '_blank');
            try {
              postActivity({ token: localStorage.getItem('authToken'), actor: user?.id || user?._id, action: 'Downloaded payslip', type: 'payslip', meta: { id: payslip.id } });
            } catch (e) { /* ignore */ }
          } else {
            // No file available
            toast.info('No downloadable file for this payslip');
          }
        }
      } catch (err) {
        console.error('Error fetching payslip for download', err);
        toast.error('Failed to download payslip');
      }
    })();
  };

  const handleView = (payslip) => {
    // Fetch payslip details and open in a new window or show a console preview for now
    (async () => {
      try {
        const apiBase = API_URL;
        const token = localStorage.getItem('authToken');
        const res = await axios.get(`${apiBase}/api/payslips/${payslip.id}`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.data && res.data.data) {
          // For now open a simple JSON view in a new tab
          const w = window.open('', '_blank');
          w.document.write('<pre>' + JSON.stringify(res.data.data, null, 2) + '</pre>');
          try {
            postActivity({ token, actor: user?.id || user?._id, action: 'Viewed payslip', type: 'payslip', meta: { id: payslip.id } });
          } catch (e) { /* ignore */ }
        }
      } catch (err) {
        console.error('Error fetching payslip', err);
        toast.error('Failed to open payslip');
      }
    })();
  };

  const handleDeletePayslip = (id) => {
    (async () => {
      try {
        const apiBase = API_URL;
        const token = localStorage.getItem('authToken');
        const res = await axios.delete(`${apiBase}/api/payslips/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.data && res.data.status) {
          setPayslips(payslips.filter(p => p.id !== id));
          toast.success('Payslip deleted');
          try {
            postActivity({ token, actor: user?.id || user?._id, action: 'Deleted payslip', type: 'payslip', meta: { id } });
          } catch (e) { /* ignore */ }
        } else {
          toast.error('Failed to delete payslip');
        }
      } catch (err) {
        console.error('Error deleting payslip', err);
        toast.error(err.response?.data?.message || 'Error deleting payslip');
      }
    })();
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
                      {user?.role === 'hr' && (
                        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDeletePayslip(payslip.id)}>
                          <FileText className="w-4 h-4" />
                        </Button>
                      )}
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