// src/pages/user/BrowseTurfs.jsx
import React, { useState, useEffect } from 'react';
import { turfService } from '../../services/turfService';
import { Search, MapPin, DollarSign, Clock, Filter } from 'lucide-react';
import TurfCard from '../../components/TurfCard';
import BookingModal from '../../components/BookingModal';

const BrowseTurfs = () => {
  const [turfs, setTurfs] = useState([]);
  const [filteredTurfs, setFilteredTurfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTurf, setSelectedTurf] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  
  const [filters, setFilters] = useState({
    search: '',
    sportType: '',
    location: '',
    minPrice: '',
    maxPrice: ''
  });

  const sportTypes = [
    'FOOTBALL', 'CRICKET', 'BADMINTON', 'TENNIS', 
    'BASKETBALL', 'VOLLEYBALL', 'HOCKEY', 'FUTSAL'
  ];

  useEffect(() => {
    fetchTurfs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, turfs]);

  const fetchTurfs = async () => {
    try {
      setLoading(true);
      const data = await turfService.getAllTurfs();
      setTurfs(data);
      setFilteredTurfs(data);
    } catch (error) {
      console.error('Error fetching turfs:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...turfs];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(turf =>
        turf.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        turf.location.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Sport type filter
    if (filters.sportType) {
      filtered = filtered.filter(turf => turf.type === filters.sportType);
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(turf =>
        turf.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Price filters
    if (filters.minPrice) {
      filtered = filtered.filter(turf => turf.pricePerSlot >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(turf => turf.pricePerSlot <= parseFloat(filters.maxPrice));
    }

    setFilteredTurfs(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleBookNow = (turf) => {
    setSelectedTurf(turf);
    setShowBookingModal(true);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      sportType: '',
      location: '',
      minPrice: '',
      maxPrice: ''
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading turfs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Browse Turfs</h1>
        <p className="mt-2 text-gray-600">Find and book the perfect turf for your game</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </h3>
          <button
            onClick={clearFilters}
            className="text-sm text-green-600 hover:text-green-700 font-medium"
          >
            Clear all
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name or location..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Sport Type */}
          <div>
            <select
              value={filters.sportType}
              onChange={(e) => handleFilterChange('sportType', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Sports</option>
              {sportTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Min Price */}
          <div>
            <input
              type="number"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Max Price */}
          <div>
            <input
              type="number"
              placeholder="Max Price"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <div>
        <p className="text-sm text-gray-600 mb-4">
          Showing {filteredTurfs.length} of {turfs.length} turfs
        </p>

        {filteredTurfs.length === 0 ? (
          <div className="bg-white p-12 rounded-lg text-center">
            <p className="text-gray-500">No turfs found matching your criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTurfs.map(turf => (
              <TurfCard
                key={turf.id}
                turf={turf}
                onBookNow={handleBookNow}
              />
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedTurf && (
        <BookingModal
          turf={selectedTurf}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedTurf(null);
          }}
          onSuccess={() => {
            setShowBookingModal(false);
            setSelectedTurf(null);
          }}
        />
      )}
    </div>
  );
};

export default BrowseTurfs;