// src/components/TurfCard.jsx
import React from 'react';
import { MapPin, Clock, DollarSign, Phone } from 'lucide-react';

const TurfCard = ({ turf, onBookNow }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Image Placeholder */}
      <div className="h-48 bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-4xl font-bold mb-2">🏟️</div>
          <p className="text-lg font-semibold">{turf.type}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{turf.name}</h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
            <span>{turf.location}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2 text-gray-400" />
            <span>
              {turf.operatingStartTime} - {turf.operatingEndTime}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="w-4 h-4 mr-2 text-gray-400" />
            <span>{turf.phone}</span>
          </div>
        </div>

        {turf.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {turf.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span className="text-2xl font-bold text-green-600">
              {turf.pricePerSlot}
            </span>
            <span className="text-sm text-gray-500 ml-1">/hour</span>
          </div>
          
          <button
            onClick={() => onBookNow(turf)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default TurfCard;