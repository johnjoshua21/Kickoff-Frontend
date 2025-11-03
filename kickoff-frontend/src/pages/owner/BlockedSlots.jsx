// src/pages/owner/BlockSlots.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { turfService } from '../../services/turfService';
import api from '../../services/authService';
import { Ban, Plus, Trash2, Calendar, Clock, AlertCircle } from 'lucide-react';

const BlockSlots = () => {
  const { user } = useAuth();
  const [turfs, setTurfs] = useState([]);
  const [blockedSlots, setBlockedSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    turfId: '',
    blockedDate: '',
    startTime: '',
    endTime: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const turfsResponse = await turfService.getTurfsByOwnerId(user.userId);
      setTurfs(turfsResponse);

      const blockedResponse = await api.get(`/blocked-slots/owner/${user.userId}`);
      setBlockedSlots(blockedResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.turfId || !formData.blockedDate || !formData.startTime || !formData.endTime) {
      setError('All fields are required');
      return;
    }

    if (formData.startTime >= formData.endTime) {
      setError('End time must be after start time');
      return;
    }

    try {
      await api.post('/blocked-slots', formData);
      alert('Slot blocked successfully!');
      setShowModal(false);
      setFormData({
        turfId: '',
        blockedDate: '',
        startTime: '',
        endTime: ''
      });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to block slot');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to unblock this slot?')) {
      return;
    }

    try {
      await api.delete(`/blocked-slots/${id}`);
      alert('Slot unblocked successfully');
      fetchData();
    } catch (error) {
      alert('Failed to unblock slot');
    }
  };

  const today = new Date().toISOString().split('T')[0];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Block Time Slots</h1>
          <p className="mt-2 text-gray-600">Block slots when your turf is unavailable</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Block Slot
        </button>
      </div>

      {blockedSlots.length === 0 ? (
        <div className="bg-white p-12 rounded-lg text-center border border-gray-200">
          <Ban className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No blocked slots</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blockedSlots.map((slot) => (
            <div key={slot.id} className="bg-white rounded-lg shadow-sm border-2 border-red-200 p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{slot.turfName}</h3>
                  <p className="text-sm text-gray-500">{slot.turfLocation}</p>
                </div>
                <button
                  onClick={() => handleDelete(slot.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(slot.blockedDate).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  {slot.startTime} - {slot.endTime}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Block Slot Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Block Time Slot</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Turf</label>
                <select
                  value={formData.turfId}
                  onChange={(e) => setFormData({ ...formData, turfId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="">Choose a turf</option>
                  {turfs.map(turf => (
                    <option key={turf.id} value={turf.id}>{turf.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  min={today}
                  value={formData.blockedDate}
                  onChange={(e) => setFormData({ ...formData, blockedDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Block Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlockSlots;