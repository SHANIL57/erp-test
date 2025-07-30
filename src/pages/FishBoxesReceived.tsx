import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import { Archive, Plus, Edit2, Trash2, Calendar, Scale, CheckCircle } from 'lucide-react';

export default function FishBoxesReceived() {
  const { fishBoxes, parties, addFishBox, updateFishBox } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBox, setEditingBox] = useState(null);
  const [formData, setFormData] = useState({
    boxNumber: '',
    fishType: '',
    weight: 0,
    grade: 'A' as 'A' | 'B' | 'C',
    supplierId: '',
    date: new Date().toISOString().split('T')[0]
  });

  const receivedBoxes = fishBoxes.filter(box => box.status === 'received' || box.status === 'in_stock');
  const suppliers = parties.filter(p => p.type === 'supplier');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const boxData = {
      ...formData,
      status: 'received' as const
    };

    if (editingBox) {
      updateFishBox(editingBox.id, boxData);
    } else {
      addFishBox(boxData);
    }
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBox(null);
    setFormData({
      boxNumber: '',
      fishType: '',
      weight: 0,
      grade: 'A',
      supplierId: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleEdit = (box) => {
    setEditingBox(box);
    setFormData({
      boxNumber: box.boxNumber,
      fishType: box.fishType,
      weight: box.weight,
      grade: box.grade,
      supplierId: box.supplierId || '',
      date: box.date
    });
    setIsModalOpen(true);
  };

  const totalBoxes = receivedBoxes.length;
  const totalWeight = receivedBoxes.reduce((sum, box) => sum + box.weight, 0);
  const gradeDistribution = receivedBoxes.reduce((acc, box) => {
    acc[box.grade] = (acc[box.grade] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Fish Boxes Received"
        description="Track incoming fish box inventory"
        icon={Archive}
      >
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Record Receipt</span>
        </button>
      </PageHeader>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Archive className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Boxes</p>
              <p className="text-2xl font-bold text-gray-800">{totalBoxes}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <Scale className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Weight</p>
              <p className="text-2xl font-bold text-gray-800">{totalWeight.toFixed(1)} kg</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 rounded-xl">
              <CheckCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Grade A Boxes</p>
              <p className="text-2xl font-bold text-gray-800">{gradeDistribution['A'] || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Today's Receipts</p>
              <p className="text-2xl font-bold text-gray-800">
                {receivedBoxes.filter(box => 
                  new Date(box.date).toDateString() === new Date().toDateString()
                ).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grade Distribution */}
      <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Grade Distribution</h3>
        <div className="grid grid-cols-3 gap-4">
          {['A', 'B', 'C'].map(grade => (
            <div key={grade} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center text-white font-bold ${
                grade === 'A' ? 'bg-green-500' : grade === 'B' ? 'bg-yellow-500' : 'bg-red-500'
              }`}>
                {grade}
              </div>
              <p className="text-2xl font-bold text-gray-800">{gradeDistribution[grade] || 0}</p>
              <p className="text-sm text-gray-600">Grade {grade} Boxes</p>
            </div>
          ))}
        </div>
      </div>

      {/* Received Boxes Table */}
      <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Received Fish Boxes</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Box Number</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Fish Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Weight (kg)</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Grade</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Supplier</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Date Received</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {receivedBoxes.map((box) => {
                const supplier = suppliers.find(s => s.id === box.supplierId);
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
                    <td className="py-3 px-4">{supplier?.name || 'N/A'}</td>
                    <td className="py-3 px-4">{new Date(box.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        box.status === 'received' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {box.status === 'received' ? 'Received' : 'In Stock'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleEdit(box)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {receivedBoxes.length === 0 && (
          <div className="text-center py-8">
            <Archive className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No fish boxes received yet.</p>
          </div>
        )}
      </div>

      {/* Record Receipt Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingBox ? 'Edit Fish Box' : 'Record Fish Box Receipt'}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Supplier</label>
              <select
                value={formData.supplierId}
                onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Received</label>
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
              {editingBox ? 'Update' : 'Record'} Receipt
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}