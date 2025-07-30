import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import { Send, Plus, Eye, Calendar, User, Package } from 'lucide-react';

export default function FishBoxesSent() {
  const { fishBoxes, customers, addFishBox, updateFishBox } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    boxNumber: '',
    fishType: '',
    weight: 0,
    grade: 'A' as 'A' | 'B' | 'C',
    customerId: '',
    date: new Date().toISOString().split('T')[0]
  });

  const sentBoxes = fishBoxes.filter(box => box.status === 'sent');
  const availableBoxes = fishBoxes.filter(box => box.status === 'in_stock' || box.status === 'received');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const boxData = {
      ...formData,
      status: 'sent' as const
    };

    addFishBox(boxData);
    handleCloseModal();
  };

  const handleSendExistingBox = (boxId: string, customerId: string) => {
    updateFishBox(boxId, {
      customerId,
      status: 'sent',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      boxNumber: '',
      fishType: '',
      weight: 0,
      grade: 'A',
      customerId: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const totalSent = sentBoxes.length;
  const totalWeight = sentBoxes.reduce((sum, box) => sum + box.weight, 0);
  const todaySent = sentBoxes.filter(box => 
    new Date(box.date).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Fish Boxes Sent to Customer"
        description="Track outgoing fish box deliveries"
        icon={Send}
      >
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Record Shipment</span>
        </button>
      </PageHeader>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Send className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Sent</p>
              <p className="text-2xl font-bold text-gray-800">{totalSent}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Weight</p>
              <p className="text-2xl font-bold text-gray-800">{totalWeight.toFixed(1)} kg</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-100 rounded-xl">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Today's Shipments</p>
              <p className="text-2xl font-bold text-gray-800">{todaySent}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-xl">
              <User className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Available Boxes</p>
              <p className="text-2xl font-bold text-gray-800">{availableBoxes.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Available Boxes for Shipment */}
      {availableBoxes.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Available Boxes for Shipment</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableBoxes.slice(0, 6).map((box) => (
              <div key={box.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-800">{box.boxNumber}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    box.grade === 'A' 
                      ? 'bg-green-100 text-green-800' 
                      : box.grade === 'B' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    Grade {box.grade}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fish Type:</span>
                    <span className="font-medium">{box.fishType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weight:</span>
                    <span className="font-medium">{box.weight} kg</span>
                  </div>
                </div>

                <div className="mt-4">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleSendExistingBox(box.id, e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Send to Customer...</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
          
          {availableBoxes.length > 6 && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                +{availableBoxes.length - 6} more boxes available
              </p>
            </div>
          )}
        </div>
      )}

      {/* Sent Boxes Table */}
      <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Sent Fish Boxes</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Box Number</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Fish Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Weight (kg)</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Grade</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Customer</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Date Sent</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sentBoxes.map((box) => {
                const customer = customers.find(c => c.id === box.customerId);
                return (
                  <tr key={box.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-sm">{box.boxNumber}</td>
                    <td className="py-3 px-4 font-medium">{box.fishType}</td>
                    <td className="py-3 px-4">{box.weight.toFixed(1)}</td>
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
                      <div>
                        <p className="font-medium">{customer?.name || 'N/A'}</p>
                        {customer && (
                          <p className="text-sm text-gray-600">{customer.email}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">{new Date(box.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {sentBoxes.length === 0 && (
          <div className="text-center py-8">
            <Send className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No fish boxes sent yet.</p>
          </div>
        )}
      </div>

      {/* Record Shipment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Record Fish Box Shipment"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Box Number</label>
              <input
                type="text"
                value={formData.boxNumber}
                onChange={(e) => setFormData({ ...formData, boxNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fish Type</label>
              <input
                type="text"
                value={formData.fishType}
                onChange={(e) => setFormData({ ...formData, fishType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Grade</label>
              <select
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value as 'A' | 'B' | 'C' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="A">Grade A (Premium)</option>
                <option value="B">Grade B (Standard)</option>
                <option value="C">Grade C (Economy)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
              <select
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Sent</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
            >
              Record Shipment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}