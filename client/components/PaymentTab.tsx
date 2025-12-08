import React from 'react';
import { CreditCard, Download, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { useData } from '../services/DataContext';

export const PaymentTab: React.FC = () => {
  const { payments, payBill, currentUser } = useData();
  const myPayments = payments.filter(p => p.studentName === currentUser?.name);

  const stats = {
    totalDue: myPayments.filter(p => p.status !== 'Paid').reduce((acc, curr) => acc + curr.amount, 0),
    paidThisMonth: myPayments.filter(p => p.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0),
    nextDueDate: 'Nov 30, 2025'
  };

  const handlePayNow = (id: string) => {
    // In a real app this would go to a gateway, here we just update status
    payBill(id);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid':
        return <span className="bg-green-100 text-green-600 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1"><CheckCircle2 size={12} /> paid</span>;
      case 'Pending':
        return <span className="bg-yellow-100 text-yellow-700 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1"><Clock size={12} /> pending</span>;
      case 'Overdue':
        return <span className="bg-red-100 text-red-600 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1"><AlertCircle size={12} /> overdue</span>;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Payments</h2>
        <p className="text-slate-500 text-sm mt-1">Manage your hostel fees and payment history</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Total Due</p>
          <p className="text-2xl font-semibold text-red-600 mt-1">₹{stats.totalDue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Paid This Month</p>
          <p className="text-2xl font-semibold text-green-600 mt-1">₹{stats.paidThisMonth.toLocaleString()}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Next Payment Due</p>
          <p className="text-xl font-semibold text-slate-800 mt-1">{stats.nextDueDate}</p>
        </div>
      </div>

      <div className="space-y-4">
        {myPayments.map((payment) => (
          <div key={payment.id} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${payment.status === 'Paid' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>
                  <CreditCard size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">{payment.title}</h3>
                  <p className="text-sm text-slate-500">Due: {payment.dueDate}</p>
                  {payment.status === 'Paid' && (
                    <p className="text-xs text-slate-400 mt-1">
                      Paid on {payment.paidOn} • Transaction ID: {payment.transactionId}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-row md:flex-col items-center md:items-end gap-4 md:gap-1 w-full md:w-auto justify-between md:justify-start">
                <div className="text-right">
                   <p className="font-semibold text-slate-800">₹{payment.amount.toLocaleString()}</p>
                   <div className="flex justify-end mt-1">{getStatusBadge(payment.status)}</div>
                </div>
                
                <div className="mt-2">
                  {payment.status === 'Paid' ? (
                    <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                      <Download size={14} /> Receipt
                    </button>
                  ) : (
                    <button 
                      onClick={() => handlePayNow(payment.id)}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors shadow-blue-200"
                    >
                      Pay Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};