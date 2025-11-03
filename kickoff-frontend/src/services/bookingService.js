// src/services/bookingService.js
import api from './authService';

export const bookingService = {
  // Create new booking
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  // Get all bookings for current user
  getMyBookings: async (userId) => {
    const response = await api.get(`/bookings/user/${userId}`);
    return response.data;
  },

  // Get booking by ID
  getBookingById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (id) => {
    const response = await api.put(`/bookings/${id}/cancel`);
    return response.data;
  },

  // Get upcoming bookings
  getUpcomingBookings: async (userId) => {
    const response = await api.get(`/bookings/user/${userId}/upcoming`);
    return response.data;
  },

  // Calculate booking price
  calculatePrice: async (turfId, startTime, endTime) => {
    const response = await api.get('/bookings/calculate-price', {
      params: { turfId, startTime, endTime }
    });
    return response.data;
  },

  // Check if slot is available
  checkAvailability: async (turfId, date, startTime, endTime) => {
    const response = await api.get('/bookings/check-availability', {
      params: { turfId, date, startTime, endTime }
    });
    return response.data;
  }
};