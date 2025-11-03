// src/components/BookingModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, DollarSign, AlertCircle } from 'lucide-react';
import { bookingService } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';

const BookingModal = ({ turf, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    bookingDate: '',
    slotStartTime: '',
    slotEndTime: '',
  });
  const [totalPrice, setTotalPrice] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (formData.slotStartTime && formData.slotEndTime) {
      calculatePrice();
    }
  }, [formData.slotStartTime, formData.slotEndTime]);

  const calculatePrice = async () => {
    try {
      const response = await bookingService.calculatePrice(
        turf.id,
        formData.slotStartTime,
        formData.slotEndTime
      );
      setTotalPrice(response.totalPrice);
    } catch (err) {
      console.error('Error calculating price:', err);
    }
  };

  const checkAvailability = async () => {
    if (!formData.bookingDate || !formData.slotStartTime || !formData.slotEndTime) {
      return;
    }

    try {
      setCheckingAvailability(true);
      const response = await bookingService.checkAvailability(
        turf.id,
        formData.bookingDate,
        formData.slotStartTime,
        formData.slotEndTime
      );

      if (!response.available) {
        setError('This time slot is not available. Please choose another time.');
      } else {
        setError('');
      }
    } catch (err) {
      setError('Error checking availability');
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.bookingDate || !formData.slotStartTime || !formData.slotEndTime) {
      setError('Please fill in all fields');
      return;
    }

    // Validate time
    if (formData.slotStartTime >= formData.slotEndTime) {
      setError('End time must be after start time');
      return;
    }

    setLoading(true);

    try {
      const bookingData = {
        ...formData,
        userId: user.userId,
        turfId: turf.id,
        status: 'CONFIRMED'
      };

      await bookingService.createBooking(bookingData);
      onSuccess();
      alert('Booking confirmed successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Book {turf.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Turf Info */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Location:</span> {turf.location}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Type:</span> {turf.type}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Operating Hours:</span> {turf.operatingStartTime} - {turf.operatingEndTime}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Price:</span> ₹{turf.pricePerSlot}/hour
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline w-4 h-4 mr-1" />
              Select Date
            </label>
            <input
              type="date"
              name="bookingDate"
              min={today}
              value={formData.bookingDate}
              onChange={handleChange}
              onBlur={checkAvailability}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Start Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="inline w-4 h-4 mr-1" />
              Start Time
            </label>
            <input
              type="time"
              name="slotStartTime"
              value={formData.slotStartTime}
              onChange={handleChange}
              onBlur={checkAvailability}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* End Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="inline w-4 h-4 mr-1" />
              End Time
            </label>
            <input
              type="time"
              name="slotEndTime"
              value={formData.slotEndTime}
              onChange={handleChange}
              onBlur={checkAvailability}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Total Price */}
          {totalPrice !== null && (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Total Price:</span>
                <div className="flex items-center text-2xl font-bold text-green-600">
                  <DollarSign className="w-6 h-6" />
                  {totalPrice}
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || checkingAvailability || !!error}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Booking...' : checkingAvailability ? 'Checking...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;