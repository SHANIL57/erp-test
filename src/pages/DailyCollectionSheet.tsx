import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import PageHeader from '../components/PageHeader';
import { Calendar, DollarSign, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function DailyCollectionSheet() {
  const { sales } = useData();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Filter sales for selected date
  const dailySales = sales.filter(sale => {
    const saleDate = new Date(sale.createdAt).toDateString();
    const filterDate = new Date(selectedDate).toDateString();
    return saleDate === filterDate;
  });

  // Calculate daily totals
  const totalSales = dailySales.reduce((sum, sale) => sum + sale.total, 0);
  const paidSales = dailySales.filter(sale => sale.paymentStatus === 'paid');
  const pendingSales = dailySales.filter(sale => sale.paymentStatus === 'pending');
  const partialSales = dailySales.filter(sale => sale.paymentStatus === 'partial');
  
  const totalCollected = paidSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalPending = pendingSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalPartial = partialSales.reduce((sum, sale) => sum + sale.total, 0);

  // Collection summary by payment method (mock data)
  const paymentMethods = [
    { method: 'Cash', amount: totalCollected * 0.6, transactions: Math.floor(paidSales.length * 0.6) },
    { method: 'Card', amount: totalCollected * 0.3, transactions: Math.floor(paidSales.length * 0.3) },
    { method: 'Transfer', amount: totalCollected * 0.1, transactions: Math.floor(paidSales.length * 0.1) }
  ];

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Daily Collection Sheet"
        description="Track daily sales and collections"
        icon={Calendar}
      >
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </PageHeader>

      {/* Daily Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Sales</p>
              <p className="text-2xl font-bold text-gray-800">${totalSales.toFixed(2)}</p>
              <p className="text-xs text-gray-500">{dailySales.length} transactions</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Collected</p>
              <p className="text-2xl font-bold text-green-600">${totalCollected.toFixed(2)}</p>
              <p className="text-xs text-gray-500">{paidSales.length} paid</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 rounded-xl">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">${totalPending.toFixed(2)}</p>
              <p className="text-xs text-gray-500">{pendingSales.length} pending</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-100 rounded-xl">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Partial</p>
              <p className="text-2xl font-bold text-orange-600">${totalPartial.toFixed(2)}</p>
              <p className="text-xs text-gray-500">{partialSales.length} partial</p>
            </div>
          </div>
        </div>
      </div>

      {/* Collection by Payment Method */}
      <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Collection by Payment Method</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {paymentMethods.map((method) => (
            <div key={method.method} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-800">{method.method}</h4>
                <span className="text-sm text-gray-600">{method.transactions} txns</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">${method.amount.toFixed(2)}</p>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${totalCollected > 0 ? (method.amount / totalCollected) * 100 : 0}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {totalCollected > 0 ? ((method.amount / totalCollected) * 100).toFixed(1) : 0}% of total
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Transactions for {new Date(selectedDate).toLocaleDateString()}
        </h3>
        
        {dailySales.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Time</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Invoice #</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Customer</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Items</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {dailySales.map((sale) => (
                  <tr key={sale.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm">
                      {new Date(sale.createdAt).toLocaleTimeString()}
                    </td>
                    <td className="py-3 px-4 font-mono text-sm">
                      INV-{sale.id.substr(-6).toUpperCase()}
                    </td>
                    <td className="py-3 px-4">{sale.customerName}</td>
                    <td className="py-3 px-4 text-sm">
                      {sale.products.length} item{sale.products.length !== 1 ? 's' : ''}
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No transactions found for the selected date.</p>
          </div>
        )}
      </div>

      {/* Daily Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-800 mb-3">Financial Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Sales:</span>
                <span className="font-semibold">${totalSales.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Cash Collected:</span>
                <span className="font-semibold">${totalCollected.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-yellow-600">
                <span>Outstanding:</span>
                <span className="font-semibold">${(totalPending + totalPartial).toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-semibold">
                <span>Collection Rate:</span>
                <span>{totalSales > 0 ? ((totalCollected / totalSales) * 100).toFixed(1) : 0}%</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-3">Transaction Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Transactions:</span>
                <span className="font-semibold">{dailySales.length}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Paid Transactions:</span>
                <span className="font-semibold">{paidSales.length}</span>
              </div>
              <div className="flex justify-between text-yellow-600">
                <span>Pending Transactions:</span>
                <span className="font-semibold">{pendingSales.length}</span>
              </div>
              <div className="flex justify-between text-orange-600">
                <span>Partial Transactions:</span>
                <span className="font-semibold">{partialSales.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}