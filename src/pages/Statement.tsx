import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import PageHeader from '../components/PageHeader';
import { FileText, Download, Printer, Calendar, DollarSign, User } from 'lucide-react';

export default function Statement() {
  const { customers, sales } = useData();
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const selectedCustomerData = customers.find(c => c.id === selectedCustomer);
  const customerSales = selectedCustomer ? sales.filter(sale => 
    sale.customerId === selectedCustomer &&
    new Date(sale.createdAt) >= new Date(dateRange.start) &&
    new Date(sale.createdAt) <= new Date(dateRange.end)
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) : [];

  const totalSales = customerSales.reduce((sum, sale) => sum + sale.total, 0);
  const paidAmount = customerSales.filter(sale => sale.paymentStatus === 'paid').reduce((sum, sale) => sum + sale.total, 0);
  const pendingAmount = customerSales.filter(sale => sale.paymentStatus === 'pending').reduce((sum, sale) => sum + sale.total, 0);
  const partialAmount = customerSales.filter(sale => sale.paymentStatus === 'partial').reduce((sum, sale) => sum + sale.total, 0);

  // Calculate running balance
  let runningBalance = selectedCustomerData?.balance || 0;
  const salesWithBalance = customerSales.map(sale => {
    const saleWithBalance = {
      ...sale,
      balanceBefore: runningBalance,
      balanceAfter: runningBalance + (sale.paymentStatus === 'paid' ? 0 : sale.total)
    };
    runningBalance = saleWithBalance.balanceAfter;
    return saleWithBalance;
  }).reverse();

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Customer Statement"
        description="Generate detailed customer account statements"
        icon={FileText}
      >
        <div className="flex items-center space-x-3">
          <button 
            disabled={!selectedCustomer}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>
          <button 
            disabled={!selectedCustomer}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
        </div>
      </PageHeader>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
            <select
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {selectedCustomer && selectedCustomerData ? (
        <div className="space-y-6">
          {/* Statement Header */}
          <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">ACCOUNT STATEMENT</h2>
              <p className="text-gray-600">AquaTrade Fish Market Management</p>
              <p className="text-sm text-gray-500">
                Period: {new Date(dateRange.start).toLocaleDateString()} - {new Date(dateRange.end).toLocaleDateString()}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Customer Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{selectedCustomerData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{selectedCustomerData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{selectedCustomerData.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Customer Since:</span>
                    <span className="font-medium">{new Date(selectedCustomerData.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Account Summary */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Account Summary
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Sales:</span>
                    <span className="font-semibold">${totalSales.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Paid Amount:</span>
                    <span className="font-semibold">${paidAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Pending Amount:</span>
                    <span className="font-semibold">${pendingAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-orange-600">
                    <span>Partial Amount:</span>
                    <span className="font-semibold">${partialAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-bold text-lg">
                    <span>Current Balance:</span>
                    <span className={selectedCustomerData.balance >= 0 ? 'text-green-600' : 'text-red-600'}>
                      ${Math.abs(selectedCustomerData.balance).toFixed(2)} {selectedCustomerData.balance >= 0 ? 'CR' : 'DR'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Transaction History</h3>
            
            {customerSales.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Invoice #</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Description</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesWithBalance.map((sale) => (
                      <tr key={sale.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm">
                          {new Date(sale.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 font-mono text-sm">
                          INV-{sale.id.substr(-6).toUpperCase()}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <div>
                            <p className="font-medium">Sales Invoice</p>
                            <p className="text-gray-600">
                              {sale.products.length} item{sale.products.length !== 1 ? 's' : ''} • 
                              {sale.products.slice(0, 2).map(p => p.productName).join(', ')}
                              {sale.products.length > 2 && ` +${sale.products.length - 2} more`}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-semibold">${sale.total.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            sale.paymentStatus === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : sale.paymentStatus === 'partial'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {sale.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold">
                          ${Math.abs(sale.balanceAfter).toFixed(2)} {sale.balanceAfter >= 0 ? 'CR' : 'DR'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No transactions found for the selected period.</p>
              </div>
            )}
          </div>

          {/* Statement Footer */}
          <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
            <div className="border-t pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Payment Terms</h4>
                  <p className="text-sm text-gray-600">
                    Payment is due within 30 days of invoice date. Late payments may be subject to interest charges.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Contact Information</h4>
                  <div className="text-sm text-gray-600">
                    <p>AquaTrade Fish Market</p>
                    <p>Email: accounts@aquatrade.com</p>
                    <p>Phone: +1-555-FISH-MKT</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  Statement generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  This is a computer-generated statement and does not require a signature.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-12">
          <div className="text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">Select a Customer</h3>
            <p className="text-gray-600">Choose a customer from the dropdown above to generate their account statement.</p>
          </div>
        </div>
      )}
    </div>
  );
}