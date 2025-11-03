// src/services/turfService.js
import api from './authService';

export const turfService = {
  // Get all turfs
  getAllTurfs: async () => {
    const response = await api.get('/turfs');
    return response.data;
  },

  // Get turf by ID
  getTurfById: async (id) => {
    const response = await api.get(`/turfs/${id}`);
    return response.data;
  },

  // Search turfs
  searchTurfs: async (searchParams) => {
    const response = await api.post('/turfs/search', searchParams);
    return response.data;
  },

  // Get turfs by sport type
  getTurfsBySportType: async (type) => {
    const response = await api.get(`/turfs/sport/${type}`);
    return response.data;
  },

  // Get available time slots
  getAvailableTimeSlots: async (turfId, date) => {
    const response = await api.get(`/turfs/${turfId}/available-slots`, {
      params: { date }
    });
    return response.data;
  },

  // Check slot availability
  checkSlotAvailability: async (turfId, date, startTime, endTime) => {
    const response = await api.get(`/turfs/${turfId}/check-availability`, {
      params: { date, startTime, endTime }
    });
    return response.data;
  },

  // Search turfs by location
  searchByLocation: async (location) => {
    const response = await api.get('/turfs/search/location', {
      params: { location }
    });
    return response.data;
  },

  // Get popular turfs
  getPopularTurfs: async () => {
    const response = await api.get('/turfs/popular');
    return response.data;
  },

  // Get turfs by owner ID
  getTurfsByOwnerId: async (ownerId) => {
    const response = await api.get(`/turfs/owner/${ownerId}`);
    return response.data;
  },

  // Create new turf
  createTurf: async (turfData) => {
    const response = await api.post('/turfs', turfData);
    return response.data;
  },

  // Update turf
  updateTurf: async (id, turfData) => {
    const response = await api.put(`/turfs/${id}`, turfData);
    return response.data;
  },

  // Delete turf
  deleteTurf: async (id) => {
    const response = await api.delete(`/turfs/${id}`);
    return response.data;
  }
};