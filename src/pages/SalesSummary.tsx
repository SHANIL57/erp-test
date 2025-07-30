import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import PageHeader from '../components/PageHeader';
import { BarChart3, Calendar, TrendingUp, Package, Users, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

export default function SalesSummary() {
  const { sales, customers, products } = useData();
  const [viewType, setViewType] = useState<'monthly' | 'weekly' | 'daily'>('monthly');
  const [selectedPeriod, setSelectedPeriod] = useState('last6months');

  // Generate time series data based on view type
  const generateTimeSeriesData = () => {
    const data = [];
    const now = new Date();
    
    if (viewType === 'monthly') {
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        
        const monthSales = sales.filter(sale => {
          const saleDate = new Date(sale.createdAt);
          return saleDate.getMonth() === date.getMonth() && saleDate.getFullYear() === date.getFullYear();
        });
        
        data.push({
          period: monthName,
          sales: monthSales.reduce((sum, sale) => sum + sale.total, 0),
          transactions: monthSales.length,
          customers: new Set(monthSales.map(sale => sale.customerId)).size
        });
      }
    } else if (viewType === 'weekly') {
      for (let i = 7; i >= 0; i--) {
        const date = new Date(now.getTime() - (i * 7 * 24 * 60 * 60 * 1000));
        const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
        const weekEnd = new Date(weekStart.getTime() + (6 * 24 * 60 * 60 * 1000));
        
        const weekSales = sales.filter(sale => {
          const saleDate = new Date(sale.createdAt);
          return saleDate >= weekStart && saleDate <= weekEnd;
        });
        
        data.push({
          period: `W${Math.ceil((weekStart.getDate()) / 7)}`,
          sales: weekSales.reduce((sum, sale) => sum + sale.total, 0),
          transactions: weekSales.length,
          customers: new Set(weekSales.map(sale => sale.customerId)).size
        });
      }
    } else {
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        const daySales = sales.filter(sale => {
          const saleDate = new Date(sale.createdAt);
          return saleDate.toDateString() === date.toDateString();
        });
        
        data.push({
          period: dayName,
          sales: daySales.reduce((sum, sale) => sum + sale.total, 0),
          transactions: daySales.length,
          customers: new Set(daySales.map(sale => sale.customerId)).size
        });
      }
    }
    
    return data;
  };

  // Product performance data
  const productPerformance = () => {
    const productSales = {};
    
    sales.forEach(sale => {
      sale.products.forEach(product => {
        if (!productSales[product.productId]) {
          productSales[product.productId] = {
            name: product.productName,
            quantity: 0,
            revenue: 0,
            orders: new Set()
          };
        }
        productSales[product.productId].quantity += product.quantity;
        productSales[product.productId].revenue += product.total;
        productSales[product.productId].orders.add(sale.id);
      });
    });

    return Object.values(productSales)
      .map(product => ({
        ...product,
        orders: product.orders.size
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  };

  // Customer analysis
  const customerAnalysis = () => {
    const customerData = {};
    
    sales.forEach(sale => {
      if (!customerData[sale.customerId]) {
        customerData[sale.customerId] = {
          name: sale.customerName,
          orders: 0,
          revenue: 0,
          lastOrder: sale.createdAt
        };
      }
      customerData[sale.customerId].orders += 1;
      customerData[sale.customerId].revenue += sale.total;
      if (new Date(sale.createdAt) > new Date(customerData[sale.customerId].lastOrder)) {
        customerData[sale.customerId].lastOrder = sale.createdAt;
      }
    });

    return Object.values(customerData)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  };

  const timeSeriesData = generateTimeSeriesData();
  const topProducts = productPerformance();
  const topCustomers = customerAnalysis();

  // Calculate summary metrics
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalTransactions = sales.length;
  const averageOrderValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
  const uniqueCustomers = new Set(sales.map(sale => sale.customerId)).size;

  // Product category breakdown
  const categoryBreakdown = products.reduce((acc, product) => {
    const category = product.category;
    const productSales = sales.reduce((sum, sale) => {
      const productInSale = sale.products.find(p => p.productId === product.id);
      return sum + (productInSale ? productInSale.total : 0);
    }, 0);
    
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += productSales;
    return acc;
  }, {});

  const categoryData = Object.entries(categoryBreakdown)
    .map(([category, revenue], index) => ({
      name: category,
      value: revenue,
      fill: ['#3B82F6', '#EF4444', '#F97316', '#8B5CF6', '#10B981'][index % 5]
    }))
    .filter(item => item.value > 0);

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Sales Summary"
        description="Comprehensive sales analytics and insights"
        icon={BarChart3}
      >
        <div className="flex items-center space-x-3">
          <select
            value={viewType}
            onChange={(e) => setViewType(e.target.value as 'monthly' | 'weekly' | 'daily')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </PageHeader>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-800">${totalRevenue.toFixed(2)}</p>
              <p className="text-xs text-green-600 mt-1">↗ 12.5% vs last period</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-800">{totalTransactions}</p>
              <p className="text-xs text-blue-600 mt-1">↗ 8.3% vs last period</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-100 rounded-xl">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-800">${averageOrderValue.toFixed(2)}</p>
              <p className="text-xs text-orange-600 mt-1">↗ 3.7% vs last period</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Unique Customers</p>
              <p className="text-2xl font-bold text-gray-800">{uniqueCustomers}</p>
              <p className="text-xs text-purple-600 mt-1">↗ 15.2% vs last period</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Trend Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Sales Trend ({viewType.charAt(0).toUpperCase() + viewType.slice(1)})
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={timeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [
                name === 'sales' ? `$${value.toLocaleString()}` : value.toLocaleString(),
                name === 'sales' ? 'Revenue' : name === 'transactions' ? 'Orders' : 'Customers'
              ]}
            />
            <Bar dataKey="sales" fill="#3B82F6" name="sales" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Category Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales by Category</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No category data available
            </div>
          )}
        </div>

        {/* Customer vs Transaction Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Engagement</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="transactions" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="Orders"
              />
              <Line 
                type="monotone" 
                dataKey="customers" 
                stroke="#F97316" 
                strokeWidth={2}
                name="Customers"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Performing Products</h3>
          <div className="space-y-3">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.quantity} units • {product.orders} orders</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">${product.revenue.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Customers */}
        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Customers</h3>
          <div className="space-y-3">
            {topCustomers.map((customer, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-green-600">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{customer.name}</p>
                    <p className="text-sm text-gray-600">
                      {customer.orders} orders • Last: {new Date(customer.lastOrder).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">${customer.revenue.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Summary Table */}
      <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Period Summary Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Period</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Revenue</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Orders</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Customers</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Avg Order</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Growth</th>
              </tr>
            </thead>
            <tbody>
              {timeSeriesData.map((period, index) => {
                const prevPeriod = timeSeriesData[index - 1];
                const growth = prevPeriod ? ((period.sales - prevPeriod.sales) / prevPeriod.sales * 100) : 0;
                
                return (
                  <tr key={period.period} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{period.period}</td>
                    <td className="py-3 px-4 font-semibold">${period.sales.toFixed(2)}</td>
                    <td className="py-3 px-4">{period.transactions}</td>
                    <td className="py-3 px-4">{period.customers}</td>
                    <td className="py-3 px-4">
                      ${period.transactions > 0 ? (period.sales / period.transactions).toFixed(2) : '0.00'}
                    </td>
                    <td className="py-3 px-4">
                      {index > 0 && (
                        <span className={`text-sm font-medium ${
                          growth > 0 ? 'text-green-600' : growth < 0 ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {growth > 0 ? '↗' : growth < 0 ? '↘' : '→'} {Math.abs(growth).toFixed(1)}%
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}