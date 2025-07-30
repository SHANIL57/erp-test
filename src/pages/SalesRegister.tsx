import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import PageHeader from '../components/PageHeader';
import { TrendingUp, Calendar, Filter, Search, Eye, Download } from 'lucide-react';

export default function SalesRegister() {
  const { sales } = useData();
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter sales based on criteria
  const filteredSales = sales.filter(sale => {
    const saleDate = new Date(sale.createdAt);
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    
    const matchesDate = saleDate >= startDate && saleDate <= endDate;
    const matchesSearch = sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sale.paymentStatus === statusFilter;
    
    return matchesDate && matchesSearch && matchesStatus;
  });

  // Calculate totals
  const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalTax = filteredSales.reduce((sum, sale) => sum + sale.tax, 0);
  const totalSubtotal = filteredSales.reduce((sum, sale) => sum + sale.subtotal, 0);

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Sales Register"
        description="Comprehensive sales transaction record"
        icon={TrendingUp}
      >
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </PageHeader>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Customer or Invoice ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="partial">Partial</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
          <h3 className="text-sm font-medium text-gray-600">Total Sales</h3>
          <p className="text-2xl font-bold text-gray-800">${totalSales.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">{filteredSales.length} transactions</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
          <h3 className="text-sm font-medium text-gray-600">Subtotal</h3>
          <p className="text-2xl font-bold text-blue-600">${totalSubtotal.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">Before tax</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
          <h3 className="text-sm font-medium text-gray-600">Total Tax</h3>
          <p className="text-2xl font-bold text-orange-600">${totalTax.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">Tax collected</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
          <h3 className="text-sm font-medium text-gray-600">Average Sale</h3>
          <p className="text-2xl font-bold text-green-600">
            ${filteredSales.length > 0 ? (totalSales / filteredSales.length).toFixed(2) : '0.00'}
          </p>
          <p className="text-xs text-gray-500 mt-1">Per transaction</p>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Sales Transactions</h3>
          <span className="text-sm text-gray-600">
            Showing {filteredSales.length} of {sales.length} transactions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Invoice #</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Customer</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Items</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Subtotal</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Tax</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Total</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm">
                    {new Date(sale.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 font-mono text-sm">
                    INV-{sale.id.substr(-6).toUpperCase()}
                  </td>
                  <td className="py-3 px-4">{sale.customerName}</td>
                  <td className="py-3 px-4 text-sm">
                    <div className="space-y-1">
                      {sale.products.slice(0, 2).map((product, index) => (
                        <div key={index} className="text-xs text-gray-600">
                          {product.productName} (×{product.quantity})
                        </div>
                      ))}
                      {sale.products.length > 2 && (
                        <div className="text-xs text-blue-600">
                          +{sale.products.length - 2} more items
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold">${sale.subtotal.toFixed(2)}</td>
                  <td className="py-3 px-4 text-gray-600">${sale.tax.toFixed(2)}</td>
                  <td className="py-3 px-4 font-semibold text-lg">${sale.total.toFixed(2)}</td>
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
                  <td className="py-3 px-4">
                    <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSales.length === 0 && (
          <div className="text-center py-8">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No sales found for the selected criteria.</p>
          </div>
        )}
      </div>

      {/* Register Summary */}
      {filteredSales.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Register Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Payment Status Breakdown</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Paid:</span>
                  <span className="font-semibold">
                    {filteredSales.filter(s => s.paymentStatus === 'paid').length} 
                    (${filteredSales.filter(s => s.paymentStatus === 'paid').reduce((sum, s) => sum + s.total, 0).toFixed(2)})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Pending:</span>
                  <span className="font-semibold">
                    {filteredSales.filter(s => s.paymentStatus === 'pending').length}
                    (${filteredSales.filter(s => s.paymentStatus === 'pending').reduce((sum, s) => sum + s.total, 0).toFixed(2)})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Partial:</span>
                  <span className="font-semibold">
                    {filteredSales.filter(s => s.paymentStatus === 'partial').length}
                    (${filteredSales.filter(s => s.paymentStatus === 'partial').reduce((sum, s) => sum + s.total, 0).toFixed(2)})
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">Sales Metrics</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Total Items Sold:</span>
                  <span className="font-semibold">
                    {filteredSales.reduce((sum, sale) => sum + sale.products.reduce((itemSum, product) => itemSum + product.quantity, 0), 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Unique Customers:</span>
                  <span className="font-semibold">
                    {new Set(filteredSales.map(sale => sale.customerId)).size}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax Rate:</span>
                  <span className="font-semibold">
                    {totalSubtotal > 0 ? ((totalTax / totalSubtotal) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-medium text-orange-800 mb-2">Time Period</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>From:</span>
                  <span className="font-semibold">{new Date(dateRange.start).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>To:</span>
                  <span className="font-semibold">{new Date(dateRange.end).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-semibold">
                    {Math.ceil((new Date(dateRange.end) - new Date(dateRange.start)) / (1000 * 60 * 60 * 24)) + 1} days
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}