import React from 'react';
import { useData } from '../context/DataContext';
import PageHeader from '../components/PageHeader';
import { UserCheck, DollarSign, Calendar, AlertCircle } from 'lucide-react';

export default function SalesmanReceivable() {
  const { customers, sales } = useData();

  const receivables = customers.map(customer => {
    const customerSales = sales.filter(sale => sale.customerId === customer.id);
    const unpaidSales = customerSales.filter(sale => sale.paymentStatus !== 'paid');
    const totalOutstanding = unpaidSales.reduce((sum, sale) => sum + sale.total, 0);
    const totalSales = customerSales.reduce((sum, sale) => sum + sale.total, 0);
    
    return {
      ...customer,
      totalSales,
      totalOutstanding,
      unpaidSales
    };
  }).filter(r => r.totalOutstanding > 0);

  const totalReceivables = receivables.reduce((sum, r) => sum + r.totalOutstanding, 0);
  const overdueReceivables = receivables.filter(r => 
    r.unpaidSales.some(sale => 
      (Date.now() - new Date(sale.createdAt).getTime()) > 30 * 24 * 60 * 60 * 1000
    )
  );

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Salesman Receivable (RCBL)"
        description="Track outstanding payments from customers"
        icon={UserCheck}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Receivables</p>
              <p className="text-2xl font-bold text-gray-800">${totalReceivables.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-100 rounded-xl">
              <UserCheck className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Customers with Dues</p>
              <p className="text-2xl font-bold text-gray-800">{receivables.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-100 rounded-xl">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Overdue Accounts</p>
              <p className="text-2xl font-bold text-gray-800">{overdueReceivables.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Receivables Table */}
      <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Outstanding Receivables</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Customer</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Contact</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Total Sales</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Outstanding</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Unpaid Orders</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Last Sale</th>
              </tr>
            </thead>
            <tbody>
              {receivables.map((receivable) => {
                const isOverdue = receivable.unpaidSales.some(sale => 
                  (Date.now() - new Date(sale.createdAt).getTime()) > 30 * 24 * 60 * 60 * 1000
                );
                const lastSale = receivable.unpaidSales.sort((a, b) => 
                  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                )[0];

                return (
                  <tr key={receivable.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-800">{receivable.name}</p>
                        <p className="text-sm text-gray-600">{receivable.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{receivable.phone}</td>
                    <td className="py-3 px-4 font-semibold text-gray-800">
                      ${receivable.totalSales.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 font-semibold text-red-600">
                      ${receivable.totalOutstanding.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {receivable.unpaidSales.length}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        isOverdue
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {isOverdue ? 'Overdue' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {lastSale ? new Date(lastSale.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {receivables.length === 0 && (
          <div className="text-center py-8">
            <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No outstanding receivables found.</p>
          </div>
        )}
      </div>

      {/* Detailed Breakdown */}
      {receivables.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Detailed Breakdown</h3>
          <div className="space-y-6">
            {receivables.slice(0, 5).map((receivable) => (
              <div key={receivable.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-800">{receivable.name}</h4>
                  <span className="font-semibold text-red-600">
                    ${receivable.totalOutstanding.toFixed(2)} Outstanding
                  </span>
                </div>
                
                <div className="space-y-2">
                  {receivable.unpaidSales.map((sale) => (
                    <div key={sale.id} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                      <div>
                        <span className="font-mono">INV-{sale.id.substr(-6).toUpperCase()}</span>
                        <span className="ml-3 text-gray-600">
                          {new Date(sale.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="font-medium">${sale.total.toFixed(2)}</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          sale.paymentStatus === 'pending'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {sale.paymentStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}