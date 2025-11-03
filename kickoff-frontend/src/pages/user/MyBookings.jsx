// src/pages/user/MyBookings.jsx
import React, { useState, useEffect } from 'react';
import { bookingService } from '../../services/bookingService';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, MapPin, DollarSign, X, CheckCircle } from 'lucide-react';

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, cancelled

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getMyBookings(user.userId);
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await bookingService.cancelBooking(bookingId);
      alert('Booking cancelled successfully');
      fetchBookings();
    } catch (error) {
      alert('Failed to cancel booking');
      console.error('Error cancelling booking:', error);
    }
  };

  const getFilteredBookings = () => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().split(' ')[0].substring(0, 5);

    switch (filter) {
      case 'upcoming':
        return bookings.filter(booking => {
          const isUpcoming = booking.bookingDate > today || 
            (booking.bookingDate === today && booking.slotStartTime > currentTime);
          return isUpcoming && booking.status === 'CONFIRMED';
        });
      case 'cancelled':
        return bookings.filter(booking => booking.status === 'CANCELLED');
      default:
        return bookings;
    }
  };

  const filteredBookings = getFilteredBookings();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        <p className="mt-2 text-gray-600">View and manage your turf bookings</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all'
              ? 'bg-green-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          All ({bookings.length})
        </button>
        <button
          onClick={() => setFilter('upcoming')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'upcoming'
              ? 'bg-green-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setFilter('cancelled')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'cancelled'
              ? 'bg-green-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Cancelled
        </button>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white p-12 rounded-lg text-center border border-gray-200">
          <p className="text-gray-500">
            {filter === 'all' 
              ? 'No bookings found. Start booking some turfs!' 
              : `No ${filter} bookings found.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredBookings.map(booking => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={handleCancelBooking}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const BookingCard = ({ booking, onCancel }) => {
  const isUpcoming = new Date(booking.bookingDate) >= new Date();
  const isCancelled = booking.status === 'CANCELLED';

  return (
    <div className={`bg-white rounded-lg shadow-sm border-2 overflow-hidden ${
      isCancelled ? 'border-red-200' : isUpcoming ? 'border-green-200' : 'border-gray-200'
    }`}>
      <div className={`p-4 ${
        isCancelled ? 'bg-red-50' : isUpcoming ? 'bg-green-50' : 'bg-gray-50'
      }`}>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">{booking.turfName}</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            isCancelled 
              ? 'bg-red-100 text-red-700' 
              : 'bg-green-100 text-green-700'
          }`}>
            {booking.status}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
          <span>{booking.turfLocation}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
          <span>{new Date(booking.bookingDate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-2 text-gray-400" />
          <span>{booking.slotStartTime} - {booking.slotEndTime}</span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div className="flex items-center text-lg font-bold text-green-600">
            <DollarSign className="w-5 h-5" />
            <span>{booking.totalPrice}</span>
          </div>

          {!isCancelled && isUpcoming && (
            <button
              onClick={() => onCancel(booking.id)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
            >
              Cancel Booking
            </button>
          )}
        </div>

        <div className="pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Owner: {booking.turfOwnerName} ({booking.turfOwnerPhone})
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyBookings;