import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { useData } from '../context/DataContext';
import PageHeader from '../components/PageHeader';
import StatsCard from '../components/StatsCard';
import { BarChart3, DollarSign, Package, Users, TrendingUp, AlertTriangle } from 'lucide-react';

const salesData = [
  { month: 'Jan', sales: 45000, purchases: 35000 },
  { month: 'Feb', sales: 52000, purchases: 40000 },
  { month: 'Mar', sales: 48000, purchases: 38000 },
  { month: 'Apr', sales: 61000, purchases: 45000 },
  { month: 'May', sales: 55000, purchases: 42000 },
  { month: 'Jun', sales: 67000, purchases: 50000 },
];

const productData = [
  { name: 'Salmon', value: 35, fill: '#3B82F6' },
  { name: 'Tuna', value: 25, fill: '#EF4444' },
  { name: 'Prawns', value: 20, fill: '#F97316' },
  { name: 'Others', value: 20, fill: '#8B5CF6' },
];

export default function Dashboard() {
  const { customers, parties, products, sales } = useData();

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalCustomers = customers.length;
  const totalProducts = products.length;
  const lowStockProducts = products.filter(product => product.stock <= product.minStock).length;

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Dashboard"
        description="Welcome to AquaTrade Fish Market Management System"
        icon={BarChart3}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          change={{ value: '12.5%', type: 'increase' }}
          icon={DollarSign}
          color="green"
        />
        <StatsCard
          title="Active Customers"
          value={totalCustomers}
          change={{ value: '8.2%', type: 'increase' }}
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="Products in Stock"
          value={totalProducts}
          change={{ value: '3.1%', type: 'increase' }}
          icon={Package}
          color="orange"
        />
        <StatsCard
          title="Low Stock Alerts"
          value={lowStockProducts}
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales vs Purchases Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales vs Purchases</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
              <Bar dataKey="sales" fill="#3B82F6" name="Sales" />
              <Bar dataKey="purchases" fill="#F97316" name="Purchases" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Product Distribution Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={productData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {productData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales */}
        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Sales</h3>
          <div className="space-y-3">
            {sales.slice(0, 5).map((sale) => (
              <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{sale.customerName}</p>
                  <p className="text-sm text-gray-600">{new Date(sale.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">${sale.total.toFixed(2)}</p>
                  <p className={`text-xs px-2 py-1 rounded-full ${
                    sale.paymentStatus === 'paid'
                      ? 'bg-green-100 text-green-800'
                      : sale.paymentStatus === 'partial'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {sale.paymentStatus}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Low Stock Alert</h3>
          <div className="space-y-3">
            {products
              .filter(product => product.stock <= product.minStock)
              .slice(0, 5)
              .map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div>
                    <p className="font-medium text-gray-800">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-600">{product.stock} {product.unit}</p>
                    <p className="text-xs text-red-500">Min: {product.minStock}</p>
                  </div>
                </div>
              ))}
            {products.filter(product => product.stock <= product.minStock).length === 0 && (
              <p className="text-gray-500 text-center py-4">No low stock items</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}