import React, { useState } from 'react';
import { useData, Party } from '../context/DataContext';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import { Building2, Plus, Edit2, Trash2, Phone, MapPin, DollarSign, Tag } from 'lucide-react';

export default function PartyManagement() {
  const { parties, addParty, updateParty, deleteParty } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParty, setEditingParty] = useState<Party | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'supplier' as 'supplier' | 'distributor',
    contact: '',
    address: '',
    balance: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingParty) {
      updateParty(editingParty.id, formData);
    } else {
      addParty(formData);
    }
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingParty(null);
    setFormData({
      name: '',
      type: 'supplier',
      contact: '',
      address: '',
      balance: 0
    });
  };

  const handleEdit = (party: Party) => {
    setEditingParty(party);
    setFormData({
      name: party.name,
      type: party.type,
      contact: party.contact,
      address: party.address,
      balance: party.balance
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this party?')) {
      deleteParty(id);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Party Management"
        description="Manage suppliers and distributors"
        icon={Building2}
      >
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Party</span>
        </button>
      </PageHeader>

      {/* Filter Buttons */}
      <div className="flex items-center space-x-4">
        <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium">
          All ({parties.length})
        </button>
        <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">
          Suppliers ({parties.filter(p => p.type === 'supplier').length})
        </button>
        <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">
          Distributors ({parties.filter(p => p.type === 'distributor').length})
        </button>
      </div>

      {/* Parties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {parties.map((party) => (
          <div key={party.id} className="bg-white rounded-xl shadow-sm border border-orange-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-semibold text-gray-800">{party.name}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  party.type === 'supplier'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {party.type}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(party)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(party.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-600">
                <Phone className="w-4 h-4" />
                <span className="text-sm">{party.contact}</span>
              </div>
              <div className="flex items-start space-x-3 text-gray-600">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span className="text-sm">{party.address}</span>
              </div>
              <div className="flex items-center space-x-3">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className={`text-sm font-semibold ${
                  party.balance >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  ${party.balance.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Added: {new Date(party.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {parties.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No parties found. Add your first supplier or distributor to get started.</p>
        </div>
      )}

      {/* Add/Edit Party Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingParty ? 'Edit Party' : 'Add New Party'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'supplier' | 'distributor' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="supplier">Supplier</option>
              <option value="distributor">Distributor</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact</label>
            <input
              type="tel"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Balance</label>
            <input
              type="number"
              step="0.01"
              value={formData.balance}
              onChange={(e) => setFormData({ ...formData, balance: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
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
              {editingParty ? 'Update' : 'Add'} Party
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}