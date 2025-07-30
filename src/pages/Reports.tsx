import React from 'react';
import { useData } from '../context/DataContext';
import PageHeader from '../components/PageHeader';
import { FileText, Download, Printer, TrendingUp, DollarSign, Users, Package } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function Reports() {
  const { customers, products, sales, purchases } = useData();

  // Calculate metrics
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalPurchases = purchases.reduce((sum, purchase) => sum + purchase.total, 0);
  const grossProfit = totalRevenue - totalPurchases;
  
  // Monthly data
  const monthlyData = [];
  const currentDate = new Date();
  for (let i = 5; i >= 0; i--) {
    const month = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthName = month.toLocaleDateString('en-US', { month: 'short' });
    
    const monthlySales = sales.filter(sale => {
      const saleDate = new Date(sale.createdAt);
      return saleDate.getMonth() === month.getMonth() && saleDate.getFullYear() === month.getFullYear();
    });
    
    const monthlyPurchases = purchases.filter(purchase => {
      const purchaseDate = new Date(purchase.createdAt);
      return purchaseDate.getMonth() === month.getMonth() && purchaseDate.getFullYear() === month.getFullYear();
    });
    
    monthlyData.push({
      month: monthName,
      sales: monthlySales.reduce((sum, sale) => sum + sale.total, 0),
      purchases: monthlyPurchases.reduce((sum, purchase) => sum + purchase.total, 0),
      profit: monthlySales.reduce((sum, sale) => sum + sale.total, 0) - monthlyPurchases.reduce((sum, purchase) => sum + purchase.total, 0)
    });
  }

  // Top products
  const productSales = {};
  sales.forEach(sale => {
    sale.products.forEach(product => {
      if (!productSales[product.productId]) {
        productSales[product.productId] = {
          name: product.productName,
          quantity: 0,
          revenue: 0
        };
      }
      productSales[product.productId].quantity += product.quantity;
      productSales[product.productId].revenue += product.total;
    });
  });

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Reports & Analytics"
        description="Business insights and performance metrics"
        icon={FileText}
      >
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </PageHeader>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-800">${totalRevenue.toFixed(2)}</p>
              <p className="text-xs text-green-600 mt-1">↗ 12.5% vs last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Gross Profit</p>
              <p className="text-2xl font-bold text-gray-800">${grossProfit.toFixed(2)}</p>
              <p className="text-xs text-blue-600 mt-1">
                {totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(1) : 0}% margin
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-100 rounded-xl">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Customers</p>
              <p className="text-2xl font-bold text-gray-800">{customers.length}</p>
              <p className="text-xs text-orange-600 mt-1">↗ 8.2% vs last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Products Sold</p>
              <p className="text-2xl font-bold text-gray-800">
                {sales.reduce((sum, sale) => sum + sale.products.length, 0)}
              </p>
              <p className="text-xs text-purple-600 mt-1">↗ 15.3% vs last month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
              <Bar dataKey="sales" fill="#3B82F6" name="Sales" />
              <Bar dataKey="purchases" fill="#F97316" name="Purchases" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Profit Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Profit Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Profit']} />
              <Line 
                type="monotone" 
                dataKey="profit" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products and Customer Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Selling Products</h3>
          <div className="space-y-3">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.quantity} units sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">${product.revenue.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Insights */}
        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Insights</h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-blue-800 font-medium">Average Order Value</span>
                <span className="text-blue-600 font-bold">
                  ${sales.length > 0 ? (totalRevenue / sales.length).toFixed(2) : '0.00'}
                </span>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-green-800 font-medium">Repeat Customers</span>
                <span className="text-green-600 font-bold">
                  {customers.filter(customer => 
                    sales.filter(sale => sale.customerId === customer.id).length > 1
                  ).length}
                </span>
              </div>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-orange-800 font-medium">Customer Retention</span>
                <span className="text-orange-600 font-bold">
                  {customers.length > 0 ? (
                    (customers.filter(customer => 
                      sales.filter(sale => sale.customerId === customer.id).length > 1
                    ).length / customers.length * 100).toFixed(1)
                  ) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Executive Summary</h3>
        <div className="prose max-w-none text-gray-600">
          <p className="mb-4">
            <strong>Performance Overview:</strong> The business has generated a total revenue of ${totalRevenue.toFixed(2)} 
            with {sales.length} transactions across {customers.length} customers. The gross profit margin stands at{' '}
            {totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(1) : 0}%.
          </p>
          
          <p className="mb-4">
            <strong>Key Highlights:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 mb-4">
            <li>Average order value: ${sales.length > 0 ? (totalRevenue / sales.length).toFixed(2) : '0.00'}</li>
            <li>Top performing product: {topProducts[0]?.name || 'N/A'}</li>
            <li>Customer retention rate: {customers.length > 0 ? (
              (customers.filter(customer => 
                sales.filter(sale => sale.customerId === customer.id).length > 1
              ).length / customers.length * 100).toFixed(1)
            ) : 0}%</li>
            <li>Total products in inventory: {products.length}</li>
          </ul>
          
          <p>
            <strong>Recommendations:</strong> Focus on maintaining strong relationships with repeat customers and 
            consider expanding the product range based on top-performing categories.
          </p>
        </div>
      </div>
    </div>
  );
}