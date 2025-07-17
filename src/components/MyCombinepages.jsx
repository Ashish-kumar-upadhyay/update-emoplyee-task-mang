import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from './LoginForm';
import { EmployeeView } from './EmployeeView';
import { EmployerView } from './EmployerView';
import { PrivateRoute } from './PrivateRoute';
import ParticlesComponent from './particle';

export function MyCombinepages() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  return (
    <Router>
      <ParticlesComponent id="particles" className="absolute inset-0 z-0" />
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route
            path="/"
            element={user ? <Navigate to={`/dashboard/${user.role}`} /> : <LoginForm onLogin={handleLogin} />}
          />
          <Route
            path="/dashboard/employee"
            element={
              <PrivateRoute user={user} allowedRole="employee">
                <EmployeeView user={user} />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/employer"
            element={
              <PrivateRoute user={user} allowedRole="employer">
                <EmployerView user={user} />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default MyCombinepages;