/* import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import PageHeader from '../components/PageHeader';
import { Settings, Users, Package, ShoppingCart, Receipt, Archive, TrendingUp, AlertTriangle, Download, Trash2 } from 'lucide-react';

export default function AdminPanel() {
  const { customers, parties, products, sales, purchases, fishBoxes } = useData();
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate overview statistics
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalPurchases = purchases.reduce((sum, purchase) => sum + purchase.total, 0);
  const totalCustomers = customers.length;
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.stock <= p.minStock).length;
  const pendingPayments = sales.filter(sale => sale.paymentStatus === 'pending').length;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'sales', label: 'Sales', icon: Receipt },
    { id: 'purchases', label: 'Purchases', icon: ShoppingCart },
    { id: 'fishboxes', label: 'Fish Boxes', icon: Archive },
    { id: 'system', label: 'System', icon: Settings }
  ];

  const handleClearData = (dataType: string) => {
    if (window.confirm(`Are you sure you want to clear all ${dataType} data? This action cannot be undone.`)) {
      localStorage.removeItem(`fishmarket_${dataType}`);
      window.location.reload();
    }
  };

  const handleExportData = () => {
    const data = {
      customers,
      parties,
      products,
      sales,
      purchases,
      fishBoxes,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aquatrade-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Admin Panel"
        description="System administration and data management"
        icon={Settings}
      >
        <button
          onClick={handleExportData}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span>Export Data</span>
        </button>
      </PageHeader>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-orange-100">
        <div className="flex space-x-1 p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <>
            {/* System Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <Receipt className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-800">${totalRevenue.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Customers</p>
                    <p className="text-2xl font-bold text-gray-800">{totalCustomers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-orange-100 rounded-xl">
                    <Package className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold text-gray-800">{totalProducts}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-red-100 rounded-xl">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Low Stock Items</p>
                    <p className="text-2xl font-bold text-gray-800">{lowStockProducts}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* System Health */}
            <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">System Health</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="w-12 h-12 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <p className="font-medium text-green-800">Database Status</p>
                  <p className="text-sm text-green-600">Operational</p>
                </div>

                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <span className="text-white font-bold">!</span>
                  </div>
                  <p className="font-medium text-yellow-800">Pending Tasks</p>
                  <p className="text-sm text-yellow-600">{pendingPayments} pending payments</p>
                </div>

                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="w-12 h-12 bg-blue-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <span className="text-white font-bold">i</span>
                  </div>
                  <p className="font-medium text-blue-800">Storage Usage</p>
                  <p className="text-sm text-blue-600">Local Storage</p>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'customers' && (
          <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Customer Management</h3>
              <button
                onClick={() => handleClearData('customers')}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All</span>
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Phone</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Balance</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{customer.name}</td>
                      <td className="py-3 px-4">{customer.email}</td>
                      <td className="py-3 px-4">{customer.phone}</td>
                      <td className="py-3 px-4">
                        <span className={customer.balance >= 0 ? 'text-green-600' : 'text-red-600'}>
                          ${customer.balance.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-3 px-4">{new Date(customer.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Product Management</h3>
              <button
                onClick={() => handleClearData('products')}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All</span>
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Stock</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Purchase Price</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Selling Price</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{product.name}</td>
                      <td className="py-3 px-4">{product.category}</td>
                      <td className="py-3 px-4">
                        <span className={product.stock <= product.minStock ? 'text-red-600 font-semibold' : ''}>
                          {product.stock} {product.unit}
                        </span>
                      </td>
                      <td className="py-3 px-4">${product.purchasePrice.toFixed(2)}</td>
                      <td className="py-3 px-4">${product.sellingPrice.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          product.stock <= product.minStock
                            ? 'bg-red-100 text-red-800'
                            : product.stock <= product.minStock * 2
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {product.stock <= product.minStock ? 'Low Stock' : 'In Stock'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'sales' && (
          <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Sales Data</h3>
              <button
                onClick={() => handleClearData('sales')}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All</span>
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Invoice #</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Customer</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Items</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Total</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((sale) => (
                    <tr key={sale.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono text-sm">INV-{sale.id.substr(-6).toUpperCase()}</td>
                      <td className="py-3 px-4">{sale.customerName}</td>
                      <td className="py-3 px-4">{sale.products.length} items</td>
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
                      <td className="py-3 px-4">{new Date(sale.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'purchases' && (
          <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Purchase Data</h3>
              <button
                onClick={() => handleClearData('purchases')}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All</span>
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">PO #</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Supplier</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Items</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Total</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((purchase) => (
                    <tr key={purchase.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono text-sm">PO-{purchase.id.substr(-6).toUpperCase()}</td>
                      <td className="py-3 px-4">{purchase.partyName}</td>
                      <td className="py-3 px-4">{purchase.products.length} items</td>
                      <td className="py-3 px-4 font-semibold">${purchase.total.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          purchase.paymentStatus === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : purchase.paymentStatus === 'partial'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {purchase.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4">{new Date(purchase.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'fishboxes' && (
          <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Fish Box Data</h3>
              <button
                onClick={() => handleClearData('fishboxes')}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All</span>
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Box Number</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Fish Type</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Weight</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Grade</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {fishBoxes.map((box) => (
                    <tr key={box.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono">{box.boxNumber}</td>
                      <td className="py-3 px-4">{box.fishType}</td>
                      <td className="py-3 px-4">{box.weight} kg</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          box.grade === 'A' 
                            ? 'bg-green-100 text-green-800' 
                            : box.grade === 'B' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          Grade {box.grade}
                        
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          box.status === 'received' 
                            ? 'bg-blue-100 text-blue-800' 
                            : box.status === 'sent'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {box.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">{new Date(box.date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="space-y-6">
            {/* System Information */}
            <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">System Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Application Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Version:</span>
                      <span className="font-medium">1.0.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Environment:</span>
                      <span className="font-medium">Development</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Storage:</span>
                      <span className="font-medium">Local Storage</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Data Statistics</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Records:</span>
                      <span className="font-medium">
                        {customers.length + parties.length + products.length + sales.length + purchases.length + fishBoxes.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Backup:</span>
                      <span className="font-medium">Never</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Data Integrity:</span>
                      <span className="font-medium text-green-600">Good</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Management */}
            <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Data Management</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={handleExportData}
                  className="flex items-center justify-center space-x-2 p-4 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  <span>Export All Data</span>
                </button>
                
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear ALL data? This action cannot be undone.')) {
                      localStorage.clear();
                      window.location.reload();
                    }
                  }}
                  className="flex items-center justify-center space-x-2 p-4 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                  <span>Clear All Data</span>
                </button>
              </div>
            </div>

            {/* System Logs */}
            <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">System initialized</p>
                    <p className="text-sm text-gray-600">Application started successfully</p>
                  </div>
                  <span className="text-sm text-gray-500">{new Date().toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">Data loaded</p>
                    <p className="text-sm text-gray-600">Local storage data retrieved</p>
                  </div>
                  <span className="text-sm text-gray-500">{new Date().toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
