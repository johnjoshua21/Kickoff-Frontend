// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import UserLayout from './components/UserLayout';
import BrowseTurfs from './pages/user/BrowseTurfs';
import MyBookings from './pages/user/MyBookings';
import UserProfile from './pages/user/UserProfile';
import OwnerLayout from './components/OwnerLayout';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import MyTurfs from './pages/owner/MyTurfs';
import OwnerBookings from './pages/owner/OwnerBookings';
import OwnerProfile from './pages/owner/OwnerProfile';
import BlockSlots from './pages/owner/BlockedSlots';        

const AdminDashboard = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      <p className="mt-2 text-gray-600">Manage the platform!</p>
    </div>
  </div>
);

const Unauthorized = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-red-600">Unauthorized</h1>
      <p className="mt-2 text-gray-600">You don't have permission to access this page.</p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Routes - User */}
          <Route
            path="/user/*"
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <UserLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<BrowseTurfs />} />
            <Route path="bookings" element={<MyBookings />} />
            <Route path="profile" element={<UserProfile />} />
          </Route>

          {/* Protected Routes - Turf Owner - FIXED */}
          <Route
            path="/owner/*"
            element={
              <ProtectedRoute allowedRoles={['TURF_OWNER']}>
                <OwnerLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<OwnerDashboard />} />
            <Route path="turfs" element={<MyTurfs />} />
            <Route path="bookings" element={<OwnerBookings />} />
            <Route path="profile" element={<OwnerProfile />} />
            <Route path="block-slots" element={<BlockSlots />} />
            {/* Add more owner routes here later */}
          </Route>

          {/* Protected Routes - Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;