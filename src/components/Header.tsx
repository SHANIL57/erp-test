import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Fish, Menu, X, BarChart3, ShoppingCart, Package, Users, FileText, Calendar, TrendingUp, Receipt, Building2, Archive, Send, UserCheck, Settings } from 'lucide-react';

const navigationItems = [
  { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { path: '/billing', label: 'Billing', icon: Receipt },
  { path: '/purchase', label: 'Purchase', icon: ShoppingCart },
  { path: '/inventory', label: 'Inventory', icon: Package },
  // { path: '/salesman-receivable', label: 'RCBL', icon: UserCheck },
  { path: '/reports', label: 'Reports', icon: FileText },
  { path: '/daily-collection', label: 'Daily Collection', icon: Calendar },
  // { path: '/sales-register', label: 'Sales Register', icon: TrendingUp },
  // { path: '/sales-summary', label: 'Sales Summary', icon: BarChart3 },
  { path: '/statement', label: 'Statement', icon: FileText },
  { path: '/fish-boxes-received', label: 'Boxes Received', icon: Archive },
  { path: '/fish-boxes-sent', label: 'Boxes Sent', icon: Send },
  { path: '/customers', label: 'Customers', icon: Users },
  { path: '/parties', label: 'Parties', icon: Building2 },
  // { path: '/admin', label: 'Admin Panel', icon: Settings }
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-orange-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-orange-400 rounded-lg group-hover:scale-105 transition-transform">
              <Fish className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">AquaTrade</h1>
              <p className="text-xs text-gray-500">Fish Market Management</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden 2xl:block">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="xl:hidden p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="xl:hidden bg-white border-t border-orange-200 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex flex-col items-center space-y-2 p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs text-center leading-tight">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
