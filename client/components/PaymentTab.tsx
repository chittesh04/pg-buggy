import React, { useState } from 'react';
import { CreditCard, Download, CheckCircle2, AlertCircle, Clock, Smartphone, X } from 'lucide-react';
import { useData } from '../services/DataContext';

export const PaymentTab: React.FC = () => {
  const { payments, payBill, currentUser } = useData();
  
  // Modal State
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);

  const myPayments = payments.filter(c => 
    (typeof c.student === 'string' ? c.student === currentUser?.id : (c.student as any)?.id === currentUser?.id)
  );

  const stats = {
    totalDue: myPayments.filter(p => p.status === 'Pending' || p.status === 'Overdue').reduce((acc, curr) => acc + curr.amount, 0),
    paidThisMonth: myPayments.filter(p => p.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0),
    nextDueDate: 'Nov 30, 2025'
  };

  const handleOpenPaymentModal = (id: string) => {
    setSelectedPaymentId(id);
    setIsPayModalOpen(true);
  };

  const handleConfirmPayment = () => {
    if (selectedPaymentId) {
      payBill(selectedPaymentId);
      setIsPayModalOpen(false);
      setSelectedPaymentId(null);
      // Success Alert
      alert("Payment submitted! Your payment will be verified by the admin and updated shortly.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid':
        return <span className="bg-green-100 text-green-600 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1"><CheckCircle2 size={12} /> paid</span>;
      case 'Pending':
        return <span className="bg-yellow-100 text-yellow-700 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1"><Clock size={12} /> pending</span>;
      case 'Overdue':
        return <span className="bg-red-100 text-red-600 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1"><AlertCircle size={12} /> overdue</span>;
      case 'Verification Pending':
        return <span className="bg-orange-100 text-orange-600 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse"><Clock size={12} /> verifying...</span>;
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

      {/* Stats Cards (Same as before) */}
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
                    <p className="text-xs text-slate-400 mt-1">Paid on {payment.paidOn}</p>
                  )}
                  {payment.status === 'Verification Pending' && (
                    <p className="text-xs text-orange-500 mt-1 font-medium">Waiting for Admin Approval</p>
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
                  ) : payment.status === 'Verification Pending' ? (
                     <button disabled className="px-4 py-2 text-sm font-medium text-slate-400 bg-slate-100 rounded-lg cursor-not-allowed">
                       Processing...
                     </button>
                  ) : (
                    <button 
                      onClick={() => handleOpenPaymentModal(payment.id)}
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

      {/* Payment Modal */}
      {isPayModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
               <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                 <Smartphone size={18} className="text-blue-600"/> UPI Payment
               </h3>
               <button onClick={() => setIsPayModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
            </div>
            
            <div className="p-6 text-center">
              <div className="bg-slate-100 p-4 rounded-lg mb-4 inline-block">
                {/* Placeholder for QR Code */}
                <img 
                   src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=hosteladmin@upi&pn=HostelFee&am=${payments.find(p => p.id === selectedPaymentId)?.amount}`} 
                   alt="UPI QR" 
                   className="w-32 h-32 opacity-90 mix-blend-multiply"
                />
              </div>
              <p className="text-sm text-slate-500 mb-1">Scan QR or use UPI ID:</p>
              <div className="bg-blue-50 text-blue-800 font-mono text-sm py-2 px-4 rounded-lg mb-4 inline-block">
                hosteladmin@upi
              </div>
              <p className="text-xs text-slate-400">
                Amount to Pay: <span className="font-bold text-slate-700">₹{payments.find(p => p.id === selectedPaymentId)?.amount}</span>
              </p>
            </div>

            <div className="p-4 bg-slate-50 flex gap-3">
              <button 
                onClick={() => setIsPayModalOpen(false)}
                className="flex-1 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmPayment}
                className="flex-1 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-sm"
              >
                I have Paid
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};